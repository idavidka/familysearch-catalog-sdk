/**
 * Places API module for FamilySearch Places API
 *
 * Provides functionality for:
 * - Place search and lookup
 * - Place normalization
 * - Place hierarchy resolution
 */

import type { CatalogPlacesClient } from "../client/index";
import type { PlaceSearchResult, NormalizedPlace } from "../types/index";

/**
 * Get FamilySearch web UI base URL for environment
 */
function getWebBaseUrl(
	environment: "production" | "beta" | "integration"
): string {
	switch (environment) {
		case "beta":
			return "https://beta.familysearch.org";
		case "integration":
			return "https://integration.familysearch.org";
		case "production":
		default:
			return "https://www.familysearch.org";
	}
}

/**
 * Places API
 */
export class PlacesAPI {
	constructor(private client: CatalogPlacesClient) {}

	/**
	 * Search for places by name
	 *
	 * @param query Place name to search for
	 * @param options Search options
	 *
	 * @example
	 * ```typescript
	 * const results = await places.searchPlace("Kismaros, Hungary");
	 * console.log(results[0].fullName);
	 * ```
	 */
	async searchPlace(
		query: string,
		options: {
			count?: number;
			start?: number;
		} = {}
	): Promise<PlaceSearchResult[]> {
		// Build structured query string for FamilySearch Places API
		// The API expects format: name:"place name" or partialName:"place name"
		const structuredQuery = query.includes(":")
			? query // Already structured (e.g., "name:szob" or "parentId:123")
			: `name:"${query}"`; // Wrap in name:"..." format

		const params: Record<string, string | number> = {
			q: structuredQuery,
		};

		if (options.count) {
			params.count = options.count;
		}
		if (options.start) {
			params.start = options.start;
		}

		try {
			// Use getPlaces() for public Places API requests (no auth required)
			const response = await this.client.getPlaces<{
				entries?: Array<{
					id?: string;
					content?: {
						gedcomx?: {
							places?: Array<{
								id?: string;
								names?: Array<{
									lang?: string;
									value?: string;
								}>;
								type?: string;
								latitude?: number;
								longitude?: number;
								display?: {
									name?: string;
									fullName?: string;
								};
							}>;
						};
					};
				}>;
			}>("/platform/places/search", params);

			const entries = response?.entries || [];
			const results: PlaceSearchResult[] = [];

			// Get environment-specific base URL
			const baseUrl = getWebBaseUrl(this.client.getEnvironment());

			for (const entry of entries) {
				const place = entry.content?.gedcomx?.places?.[0];
				if (!place) continue;

				const name =
					place.display?.name || place.names?.[0]?.value || "";
				const fullName = place.display?.fullName || "";
				const id = place.id || "";
				const placeName = fullName || name;

				results.push({
					id,
					name,
					fullName,
					type: place.type,
					latitude: place.latitude,
					longitude: place.longitude,
					// Generate FamilySearch web UI URLs with correct environment
					url: id
						? `${baseUrl}/en/research/places/?focusedId=${id}`
						: undefined,
					catalogUrl: id
						? `${baseUrl}/search/catalog/results?count=20&placeId=${id}&q.place=${encodeURIComponent(placeName)}`
						: `${baseUrl}/search/catalog/results?count=20&query=%2Bplace%3A"${encodeURIComponent(placeName)}"`,
					recordsUrl: `${baseUrl}/search/record/results?q.birthLikePlace=${encodeURIComponent(placeName)}`,
				});
			}

			return results;
		} catch (error) {
			console.error("Error searching places:", error);
			return [];
		}
	}

	/**
	 * Get place details by ID
	 *
	 * @param placeId FamilySearch place ID
	 *
	 * @example
	 * ```typescript
	 * const place = await places.getPlaceById("12345");
	 * console.log(place?.fullName);
	 * ```
	 */
	async getPlaceById(placeId: string): Promise<PlaceSearchResult | null> {
		try {
			// Use getPlaces() for public Places API requests (no auth required)
			const response = await this.client.getPlaces<{
				places?: Array<{
					id?: string;
					names?: Array<{
						lang?: string;
						value?: string;
					}>;
					type?: string;
					latitude?: number;
					longitude?: number;
					display?: {
						name?: string;
						fullName?: string;
					};
				}>;
			}>(`/platform/places/${placeId}`);

			const place = response?.places?.[0];
			if (!place) {
				return null;
			}

			return {
				id: place.id || placeId,
				name: place.display?.name || place.names?.[0]?.value || "",
				fullName: place.display?.fullName || "",
				type: place.type,
				latitude: place.latitude,
				longitude: place.longitude,
			};
		} catch (error) {
			console.error(`Error fetching place ${placeId}:`, error);
			return null;
		}
	}

	/**
	 * Normalize a place name
	 *
	 * Attempts to standardize the place name by searching and selecting
	 * the best match.
	 *
	 * @param placeName Place name to normalize
	 *
	 * @example
	 * ```typescript
	 * const normalized = await places.normalizePlace("Kismaros");
	 * console.log(normalized.standardized); // "Kismaros, Pest, Hungary"
	 * ```
	 */
	async normalizePlace(placeName: string): Promise<NormalizedPlace> {
		if (!placeName || placeName.trim() === "") {
			return {
				original: placeName,
				standardized: placeName,
				confidence: 0,
			};
		}

		try {
			const results = await this.searchPlace(placeName, { count: 5 });

			if (results.length === 0) {
				return {
					original: placeName,
					standardized: placeName,
					confidence: 0,
				};
			}

			// Simple heuristic: use the first result
			const bestMatch = results[0];

			// Calculate confidence based on name similarity
			const confidence = this.calculateSimilarity(
				placeName.toLowerCase(),
				bestMatch.name.toLowerCase()
			);

			return {
				original: placeName,
				standardized: bestMatch.fullName || bestMatch.name,
				placeId: bestMatch.id,
				confidence,
			};
		} catch (error) {
			console.error("Error normalizing place:", error);
			return {
				original: placeName,
				standardized: placeName,
				confidence: 0,
			};
		}
	}

	/**
	 * Calculate similarity between two strings (simple Levenshtein-like)
	 */
	private calculateSimilarity(str1: string, str2: string): number {
		// Simple contains check for now
		if (str1 === str2) return 1.0;
		if (str2.includes(str1) || str1.includes(str2)) return 0.8;
		return 0.5;
	}
}

export { type PlaceSearchResult, type NormalizedPlace } from "../types/index";
