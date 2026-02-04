/**
 * Mock data for FamilySearch Catalog Service API
 * Based on real API responses from fs-cookie-debug file
 */

/**
 * Mock response for groupBy=placeSubject query (first request)
 * Returns grouped search hits (Church records, Civil registration)
 */
export const MOCK_GROUPED_RESPONSE = {
	searchHits: [
		{
			metadataHit: {
				metadata: {
					identifier: { value: "133492089" },
					subject: ["Church records  "],
					title: [{ value: "Church records  ", lang: "en-US" }],
				},
				score: 2,
			},
		},
		{
			metadataHit: {
				metadata: {
					identifier: { value: "999798628" },
					subject: ["Civil registration  "],
					title: [{ value: "Civil registration  ", lang: "en-US" }],
				},
				score: 1,
			},
		},
	],
	facets: [],
	totalHits: 3,
	offset: 0,
	placeSetId: "4275138",
	placeRepId: "2146017",
};

/**
 * Mock response for q.subjectId=133492089 query (Church records)
 * Returns detailed records with creator information including denominations
 */
export const MOCK_CHURCH_RECORDS_RESPONSE = {
	searchHits: [
		{
			metadataHit: {
				metadata: {
					coverage: [{ temporal: {} }],
					creator: [
						"Magyarország. Országos Levéltár",
						"Református Egyház, Balaton-Udvari",
					],
					identifier: {
						value: "https://www.familysearch.org/service/search/catalog/item/koha:91636",
					},
					title: [{ value: "Anyakönyvek, 1734-1839", lang: "en-US" }],
					properties: [
						{
							value: "123402",
							type: "org.familysearch.www.catalog.topic",
						},
					],
					repositoryCalls: [
						{ title: "Granite Mountain Record Vault" },
						{ title: "FamilySearch Library" },
						{ title: "Online" },
					],
				},
				score: 2,
			},
		},
		{
			metadataHit: {
				metadata: {
					coverage: [{ temporal: {} }],
					creator: [
						"Magyar Országos Levéltár",
						"Római Katólikus Egyház, Aszófő",
					],
					identifier: {
						value: "https://www.familysearch.org/service/search/catalog/item/koha:294767",
					},
					title: [{ value: "Anyakönyvek, 1757-1895", lang: "en-US" }],
					properties: [
						{
							value: "123402",
							type: "org.familysearch.www.catalog.topic",
						},
					],
					repositoryCalls: [
						{ title: "Granite Mountain Record Vault" },
						{ title: "FamilySearch Library" },
						{ title: "Online" },
					],
				},
				score: 2,
			},
		},
	],
	facets: [
		{
			count: 2,
			displayCount: "2",
			displayName: "Year",
			facets: [
				{
					count: 2,
					displayCount: "2",
					displayName: "1700",
					facets: [],
					params: "c.year1=on&f.year0=1700",
				},
				{
					count: 2,
					displayCount: "2",
					displayName: "1800",
					facets: [],
					params: "c.year1=on&f.year0=1800",
				},
			],
			params: "c.year0=on",
		},
		{
			count: 2,
			displayCount: "2",
			displayName: "Category",
			facets: [
				{
					count: 2,
					displayCount: "2",
					displayName: "Religious Records",
					facets: [],
					params: "c.topic1=on&f.topic0=123402",
				},
			],
			params: "c.topic0=on",
		},
		{
			count: 2,
			displayCount: "2",
			displayName: "Availability",
			facets: [
				{
					count: 2,
					displayCount: "2",
					displayName: "FamilySearch Library",
					facets: [],
					params: "c.availability=on&f.availability=FamilySearch Library",
				},
				{
					count: 2,
					displayCount: "2",
					displayName: "Granite Mountain Record Vault",
					facets: [],
					params: "c.availability=on&f.availability=Granite Mountain Record Vault",
				},
				{
					count: 2,
					displayCount: "2",
					displayName: "Online",
					facets: [],
					params: "c.availability=on&f.availability=Online",
				},
			],
			params: "c.availability=on",
		},
		{
			count: 2,
			displayCount: "2",
			displayName: "Language",
			facets: [
				{
					count: 2,
					displayCount: "2",
					displayName: "Hungarian",
					facets: [],
					params: "c.language1=on&f.language0=Hungarian",
				},
				{
					count: 1,
					displayCount: "1",
					displayName: "Latin",
					facets: [],
					params: "c.language1=on&f.language0=Latin",
				},
			],
			params: "c.language0=on",
		},
		{
			count: 2,
			displayCount: "2",
			displayName: "Format",
			facets: [
				{
					count: 2,
					displayCount: "2",
					displayName: "Microfilm 35mm",
					facets: [],
					params: "c.format_facet=on&f.format_facet=Microfilm 35mm",
				},
			],
			params: "c.format_facet=on",
		},
	],
	totalHits: 2,
	offset: 0,
};

