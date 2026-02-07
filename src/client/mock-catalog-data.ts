/* eslint-disable no-useless-escape */
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

export const MOCK_KOHA_RESPONSE = {
	source: {
		note: [
			{
				text: "Reformed Church register of births, marriages and deaths for Balaton-Udvari.",
				type: "SUMM",
				seq: 1,
			},
			{
				text: "Az eredeti iratok mikrofilmrevétele Budapesten a Magyar Országos Levéltárban történt.",
				type: "LOC",
				seq: 2,
			},
			{
				note_link: {
					text: '<strong><font color="red"><a href="https://familysearch.org/search/collection/1858355"Target="_blank">An index for Hungary Reformed Church Christenings is available online, click  here<\/a><\/font><\/strong>',
				},
				text: '<strong><font color="red"><a href="https://familysearch.org/search/collection/1858355"Target="_blank">An index for Hungary Reformed Church Christenings is available online, click  here<\/a><\/font><\/strong>',
				type: "RSLINK",
				seq: 3,
			},
		],
		film_note: {
			geo_collection: "International",
			fs_indexed_film_number: "4703560",
			digital_film_no: "4703560",
			copy_location_ex: {
				copy_location_id: 1547178,
				copy_location_name: "Granite Mountain Record Vault",
			},
			type: "FCONT",
			filmno: "630420",
			digital_film_rights: "",
			location_id: 1547178,
			record_type: "",
			shelf: "Film",
			volume: "",
			copy_location: "Granite Mountain Record Vault",
			item_image_start_no: "",
			location: "Granite Mountain Record Vault",
			text: "Kereszteltek 1734-1756, 1763-1834 Házasultak 1748-1771, 1788-1839 Halottak 1747-1751, 1787-1839",
			fs_indexed: "Y",
			inclusive_dates: "",
			items: "",
			seq: 1,
		},
		xref: {
			link_type: "Indexed In",
			author_name: "",
			subtitle: "",
			inclusive_dates: "2009",
			title: "Hungary Reformed Church christenings, 1624-1895",
			titleno: "1858355",
		},
		author: [
			{
				identification: "",
				authorno: 1685131009,
				givenname: "",
				surname: "Magyarország. Országos Levéltár",
				fullname: "Magyarország. Országos Levéltár",
				type: "Added Author",
				display_text: "Magyarország. Országos Levéltár",
				seq: 1,
			},
			{
				identification: "",
				authorno: 150255802,
				givenname: "",
				surname: "Református Egyház, Balaton-Udvari",
				fullname: "Református Egyház, Balaton-Udvari",
				type: "Author",
				display_text: "Református Egyház, Balaton-Udvari",
				seq: 2,
			},
		],
		subject: {
			subjectno: 133492089,
			text: "Hungary, Zala, Balaton-Udvari - Church records",
			type: "TRACE",
			seq: 1,
			geo_name: "0",
		},
		display_title: "Anyakönyvek, 1734-1839",
		format: "Microfilm 35mm",
		language: {
			text: "Hungarian",
			seq: 1,
		},
		title: "Anyakönyvek,",
		titleno: 91636,
		oclc_record_number: "866510504",
		publisher: {
			date: "1962.",
			name: "Filmre vette a Genealogical Society of Utah",
			place: "Salt Lake City, Utah",
			seq: 1,
		},
		inclusive_dates: "1734-1839",
		physical: {
			physical_display: "1 mikrofilmtekercs ; 35 mm.",
			length: "1 mikrofilmtekercs ;",
			dim_use: "35 mm.",
			display_text: "1 mikrofilmtekercs ; 35 mm.",
			seq: 1,
		},
		available_online: "Y",
	},
};

