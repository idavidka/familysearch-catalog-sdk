/**
 * Type definitions for FamilySearch Catalog & Places SDK
 */

/**
 * Resolved place information combining normalized place data with catalog sources
 */
export interface ResolvedPlace {
	/** FamilySearch place ID */
	placeId: string;
	/** Standardized place name with hierarchy */
	standardizedName: string;
	/** Primary registry or parish name */
	registry: string;
	/** Coverage period (e.g., "1730-1895") */
	coverage: string;
	/** Related catalog sources */
	sources: CatalogSource[];
}

/**
 * Catalog source information
 */
export interface CatalogSource {
	/** Unique catalog record ID */
	id: string;
	/** Full title of the catalog record */
	title: string;
	/** Author or creator */
	author: string;
	/** Year range covered */
	years: string;
	/** URL to the catalog record */
	url: string;
}

/**
 * Place search result
 */
export interface PlaceSearchResult {
	/** Place ID */
	id: string;
	/** Place name */
	name: string;
	/** Full hierarchical name */
	fullName: string;
	/** Place type (e.g., "City", "Parish") */
	type?: string;
	/** Latitude */
	latitude?: number;
	/** Longitude */
	longitude?: number;
	/** Parent place information */
	parent?: {
		id: string;
		name: string;
	};
	/** URL to FamilySearch place details page */
	url?: string;
	/** URL to FamilySearch catalog search for this place */
	catalogUrl?: string;
	/** URL to FamilySearch records search for this place */
	recordsUrl?: string;
}

/**
 * Normalized place information
 */
export interface NormalizedPlace {
	/** Original input */
	original: string;
	/** Standardized name */
	standardized: string;
	/** Place ID if found */
	placeId?: string;
	/** Confidence score (0-1) */
	confidence: number;
}

/**
 * Catalog search result
 */
export interface CatalogSearchResult {
	/** Record ID */
	id: string;
	/** Record title */
	title: string;
	/** Author/creator */
	author: string;
	/** Coverage years */
	coverageYears: string;
	/** Place name */
	place: string;
	/** Record type */
	type: string;
	/** URL to record */
	url: string;
	/** Additional metadata */
	metadata?: Record<string, unknown>;
}

/**
 * Coverage period extracted from catalog records
 */
export interface CoveragePeriod {
	/** Start year */
	startYear: number;
	/** End year */
	endYear: number;
	/** Original text */
	originalText: string;
	/** Confidence (0-1) */
	confidence: number;
}

/**
 * Parish information extracted from catalog
 */
export interface ParishInfo {
	/** Parish name */
	name: string;
	/** Parish type (e.g., "Roman Catholic", "Lutheran") */
	type?: string;
	/** Location */
	location?: string;
	/** Parent administrative unit */
	parent?: string;
}

/**
 * Combined result from catalog place search
 * Contains place information with associated catalog records
 */
export interface CatalogPlaceResult {
	/** Place search result */
	place: PlaceSearchResult;
	/** Associated catalog records */
	catalogRecords: CatalogSearchResult[];
	/** Primary registry name (if found) */
	registry?: string;
	/** Coverage period string (e.g., "1730-1895") */
	coverage?: string;
}

/**
 * Catalog Service V3 API Response Types
 */

/** Catalog service v3 search response */
export interface CatalogServiceSearchResponse {
	searchHits: CatalogServiceSearchHit[];
	facets: CatalogServiceFacet[];
	totalHits: number;
	offset: number;
	placeSetId?: string;
	placeRepId?: string;
}

/** Search hit in catalog service response */
export interface CatalogServiceSearchHit {
	metadataHit: {
		metadata: CatalogServiceMetadata;
		score: number;
	};
}

/** Metadata in catalog service response */
export interface CatalogServiceMetadata {
	identifier: {
		value: string;
	};
	subject?: string[];
	title: Array<{
		value: string;
		lang?: string;
	}>;
	creator?: string[];
	coverage?: Array<{
		temporal?: Record<string, unknown>;
	}>;
	properties?: Array<{
		value: string;
		type: string;
	}>;
	repositoryCalls?: Array<{
		title: string;
	}>;
}

/** Facet in catalog service response */
export interface CatalogServiceFacet {
	count: number;
	displayCount: string;
	displayName: string;
	facets: CatalogServiceFacet[];
	params: string;
}

/** Parsed catalog record from service v3 */
export interface CatalogServiceRecord {
	/** Record identifier (koha ID or numeric ID) */
	id: string;
	/** Record title */
	title: string;
	/** Creators (parishes, archives, etc.) */
	creators: string[];
	/** Subject categories */
	subjects: string[];
	/** Coverage years extracted from title */
	coverageYears: string;
	/** Repository locations (Online, Library, etc.) */
	repositories: string[];
	/** Record URL */
	url: string;
	/** Extracted parish name */
	parish?: string;
	/** Extracted religion/denomination */
	religion?: string;
}

/**
 * Configuration for the CatalogPlacesClient
 */
export interface CatalogPlacesClientConfig {
	/**
	 * FamilySearch client ID (OAuth) - Optional for Places API (public)
	 * Only required if you need authenticated requests
	 */
	clientId?: string;
	/** FamilySearch client secret (OAuth) */
	clientSecret?: string;
	/** Environment (production, beta, integration) */
	environment?: "production" | "beta" | "integration";
	/** Enable caching */
	enableCache?: boolean;
	/** Cache TTL in seconds */
	cacheTTL?: number;
	/** Debug mode */
	debug?: boolean;
	/**
	 * Session cookie for FamilySearch web UI endpoints
	 * Required for /service/search/catalog/v3/search endpoint
	 * Example: "fssessionid=abc123..."
	 */
	sessionCookie?: string;
}

/**
 * Cache entry
 */
export interface CacheEntry<T> {
	/** Cached data */
	data: T;
	/** Timestamp when cached */
	timestamp: number;
	/** TTL in seconds */
	ttl: number;
}

/**
 * Cache interface
 */
export interface Cache {
	get<T>(key: string): T | undefined;
	set<T>(key: string, value: T, ttl?: number): void;
	has(key: string): boolean;
	delete(key: string): boolean;
	clear(): void;
	size(): number;
}