/**
 * Mock response for q.subjectId=999798628 query (Civil registration)
 * Returns detailed civil registry records
 */
export const MOCK_CIVIL_RECORDS_RESPONSE = {
	searchHits: [
		{
			metadataHit: {
				metadata: {
					coverage: [{ temporal: {} }],
					creator: [
						"Balaton-Udvari (Zala). Anyakönyvi Hivatal",
						"Szekszárdon a Tolna Megyei Levéltárban",
					],
					identifier: {
						value: "https://www.familysearch.org/service/search/catalog/item/koha:1398984",
					},
					title: [
						{
							value: "Állami anyakönyvek, 1951-1975",
							lang: "en-US",
						},
					],
					properties: [
						{
							value: "124443",
							type: "org.familysearch.www.catalog.topic",
						},
					],
					repositoryCalls: [
						{ title: "Granite Mountain Record Vault" },
						{ title: "FamilySearch Library" },
						{ title: "Online" },
					],
				},
				score: 2,
			},
		},
	],
	facets: [
		{
			count: 1,
			displayCount: "1",
			displayName: "Year",
			facets: [
				{
					count: 1,
					displayCount: "1",
					displayName: "1900",
					facets: [],
					params: "c.year1=on&f.year0=1900",
				},
			],
			params: "c.year0=on",
		},
		{
			count: 1,
			displayCount: "1",
			displayName: "Category",
			facets: [
				{
					count: 1,
					displayCount: "1",
					displayName: "Vital Records",
					facets: [],
					params: "c.topic1=on&f.topic0=124443",
				},
			],
			params: "c.topic0=on",
		},
		{
			count: 1,
			displayCount: "1",
			displayName: "Availability",
			facets: [
				{
					count: 1,
					displayCount: "1",
					displayName: "FamilySearch Library",
					facets: [],
					params: "c.availability=on&f.availability=FamilySearch Library",
				},
				{
					count: 1,
					displayCount: "1",
					displayName: "Granite Mountain Record Vault",
					facets: [],
					params: "c.availability=on&f.availability=Granite Mountain Record Vault",
				},
				{
					count: 1,
					displayCount: "1",
					displayName: "Online",
					facets: [],
					params: "c.availability=on&f.availability=Online",
				},
			],
			params: "c.availability=on",
		},
		{
			count: 1,
			displayCount: "1",
			displayName: "Language",
			facets: [
				{
					count: 1,
					displayCount: "1",
					displayName: "Hungarian",
					facets: [],
					params: "c.language1=on&f.language0=Hungarian",
				},
			],
			params: "c.language0=on",
		},
		{
			count: 1,
			displayCount: "1",
			displayName: "Format",
			facets: [
				{
					count: 1,
					displayCount: "1",
					displayName: "Microfilm 35mm",
					facets: [],
					params: "c.format_facet=on&f.format_facet=Microfilm 35mm",
				},
			],
			params: "c.format_facet=on",
		},
	],
	totalHits: 1,
	offset: 0,
};