export const MOCK_SLOVAK_KOHA_RESPONSE = {
	source: {
		note: [
			{
				text: "Roman Catholic index to parish registers of baptisms, marriages, and deaths for Bajtava, Slovakia; formerly Bajta, Hont, Hungary.  Text in Hungarian.",
				type: "SUMM",
				seq: 1,
			},
			{
				text: "Mikrofilm pôvodných dokumentov v Štátnom oblastnom archíve v Nitre.",
				type: "LOC",
				seq: 2,
			},
			{
				note_link: {
					text: '<strong><font color="red"><a href="https://familysearch.org/search/collection/1554443"Target="_blank">Slovakia Church and Synagogue Books are available online, click  here.  Images for film number 1793684 are not available.<\/a><\/font><\/strong>',
				},
				text: '<strong><font color="red"><a href="https://familysearch.org/search/collection/1554443"Target="_blank">Slovakia Church and Synagogue Books are available online, click  here.  Images for film number 1793684 are not available.<\/a><\/font><\/strong>',
				type: "RSLINK",
				seq: 3,
			},
		],
		film_note: {
			geo_collection: "International",
			fs_indexed_film_number: "5218772",
			digital_film_no: "5218772",
			copy_location_ex: {
				copy_location_id: 1547178,
				copy_location_name: "FamilySearch Library",
			},
			type: "FCONT",
			filmno: "2211587",
			digital_film_rights: "",
			location_id: 1547178,
			record_type: "",
			shelf: "B1 Floor Film",
			volume: "",
			copy_location: "FamilySearch Library",
			item_image_start_no: "",
			location: "FamilySearch Library",
			text: "Zoznam krstov, manželstiev, úmrtí A-Z (1830-1944)",
			fs_indexed: "Y",
			inclusive_dates: "",
			items: "Item 3",
			seq: 1,
		},
		xref: {
			link_type: "Digital Collection",
			author_name: "",
			subtitle: "",
			inclusive_dates: "2008",
			title: "Slovakia church and synagogue books, 1592-1935",
			titleno: "1554443",
		},
		author: [
			{
				identification: "",
				authorno: 1552603398,
				givenname: "",
				surname:
					"Rímsko-katolícka cirkev. Farský úrad Bajtava (Parkan)",
				fullname:
					"Rímsko-katolícka cirkev. Farský úrad Bajtava (Parkan)",
				type: "Author",
				display_text:
					"Rímsko-katolícka cirkev. Farský úrad Bajtava (Parkan)",
				seq: 1,
			},
			{
				identification: "",
				authorno: 2020104703,
				givenname: "",
				surname: "Štátny oblastný archív v Nitre",
				fullname: "Štátny oblastný archív v Nitre",
				type: "Added Author",
				display_text: "Štátny oblastný archív v Nitre",
				seq: 2,
			},
		],
		subject: [
			{
				subjectno: 133492089,
				text: "Czechoslovakia, Slovensko, Parkan, Bajtava - Church records",
				type: "TRACE",
				seq: 1,
				geo_name: "0",
			},
			{
				subjectno: 133492089,
				text: "Hungary, Hont, Bajta - Church records",
				type: "TRACE",
				seq: 2,
				geo_name: "0",
			},
			{
				subjectno: 133492089,
				text: "Slovakia, Nové Zámky, Bajtava - Church records",
				type: "TRACE",
				seq: 3,
				geo_name: "0",
			},
		],
		display_title: "Cirkevná matrika, 1830-1944",
		format: "Microfilm 35mm",
		language: {
			text: "Hungarian",
			seq: 1,
		},
		title: "Cirkevná matrika,",
		titleno: 1040884,
		oclc_record_number: "866012092",
		publisher: {
			date: "2000.",
			name: "Mikrofilmy boli zhotovené Genealogickou spoločnosťou štátu Utah",
			place: "Salt Lake City, Utah",
			seq: 1,
		},
		inclusive_dates: "1830-1944",
		physical: {
			physical_display: "na 1 mikrofilmovom kotúči ; 35 mm.",
			length: "na 1 mikrofilmovom kotúči ;",
			dim_use: "35 mm.",
			display_text: "na 1 mikrofilmovom kotúči ; 35 mm.",
			seq: 1,
		},
		available_online: "Y",
	},
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
	// Check if this is a Koha item request
	if (path.includes("/service/search/catalog/item/koha:")) {
		const kohaId = params?.kohaId as string | undefined;

		if (kohaId === "91636") {
			console.log(
				"[MOCK] Returning Koha item data (Balatonudvari - 91636)"
			);
			return MOCK_KOHA_RESPONSE as T;
		} else if (kohaId === "1040884") {
			// For Slovak or other locations, return the Slovak mock
			console.log(`[MOCK] Returning Koha item data (Bajta - ${kohaId})`);
			return MOCK_SLOVAK_KOHA_RESPONSE as T;
		}

		// No mock data for this kohaId
		return undefined;
	}

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
