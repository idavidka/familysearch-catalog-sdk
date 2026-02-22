/**
 * Catalog API module for FamilySearch Catalog API
 *
 * Provides functionality for:
 * - Catalog record search
 * - Coverage period extraction
 * - Parish/registry lookup
 */

import type { CatalogPlacesClient } from "../client/index";
import * as Parser from "../parser/index";
import type {
  CatalogSearchResult,
  CoveragePeriod,
  ParishInfo,
  CatalogServiceSearchResponse,
  CatalogServiceRecord,
  CatalogServiceMetadata,
  CatalogItemResponse,
  CatalogItemMetadata,
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
    options: CatalogAPIOptions = {},
  ) {
    this.religionConfig = new ReligionConfig(
      options.additionalReligionTranslations || [],
      options.additionalChurchPatterns || [],
      options.additionalParishPatterns || [],
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
    } = {},
  ): Promise<CatalogSearchResult[]> {
    console.log("[CatalogAPI] searchByPlace called with:", placeName, options);

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
        const author = entry.content?.gedcomx?.attribution?.creator?.name || "";
        const description = entry.content?.gedcomx?.description || "";

        // Extract years from title or description
        const years = Parser.extractYearRange(title + " " + description);

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
    recordId: string,
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
      const years = Parser.extractYearRange(title + " " + description);

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
      const years = Parser.parseDateRange(record.coverageYears);
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
        /(roman catholic|lutheran|reformed|evangelical)\s+(parish|church)\s+of\s+([^,]+)/i,
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
    } = {},
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
        initialParams,
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
            detailParams,
          );

        if (detailResponse && detailResponse.searchHits) {
          for (const detailHit of detailResponse.searchHits) {
            const record = await this.parseCatalogServiceRecord(
              detailHit.metadataHit.metadata,
            );
            allRecords.push(record);
          }
        }
      } catch (error) {
        console.error(
          `Error fetching details for subject ${subjectId}:`,
          error,
        );
      }
    }

    return allRecords;
  }

  /**
   * Parse CatalogServiceMetadata into CatalogServiceRecord
   * Made public to allow direct record parsing without subject grouping
   */
  async parseCatalogServiceRecord(
    metadata: CatalogServiceMetadata,
  ): Promise<CatalogServiceRecord> {
    const title = metadata.title[0]?.value || "";
    const creators = metadata.creator || [];
    const subjects = metadata.subject || [];
    const repositories = metadata.repositoryCalls?.map((r) => r.title) || [];

    // Extract ID from identifier and handle different catalog types
    const identifierValue = metadata.identifier.value;
    const kohaMatch = identifierValue.match(/koha:(\d+)/);
    const olibMatch = identifierValue.match(/olib:(\d+)/);

    // Determine ID and URL based on catalog type
    let id: string;
    let url: string;

    if (kohaMatch) {
      // Koha record: extract numeric ID
      id = kohaMatch[1];
      url = `${this.client.getWebBaseUrl()}/search/catalog/koha:${id}`;
    } else if (olibMatch) {
      // Olib record: extract numeric ID
      id = olibMatch[1];
      url = `${this.client.getWebBaseUrl()}/service/search/catalog/item/olib:${id}`;
    } else if (identifierValue.startsWith("http")) {
      // Full URL provided (e.g., olib records sometimes return full URL)
      // Extract olib ID from URL if present
      const urlOlibMatch = identifierValue.match(/olib:(\d+)/);
      if (urlOlibMatch) {
        id = urlOlibMatch[1];
        url = identifierValue; // Use the full URL as-is
      } else {
        id = identifierValue;
        url = identifierValue;
      }
    } else {
      // Unknown format: use as-is
      id = identifierValue;
      url = identifierValue
        ? `${this.client.getWebBaseUrl()}/search/catalog/${identifierValue}`
        : "";
    }

    // Extract coverage years from title
    const coverageYears = Parser.extractYearRange(title);

    // Extract parish and religion from creators
    const { parish, religion } = this.extractParishAndReligion(creators);

    // Fetch detailed Koha metadata if this is a Koha record
    let kohaMetadata;
    let religionAuthorId;
    if (kohaMatch && kohaMatch[1]) {
      const kohaData = await this.client.getCatalogItem(kohaMatch[1]);
      if (kohaData) {
        kohaMetadata = this.parseKohaMetadata(kohaData);

        // Find the church/parish author ID (type: "Author", not "Added Author")
        // This is used for religion badge links
        const churchAuthor = kohaMetadata.authors?.find(
          (author) => author.type === "Author",
        );
        if (churchAuthor) {
          religionAuthorId = churchAuthor.authorId;
        }
      }
    }

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
      religionAuthorId,
      kohaMetadata,
    };
  }

  /**
   * Parse Koha item response into CatalogItemMetadata
   * Extracts author IDs, film notes, cross-references, notes, and subjects
   */
  private parseKohaMetadata(kohaData: unknown): CatalogItemMetadata {
    const data = kohaData as CatalogItemResponse;

    // Extract authors with IDs from source.author array
    const authors = (data?.source?.author || []).map((author) => ({
      authorId: author.authorno,
      fullName: author.fullname,
      surname: author.surname,
      type: author.type,
    }));

    // Extract film notes from source.film_note (singular object)
    const filmNotes = data?.source?.film_note
      ? [
          {
            filmno: data.source.film_note.filmno,
            digitalFilmNo: data.source.film_note.digital_film_no,
            text: data.source.film_note.text,
            copyLocation: data.source.film_note.copy_location,
            fsIndexed: data.source.film_note.fs_indexed,
            inclusiveDates: data.source.film_note.inclusive_dates,
          },
        ]
      : [];

    // Extract cross-references from source.xref (singular object)
    const xrefs = data?.source?.xref
      ? [
          {
            linkType: data.source.xref.link_type,
            title: data.source.xref.title,
            titleno: data.source.xref.titleno,
            inclusiveDates: data.source.xref.inclusive_dates,
          },
        ]
      : [];

    // Extract notes from source.note array
    const notes = (data?.source?.note || []).map((note) => ({
      type: note.type,
      text: note.text,
      seq: note.seq,
    }));

    // Extract subjects from source.subject (can be object or array)
    let subjects: Array<{
      subjectno: number;
      text: string;
      type: string;
    }> = [];

    if (data?.source?.subject) {
      // Handle both single object and array
      const subjectData = Array.isArray(data.source.subject)
        ? data.source.subject
        : [data.source.subject];

      subjects = subjectData.map((subj) => ({
        subjectno: subj.subjectno,
        text: subj.text,
        type: subj.type,
      }));
    }

    return {
      authors,
      filmNotes,
      xrefs,
      notes,
      subjects,
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
      const churchMatch = this.religionConfig.extractFromChurchPattern(creator);
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

  /**
   * Get related places for a given place
   * Returns mother parishes, nearby parishes, and other ecclesiastical jurisdictions
   *
   * @param placeId FamilySearch place ID
   * @returns Related places with relationship types and notes
   *
   * @example
   * ```typescript
   * const related = await catalog.getRelatedPlaces("12345");
   * console.log(related.relatedPlaces[0].name); // "Verőce, Pest, Hungary"
   * console.log(related.relatedPlaces[0].relationship); // "mother-parish"
   * ```
   */
  async getRelatedPlaces(
    placeId: string,
  ): Promise<import("../types/index").RelatedPlacesResponse> {
    try {
      // Call internal Catalog API endpoint for related places
      const response = await this.client.getCatalog<{
        placeId?: string;
        placeName?: string;
        relatedPlaces?: Array<{
          placeId?: string;
          name?: string;
          fullName?: string;
          relationship?: string;
          note?: string;
          distance?: number;
          religion?: string;
        }>;
      }>(`/service/records/catalog/places/${placeId}/related`);

      // Handle undefined response
      if (!response) {
        return {
          placeId,
          placeName: "",
          relatedPlaces: [],
        };
      }

      // Parse response
      const relatedPlaces: import("../types/index").RelatedPlace[] = (
        response.relatedPlaces || []
      )
        .map((place) => ({
          placeId: place.placeId || "",
          name: place.name || "",
          fullName: place.fullName,
          relationship: this.parseRelationshipType(place.relationship),
          note: place.note,
          distance: place.distance,
          religion: place.religion,
        }))
        .filter((place) => place.placeId && place.name); // Filter out invalid entries

      return {
        placeId: response.placeId || placeId,
        placeName: response.placeName || "",
        relatedPlaces,
      };
    } catch (error) {
      // If endpoint doesn't exist or returns 404, return empty result
      console.warn(`Failed to fetch related places for ${placeId}:`, error);
      return {
        placeId,
        placeName: "",
        relatedPlaces: [],
      };
    }
  }

  /**
   * Parse relationship type string to enum value
   */
  private parseRelationshipType(
    relationship?: string,
  ): import("../types/index").RelatedPlace["relationship"] {
    if (!relationship) return "unknown";

    const lower = relationship.toLowerCase();
    if (lower.includes("mother") || lower.includes("parent"))
      return "mother-parish";
    if (lower.includes("subordinate") || lower.includes("child"))
      return "subordinate";
    if (lower.includes("nearby") || lower.includes("neighbor")) return "nearby";
    if (lower.includes("ecclesiastical") || lower.includes("church"))
      return "ecclesiastical-jurisdiction";
    if (lower.includes("civil") || lower.includes("administrative"))
      return "civil-jurisdiction";
    if (lower.includes("see") || lower.includes("also")) return "see-also";

    return "unknown";
  }
}

export {
  type CatalogSearchResult,
  type CoveragePeriod,
  type ParishInfo,
  type RelatedPlace,
  type RelatedPlacesResponse,
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
