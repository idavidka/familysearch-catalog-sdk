/**
 * Catalog API module for FamilySearch Catalog API
 *
 * Provides functionality for:
 * - Catalog record search
 * - Coverage period extraction
 * - Parish/registry lookup
 */

import type { CatalogPlacesClient } from "../client/index";
import type {
	CatalogSearchResult,
	CoveragePeriod,
	ParishInfo,
	CatalogServiceSearchResponse,
	CatalogServiceRecord,
	CatalogServiceMetadata,
} from "../types/index";
import type {
	ReligionTranslations,
	ChurchPattern,
	ParishPattern,
} from "./religion-config";
import { ReligionConfig } from "./religion-config";

/**
 * Catalog API options
 */
export interface CatalogAPIOptions {
	/** Additional religion translations */
	additionalReligionTranslations?: ReligionTranslations[];
	/** Additional church patterns for extracting religion and parish */
	additionalChurchPatterns?: ChurchPattern[];
	/** Additional parish-only patterns */
	additionalParishPatterns?: ParishPattern[];
}

/**
 * Catalog API
 */
export class CatalogAPI {
	private religionConfig: ReligionConfig;

	constructor(
		private client: CatalogPlacesClient,
		options: CatalogAPIOptions = {}
	) {
		this.religionConfig = new ReligionConfig(
			options.additionalReligionTranslations || [],
			options.additionalChurchPatterns || [],
			options.additionalParishPatterns || []
		);
	}

	/**
	 * Search catalog by place name
	 *
	 * @param placeName Place name to search for
	 * @param options Search options
	 *
	 * @example
	 * ```typescript
	 * const records = await catalog.searchByPlace("Kismaros, Hungary");
	 * console.log(records[0].title);
	 * ```
	 */
	async searchByPlace(
		placeName: string,
		options: {
			count?: number;
			start?: number;
		} = {}
	): Promise<CatalogSearchResult[]> {
		console.log(
			"[CatalogAPI] searchByPlace called with:",
			placeName,
			options
		);

		const params: Record<string, string | number> = {
			place: placeName,
		};

		if (options.count) {
			params.count = options.count;
		}
		if (options.start) {
			params.start = options.start;
		}

		console.log("[CatalogAPI] Request params:", params);

		try {
			// Use getCatalog() for authenticated Catalog API requests
			const response = await this.client.getCatalog<{
				entries?: Array<{
					id?: string;
					title?: string;
					content?: {
						gedcomx?: {
							description?: string;
							attribution?: {
								creator?: {
									name?: string;
								};
							};
						};
					};
				}>;
			}>("/platform/search/catalog", params);

			console.log("[CatalogAPI] Response:", response);

			const entries = response?.entries || [];
			const results: CatalogSearchResult[] = [];

			for (const entry of entries) {
				const title = entry.title || "";
				const author =
					entry.content?.gedcomx?.attribution?.creator?.name || "";
				const description = entry.content?.gedcomx?.description || "";

				// Extract years from title or description
				const years = this.extractYears(title + " " + description);

				results.push({
					id: entry.id || "",
					title,
					author,
					coverageYears: years,
					place: placeName,
					type: "catalog",
					url: entry.id
						? `https://www.familysearch.org/catalog/${entry.id}`
						: "",
					metadata: {
						description,
					},
				});
			}

			return results;
		} catch (error) {
			console.error("Error searching catalog:", error);
			return [];
		}
	}

	/**
	 * Get catalog record details by ID
	 *
	 * @param recordId Catalog record ID
	 */
	async getRecordDetails(
		recordId: string
	): Promise<CatalogSearchResult | null> {
		try {
			// Use getCatalog() for authenticated Catalog API requests
			const response = await this.client.getCatalog<{
				title?: string;
				content?: {
					gedcomx?: {
						description?: string;
						attribution?: {
							creator?: {
								name?: string;
							};
						};
					};
				};
			}>(`/platform/catalog/${recordId}`);

			if (!response) {
				return null;
			}

			const title = response.title || "";
			const author =
				response.content?.gedcomx?.attribution?.creator?.name || "";
			const description = response.content?.gedcomx?.description || "";
			const years = this.extractYears(title + " " + description);

			return {
				id: recordId,
				title,
				author,
				coverageYears: years,
				place: "",
				type: "catalog",
				url: `https://www.familysearch.org/catalog/${recordId}`,
				metadata: {
					description,
				},
			};
		} catch (error) {
			console.error(`Error fetching record ${recordId}:`, error);
			return null;
		}
	}

