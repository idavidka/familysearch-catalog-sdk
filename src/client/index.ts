/**
 * Client wrapper for FamilySearch Catalog & Places APIs
 *
 * This client wraps @treeviz/familysearch-sdk and provides specialized
 * functionality for working with Places and Catalog APIs.
 *
 * Note: Uses TWO SDK instances:
 * - placesSDK: No appKey (Places API is public, avoids CORS issues)
 * - catalogSDK: With appKey (Catalog API requires authentication)
 */

import { FamilySearchSDK } from "@treeviz/familysearch-sdk";
import { MemoryCache } from "../cache/index";
import type { Cache, CatalogPlacesClientConfig } from "../types/index";
import { getMockCatalogResponse } from "./mock-catalog-data";

/**
 * Client for FamilySearch Catalog & Places APIs
 */
export class CatalogPlacesClient {
	/** SDK for public Places API (no appKey to avoid CORS) */
	private placesSDK: FamilySearchSDK;
	/** SDK for authenticated Catalog API (with appKey) */
	private catalogSDK: FamilySearchSDK;
	private cache?: Cache;
	private config: Required<
		Omit<CatalogPlacesClientConfig, "sessionCookie">
	> & { sessionCookie?: string };

	/**
	 * Create a new CatalogPlacesClient
	 *
	 * @param config Configuration options
	 *
	 * @example
	 * ```typescript
	 * const client = new CatalogPlacesClient({
	 *   clientId: process.env.FS_CLIENT_ID!,
	 *   clientSecret: process.env.FS_CLIENT_SECRET,
	 *   environment: 'production',
	 *   enableCache: true
	 * });
	 * ```
	 */
	constructor(config: CatalogPlacesClientConfig = {}) {
		// Set defaults
		this.config = {
			clientId: config.clientId || "",
			clientSecret: config.clientSecret || "",
			environment: config.environment || "production",
			enableCache: config.enableCache ?? true,
			cacheTTL: config.cacheTTL ?? 3600,
			debug: config.debug ?? false,
			sessionCookie: config.sessionCookie,
		};

		const loggerConfig = this.config.debug
			? {
					log: console.log,
					warn: console.warn,
					error: console.error,
				}
			: undefined;

		// Initialize Places SDK (public API - no appKey to avoid CORS issues in browser)
		this.placesSDK = new FamilySearchSDK({
			environment: this.config.environment,
			appKey: undefined, // Intentionally omit to avoid X-FS-App-Key header
			logger: loggerConfig,
		});

		// Initialize Catalog SDK (authenticated API - requires appKey)
		this.catalogSDK = new FamilySearchSDK({
			environment: this.config.environment,
			appKey: this.config.clientId || undefined,
			logger: loggerConfig,
		});

		// Initialize cache if enabled
		if (this.config.enableCache) {
			this.cache = new MemoryCache(1000, this.config.cacheTTL);
		}
	}

	/**
	 * Get the Places SDK instance (public, no auth required)
	 */
	getPlacesSDK(): FamilySearchSDK {
		return this.placesSDK;
	}

	/**
	 * Get the Catalog SDK instance (requires authentication)
	 */
	getCatalogSDK(): FamilySearchSDK {
		return this.catalogSDK;
	}

	/**
	 * Get the underlying FamilySearch SDK instance
	 * @deprecated Use getPlacesSDK() or getCatalogSDK() instead
	 */
	getSDK(): FamilySearchSDK {
		return this.placesSDK;
	}

	/**
	 * Get the cache instance
	 */
	getCache(): Cache | undefined {
		return this.cache;
	}

	/**
	 * Get the environment
	 */
	getEnvironment(): "production" | "beta" | "integration" {
		return this.config.environment;
	}

	/**
	 * Check if debug mode is enabled
	 */
	isDebugMode(): boolean {
		return this.config.debug;
	}

	/**
	 * Set access token for authenticated requests (Catalog API)
	 */
	setAccessToken(token: string): void {
		this.catalogSDK.setAccessToken(token);
	}

	/**
	 * Check if the client has an access token for Catalog API
	 */
	hasAccessToken(): boolean {
		return this.catalogSDK.hasAccessToken();
	}

	/**
	 * Make a GET request to FamilySearch Places API (public)
	 *
	 * @param path API path (without base URL)
	 * @param params Query parameters
	 * @param useCache Whether to use cache
	 */
	async getPlaces<T>(
		path: string,
		params?: Record<string, string | number | boolean>,
		useCache: boolean = true
	): Promise<T | undefined> {
		return this.makeRequest<T>(this.placesSDK, path, params, useCache);
	}

	/**
	 * Make a GET request to FamilySearch Catalog API (authenticated)
	 *
	 * @param path API path (without base URL)
	 * @param params Query parameters
	 * @param useCache Whether to use cache
	 */
	async getCatalog<T>(
		path: string,
		params?: Record<string, string | number | boolean>,
		useCache: boolean = true
	): Promise<T | undefined> {
		return this.makeRequest<T>(this.catalogSDK, path, params, useCache);
	}

