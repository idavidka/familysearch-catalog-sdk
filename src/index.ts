/**
 * FamilySearch Catalog & Places SDK
 *
 * A TypeScript SDK for interacting with FamilySearch Catalog and Places APIs
 *
 * @packageDocumentation
 */

import type { CatalogAPIOptions } from "./catalog/index";
import { CatalogAPI } from "./catalog/index";
import { CatalogPlacesClient } from "./client/index";
import * as Parser from "./parser/index";
import { PlacesAPI } from "./places/index";
import type {
	CatalogPlacesClientConfig,
	ResolvedPlace,
	CatalogSource,
	PlaceSearchResult,
	CatalogSearchResult,
	CatalogServiceRecord,
	CatalogServiceSearchResult,
} from "./types/index";

/**
 * FamilySearch resolver options
 */
export interface FamilySearchCatalogOptions
	extends CatalogPlacesClientConfig, CatalogAPIOptions {}

/**
 * High-level FamilySearch resolver
 *
 * Combines Places and Catalog APIs to resolve:
 * - Place normalization
 * - Parish/registry lookup
 * - Coverage period extraction
 *
 * @example
 * ```typescript
 * const resolver = new FamilySearchCatalog({
 *   clientId: process.env.FS_CLIENT_ID!,
 *   clientSecret: process.env.FS_CLIENT_SECRET,
 *   additionalReligionTranslations: [
 *     { canonical: "Roman Catholic", names: ["Római Katólikus", "Rímsko-katolícka"] }
 *   ]
 * });
 *
 * const result = await resolver.resolvePlace("Kismaros, Hungary");
 * console.log(result);
 * ```
 */
export class FamilySearchCatalog {
	private client: CatalogPlacesClient;
	private places: PlacesAPI;
	private catalog: CatalogAPI;

	constructor(
		options: FamilySearchCatalogOptions = {} as FamilySearchCatalogOptions
	) {
		// Separate CatalogAPIOptions from CatalogPlacesClientConfig
		const {
			additionalReligionTranslations,
			additionalChurchPatterns,
			additionalParishPatterns,
			...clientConfig
		} = options;

		this.client = new CatalogPlacesClient(clientConfig);
		this.places = new PlacesAPI(this.client);
		this.catalog = new CatalogAPI(this.client, {
			additionalReligionTranslations,
			additionalChurchPatterns,
			additionalParishPatterns,
		});
	}

	/**
	 * Resolve a place name to get standardized information and related catalog sources
	 *
	 * @param placeName Place name to resolve
	 * @param options Resolution options
	 *
	 * @example
	 * ```typescript
	 * const result = await resolver.resolvePlace("Kismaros, Hungary");
	 * console.log(result.standardizedName); // "Kismaros, Pest, Hungary"
	 * console.log(result.registry); // "Roman Catholic Parish of Nagymaros"
	 * console.log(result.coverage); // "1730-1895"
	 * ```
	 */
	async resolvePlace(
		placeName: string,
		options: {
			includeCatalog?: boolean;
			maxSources?: number;
		} = {}
	): Promise<ResolvedPlace | null> {
		const { includeCatalog = true, maxSources = 10 } = options;

		// Step 1: Normalize the place name
		const normalized = await this.places.normalizePlace(placeName);
		if (normalized.confidence < 0.5) {
			return null;
		}

		// Step 2: Search catalog for related records
		const catalogRecords = includeCatalog
			? await this.catalog.searchByPlace(normalized.standardized, {
					count: maxSources,
				})
			: [];

		// Step 3: Extract parish information
		const parishes = this.catalog.extractParishInfo(catalogRecords);
		const primaryParish = parishes[0]?.name || "";

		// Step 4: Get coverage period
		const coverage = this.catalog.getCoveragePeriod(catalogRecords);
		const coverageString = coverage
			? Parser.formatYearRange(coverage.startYear, coverage.endYear)
			: "";

		// Step 5: Format catalog sources
		const sources: CatalogSource[] = catalogRecords.map((record) => ({
			id: record.id,
			title: record.title,
			author: record.author,
			years: record.coverageYears,
			url: record.url,
		}));

		return {
			placeId: normalized.placeId || "",
			standardizedName: normalized.standardized,
			registry: primaryParish,
			coverage: coverageString,
			sources,
		};
	}

	/**
	 * Search for places
	 */
	async searchPlaces(
		query: string,
		count: number = 10
	): Promise<PlaceSearchResult[]> {
		return this.places.searchPlace(query, { count });
	}

	/**
	 * Search catalog by place
	 */
	async searchCatalog(
		placeName: string,
		count: number = 10
	): Promise<CatalogSearchResult[]> {
		return this.catalog.searchByPlace(placeName, { count });
	}

	/**
	 * Get place by ID
	 */
	async getPlaceById(placeId: string): Promise<PlaceSearchResult | null> {
		return this.places.getPlaceById(placeId);
	}

	/**
	 * Set access token for authenticated requests
	 */
	setAccessToken(token: string): void {
		this.client.setAccessToken(token);
	}

	/**
	 * Set session cookie for Catalog Service API
	 */
	setSessionCookie(cookie: string): void {
		this.client.setSessionCookie(cookie);
	}

	/**
	 * Search catalog using Catalog Service v3 API (requires session cookie)
	 *
	 * @param placeName Place name to search for
	 * @param count Maximum number of results
	 * @returns Catalog records with place metadata (placeSetId for related places)
	 */
	async searchCatalogService(
		placeName: string,
		count: number = 20
	): Promise<CatalogServiceSearchResult> {
		return this.catalog.searchCatalogService(placeName, { count });
	}

	/**
	 * Clear cache
	 */
	clearCache(): void {
		this.client.clearCache();
	}

	/**
	 * Get cache statistics
	 */
	getCacheStats(): { size: number; enabled: boolean } {
		return this.client.getCacheStats();
	}
}

// Export all modules
export { CatalogPlacesClient } from "./client/index";
export { PlacesAPI } from "./places/index";
export { CatalogAPI } from "./catalog/index";
export { MemoryCache } from "./cache/index";
export * as Parser from "./parser/index";

// Export religion config
export {
	ReligionConfig,
	DEFAULT_RELIGION_TRANSLATIONS,
	DEFAULT_CHURCH_PATTERNS,
	DEFAULT_PARISH_PATTERNS,
} from "./catalog/religion-config";

// Export types
export type {
	CatalogPlacesClientConfig,
	CatalogPlaceResult,
	ResolvedPlace,
	CatalogSource,
	PlaceSearchResult,
	NormalizedPlace,
	CatalogSearchResult,
	CoveragePeriod,
	ParishInfo,
	Cache,
	CacheEntry,
	CatalogServiceSearchResponse,
	CatalogServiceRecord,
	CatalogServiceSearchResult,
	CatalogServiceMetadata,
	CatalogItemResponse,
	CatalogItemMetadata,
} from "./types/index";

export type {
	ReligionTranslations,
	ChurchPattern,
	ParishPattern,
} from "./catalog/religion-config";

// Export URL generation utilities
export {
	generateAuthorSearchUrl,
	generateAuthorNameSearchUrl,
	generateSubjectSearchUrl,
	generateCatalogSearchUrl,
} from "./utils/url-generator";