	/**
	 * Get coverage period from catalog records
	 *
	 * @param records Catalog search results
	 */
	getCoveragePeriod(records: CatalogSearchResult[]): CoveragePeriod | null {
		if (records.length === 0) {
			return null;
		}

		let minYear = Infinity;
		let maxYear = -Infinity;
		const originalTexts: string[] = [];

		for (const record of records) {
			const years = this.parseYearRange(record.coverageYears);
			if (years) {
				minYear = Math.min(minYear, years.start);
				maxYear = Math.max(maxYear, years.end);
				originalTexts.push(record.coverageYears);
			}
		}

		if (minYear === Infinity || maxYear === -Infinity) {
			return null;
		}

		return {
			startYear: minYear,
			endYear: maxYear,
			originalText: originalTexts.join(", "),
			confidence: records.length > 0 ? 0.8 : 0.5,
		};
	}

	/**
	 * Extract parish information from catalog records
	 *
	 * @param records Catalog search results
	 */
	extractParishInfo(records: CatalogSearchResult[]): ParishInfo[] {
		const parishes: ParishInfo[] = [];

		for (const record of records) {
			const title = record.title.toLowerCase();

			// Extract parish name (simple heuristic)
			const parishMatch = title.match(
				/(roman catholic|lutheran|reformed|evangelical)\s+(parish|church)\s+of\s+([^,]+)/i
			);

			if (parishMatch) {
				parishes.push({
					name: parishMatch[3].trim(),
					type: parishMatch[1].trim(),
					location: record.place,
				});
			}
		}

		return parishes;
	}

	/**
	 * Extract year range from text (e.g., "1730-1895")
	 */
	private extractYears(text: string): string {
		const yearRangeMatch = text.match(/(\d{4})\s*[-–]\s*(\d{4})/);
		if (yearRangeMatch) {
			return `${yearRangeMatch[1]}-${yearRangeMatch[2]}`;
		}

		const singleYearMatch = text.match(/(\d{4})/);
		if (singleYearMatch) {
			return singleYearMatch[1];
		}

		return "";
	}

	/**
	 * Parse year range string into start and end years
	 */
	private parseYearRange(
		yearString: string
	): { start: number; end: number } | null {
		const rangeMatch = yearString.match(/(\d{4})\s*[-–]\s*(\d{4})/);
		if (rangeMatch) {
			return {
				start: parseInt(rangeMatch[1], 10),
				end: parseInt(rangeMatch[2], 10),
			};
		}

		const singleMatch = yearString.match(/(\d{4})/);
		if (singleMatch) {
			const year = parseInt(singleMatch[1], 10);
			return { start: year, end: year };
		}

		return null;
	}