/**
 * Empty response for unmatched queries
 */
export const MOCK_EMPTY_RESPONSE = {
	searchHits: [],
	facets: [],
	totalHits: 0,
	offset: 0,
};

/**
 * Mock response for Slovak place (Bajta)
 */
export const MOCK_SLOVAK_GROUPED_RESPONSE = {
	searchHits: [
		{
			metadataHit: {
				metadata: {
					identifier: { value: "133492089" },
					subject: ["Church records  "],
					title: [{ value: "Church records  ", lang: "en-US" }],
				},
				score: 1,
			},
		},
	],
	facets: [],
	totalHits: 1,
	offset: 0,
	placeSetId: "6442041",
	placeRepId: "3409306",
};

/**
 * Mock response for Slovak church records
 */
export const MOCK_SLOVAK_CHURCH_RECORDS_RESPONSE = {
	searchHits: [
		{
			metadataHit: {
				metadata: {
					coverage: [{ temporal: {} }],
					creator: [
						"Rímsko-katolícka cirkev. Farský úrad Bajtava (Parkan)",
						"Štátny oblastný archív v Nitre",
					],
					identifier: {
						value: "https://www.familysearch.org/service/search/catalog/item/koha:1040884",
					},
					title: [
						{ value: "Cirkevná matrika, 1830-1944", lang: "en-US" },
					],
					properties: [
						{
							value: "123402",
							type: "org.familysearch.www.catalog.topic",
						},
					],
					repositoryCalls: [
						{ title: "FamilySearch Library" },
						{ title: "Online" },
					],
				},
				score: 2,
			},
		},
	],
	facets: [],
	totalHits: 1,
	offset: 0,
};

/**
 * Get mock response for Catalog Service API based on request parameters
 *
 * @param path API path
 * @param params Query parameters
 * @returns Mock response data or undefined if not in debug mode
 */
export function getMockCatalogResponse<T>(
	path: string,
	params?: Record<string, string | number | boolean>
): T | undefined {
	const place = params?.["q.place"] as string | undefined;

	// No mock data if no place specified
	if (!place) {
		return undefined;
	}

	const placeLower = place.toLowerCase();

	// Check if this is a groupBy=placeSubject query (first request)
	if (params?.["groupBy"] === "placeSubject") {
		if (
			placeLower.includes("balatonudvari") ||
			placeLower.includes("balaton-udvari")
		) {
			console.log(
				"[MOCK] Returning Hungarian grouped search hits (Balatonudvari)"
			);
			return MOCK_GROUPED_RESPONSE as T;
		} else if (placeLower.includes("bajta")) {
			console.log("[MOCK] Returning Slovak grouped search hits (Bajta)");
			return MOCK_SLOVAK_GROUPED_RESPONSE as T;
		}
	}

	// Check if this is a subjectId query (second request with detailed records)
	if (params?.["q.subjectId"]) {
		const subjectId = params["q.subjectId"];

		if (
			placeLower.includes("balatonudvari") ||
			placeLower.includes("balaton-udvari")
		) {
			if (subjectId === "133492089") {
				console.log(
					"[MOCK] Returning Hungarian church records (Balatonudvari)"
				);
				return MOCK_CHURCH_RECORDS_RESPONSE as T;
			} else if (subjectId === "999798628") {
				console.log(
					"[MOCK] Returning Hungarian civil records (Balatonudvari)"
				);
				return MOCK_CIVIL_RECORDS_RESPONSE as T;
			}
		} else if (placeLower.includes("bajta") && subjectId === "133492089") {
			console.log("[MOCK] Returning Slovak church records (Bajta)");
			return MOCK_SLOVAK_CHURCH_RECORDS_RESPONSE as T;
		}
	}

	// No mock data for other places - will use real API
	return undefined;
}