	/**
	 * Make a GET request to FamilySearch API
	 * @deprecated Use getPlaces() or getCatalog() instead
	 *
	 * @param path API path (without base URL)
	 * @param params Query parameters
	 * @param useCache Whether to use cache
	 */
	async get<T>(
		path: string,
		params?: Record<string, string | number | boolean>,
		useCache: boolean = true
	): Promise<T | undefined> {
		return this.getPlaces<T>(path, params, useCache);
	}

	/**
	 * Internal method to make a GET request
	 */
	private async makeRequest<T>(
		sdk: FamilySearchSDK,
		path: string,
		params?: Record<string, string | number | boolean>,
		useCache: boolean = true
	): Promise<T | undefined> {
		// Generate cache key
		const cacheKey = this.generateCacheKey(path, params);

		// Check cache
		if (useCache && this.cache) {
			const cached = this.cache.get<T>(cacheKey);
			if (cached !== undefined) {
				if (this.config.debug) {
					console.log(`Cache hit: ${cacheKey}`);
				}
				return cached;
			}
		}

		// Build URL with query params
		let fullPath = path;
		if (params && Object.keys(params).length > 0) {
			const queryString = Object.entries(params)
				.map(
					([key, value]) =>
						`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
				)
				.join("&");
			fullPath = `${path}?${queryString}`;
		}

		// Make request
		const response = await sdk.get<T>(fullPath);

		// Extract data from response
		const data = response.data;

		// Cache result
		if (useCache && this.cache && data) {
			this.cache.set(cacheKey, data, this.config.cacheTTL);
		}

		return data;
	}

	/**
	 * Generate cache key from path and params
	 */
	private generateCacheKey(
		path: string,
		params?: Record<string, string | number | boolean>
	): string {
		const sortedParams = params
			? Object.keys(params)
					.sort()
					.map((key) => `${key}=${params[key]}`)
					.join("&")
			: "";
		return `${path}?${sortedParams}`;
	}

	/**
	 * Make a request to FamilySearch Catalog Service v3 API
	 * This endpoint requires session cookie authentication
	 *
	 * @param path Service API path (e.g., "/service/search/catalog/v3/search")
	 * @param params Query parameters
	 * @param useCache Whether to use cache
	 */
	async getCatalogService<T>(
		path: string,
		params?: Record<string, string | number | boolean>,
		useCache: boolean = true
	): Promise<T | undefined> {
		// if (!this.config.sessionCookie) {
		// 	throw new Error(
		// 		"Session cookie is required for Catalog Service API. " +
		// 			"Set sessionCookie in CatalogPlacesClientConfig."
		// 	);
		// }

		// MOCK: Return debug data
		if (this.config.debug) {
			const mockResponse = getMockCatalogResponse<T>(path, params);
			if (mockResponse !== undefined) {
				console.log(
					`[CatalogService] MOCK MODE - Returning debug data`
				);
				return mockResponse;
			}
		}

		// Generate cache key
		const cacheKey = this.generateCacheKey(path, params);

		// Check cache
		if (useCache && this.cache) {
			const cached = this.cache.get<T>(cacheKey);
			if (cached !== undefined) {
				if (this.config.debug) {
					console.log(`[CatalogService] Cache hit: ${cacheKey}`);
				}
				return cached;
			}
		}

		// Build URL with query params
		const baseUrl = "https://www.familysearch.org";
		let fullPath = path;
		if (params && Object.keys(params).length > 0) {
			const queryString = Object.entries(params)
				.map(
					([key, value]) =>
						`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
				)
				.join("&");
			fullPath = `${path}?${queryString}`;
		}

		const fullUrl = `${baseUrl}${fullPath}`;

		if (this.config.debug) {
			console.log(`[CatalogService] GET ${fullUrl}`);
		}

		// Make request with session cookie
		try {
			const headers: HeadersInit = {
				Accept: "application/json",
				"User-Agent": "TreevizBot/1.0",
			};

			// Add cookie if available
			if (this.config.sessionCookie) {
				headers.Cookie = this.config.sessionCookie;
			}

			const response = await fetch(fullUrl, {
				method: "GET",
				headers,
			});

			if (!response.ok) {
				throw new Error(
					`HTTP ${response.status}: ${response.statusText}`
				);
			}

			const data = (await response.json()) as T;

			// Cache result
			if (useCache && this.cache && data) {
				this.cache.set(cacheKey, data, this.config.cacheTTL);
			}

			return data;
		} catch (error) {
			console.error("[CatalogService] Request failed:", error);
			throw error;
		}
	}

	/**
	 * Set session cookie for Catalog Service API
	 */
	setSessionCookie(cookie: string): void {
		this.config.sessionCookie = cookie;
	}

	/**
	 * Get web base URL for environment
	 * Delegates to the underlying SDK
	 */
	getWebBaseUrl(): string {
		return this.placesSDK.getWebBaseUrl();
	}

	/**
	 * Clear the cache
	 */
	clearCache(): void {
		this.cache?.clear();
	}

	/**
	 * Get cache statistics
	 */
	getCacheStats(): { size: number; enabled: boolean } {
		return {
			size: this.cache?.size() ?? 0,
			enabled: this.config.enableCache,
		};
	}
}

export { type CatalogPlacesClientConfig } from "../types/index";