	/**
	 * Search catalog using Catalog Service v3 API (requires session cookie)
	 * This is a two-step process:
	 * 1. Search by place to get subject IDs
	 * 2. For each subject ID, fetch detailed records
	 *
	 * @param placeName Place name to search for
	 * @param options Search options
	 */
	async searchCatalogService(
		placeName: string,
		options: {
			count?: number;
			offset?: number;
		} = {}
	): Promise<CatalogServiceRecord[]> {
		const count = options.count || 20;
		const offset = options.offset || 0;

		// Step 1: Search by place to get subject groups
		const initialParams = {
			count: String(count),
			groupBy: "placeSubject",
			"m.defaultFacets": "on",
			"m.queryRequireDefault": "on",
			offset: String(offset),
			"q.place": placeName,
			"q.place.exact": "on",
		};

		const initialResponse =
			await this.client.getCatalogService<CatalogServiceSearchResponse>(
				"/service/search/catalog/v3/search",
				initialParams
			);

		if (
			!initialResponse ||
			!initialResponse.searchHits ||
			initialResponse.searchHits.length === 0
		) {
			return [];
		}

		// Step 2: For each subject, fetch detailed records
		const allRecords: CatalogServiceRecord[] = [];

		for (const hit of initialResponse.searchHits) {
			const subjectId = hit.metadataHit.metadata.identifier.value;

			// Fetch records for this subject
			const detailParams = {
				"m.defaultFacets": "on",
				"m.queryRequireDefault": "on",
				count: String(count),
				offset: "0",
				"q.place": placeName,
				"q.place.exact": "on",
				"q.subjectId": subjectId,
			};

			try {
				const detailResponse =
					await this.client.getCatalogService<CatalogServiceSearchResponse>(
						"/service/search/catalog/v3/search",
						detailParams
					);

				if (detailResponse && detailResponse.searchHits) {
					for (const detailHit of detailResponse.searchHits) {
						const record = this.parseCatalogServiceRecord(
							detailHit.metadataHit.metadata
						);
						allRecords.push(record);
					}
				}
			} catch (error) {
				console.error(
					`Error fetching details for subject ${subjectId}:`,
					error
				);
			}
		}

		return allRecords;
	}

	/**
	 * Parse CatalogServiceMetadata into CatalogServiceRecord
	 */
	private parseCatalogServiceRecord(
		metadata: CatalogServiceMetadata
	): CatalogServiceRecord {
		const title = metadata.title[0]?.value || "";
		const creators = metadata.creator || [];
		const subjects = metadata.subject || [];
		const repositories =
			metadata.repositoryCalls?.map((r) => r.title) || [];

		// Extract ID from identifier
		const identifierValue = metadata.identifier.value;
		const kohaMatch = identifierValue.match(/koha:(\d+)/);
		const id = kohaMatch ? kohaMatch[1] : identifierValue;

		// Extract coverage years from title
		const coverageYears = this.extractYears(title);

		// Extract parish and religion from creators
		const { parish, religion } = this.extractParishAndReligion(creators);

		// Build URL
		const url = id
			? `${this.client.getWebBaseUrl()}/search/catalog/koha:${id}`
			: "";

		return {
			id,
			title,
			creators,
			subjects,
			coverageYears,
			repositories,
			url,
			parish,
			religion,
		};
	}

	/**
	 * Extract parish name and religion from creator strings
	 *
	 * Uses configurable patterns from ReligionConfig to support multiple languages.
	 * Religion names are automatically normalized to canonical English form.
	 */
	private extractParishAndReligion(creators: string[]): {
		parish?: string;
		religion?: string;
	} {
		const result: { parish?: string; religion?: string } = {};

		for (const creator of creators) {
			// Try to match church patterns (extracts both religion and parish)
			const churchMatch =
				this.religionConfig.extractFromChurchPattern(creator);
			if (churchMatch && churchMatch.religion && churchMatch.parish) {
				result.religion = churchMatch.religion;
				result.parish = churchMatch.parish;
				break;
			}

			// Try to match parish-only patterns
			if (!result.parish) {
				const parishMatch =
					this.religionConfig.extractFromParishPattern(creator);
				if (parishMatch) {
					result.parish = parishMatch;
				}
			}

			// Try to detect religion from keywords
			if (!result.religion) {
				const detected = this.religionConfig.detectReligion(creator);
				if (detected) {
					result.religion = detected;
				}
			}
		}

		return result;
	}
}

export {
	type CatalogSearchResult,
	type CoveragePeriod,
	type ParishInfo,
} from "../types/index";
export {
	type ReligionTranslations,
	type ChurchPattern,
	type ParishPattern,
	ReligionConfig,
	DEFAULT_RELIGION_TRANSLATIONS,
	DEFAULT_CHURCH_PATTERNS,
	DEFAULT_PARISH_PATTERNS,
} from "./religion-config";
