// Religion config - minimal version
export interface ReligionTranslations {
	canonical: string;
	names: string[];
}

export interface ChurchPattern {
	name: string;
	pattern: RegExp;
	religionGroup: number;
	parishGroup: number;
}

export interface ParishPattern {
	name: string;
	pattern: RegExp;
	parishGroup: number;
}

/**
 * Default religion translations (English, French, German)
 * For additional languages, pass them via CatalogAPIOptions
 */
export const DEFAULT_RELIGION_TRANSLATIONS: ReligionTranslations[] = [
	{
		canonical: "Reformed",
		names: ["Reformed", "Református", "Reformovaná", "Reformat"],
	},
	{
		canonical: "Roman Catholic",
		names: [
			"Roman Catholic",
			"Római Katólikus",
			"Rímsko-katolícka",
			"Romano-Catolic",
		],
	},
	{
		canonical: "Lutheran",
		names: ["Lutheran", "Evangélikus", "Evanjelická", "Evanghelic"],
	},
	{
		canonical: "Greek Catholic",
		names: [
			"Greek Catholic",
			"Görög Katólikus",
			"Gréckokatolícka",
			"Greco-Catolic",
		],
	},
	{
		canonical: "Greek Orthodox",
		names: [
			"Greek Orthodox",
			"Görög Keleti",
			"Görögkeleti",
			"Pravoslávna",
			"Ortodox",
		],
	},
	{
		canonical: "Jewish",
		names: ["Jewish", "Zsidó", "Izraelita", "Židovská", "Evreu"],
	},
	{
		canonical: "Baptist",
		names: ["Baptist", "Baptista", "Baptistická"],
	},
	{
		canonical: "Methodist",
		names: ["Methodist", "Metodista", "Metodistická"],
	},
	{
		canonical: "Unitarian",
		names: ["Unitarian", "Unitárius", "Unitárska"],
	},
];

/**
 * Default church patterns for extracting religion and parish
 */
export const DEFAULT_CHURCH_PATTERNS: ChurchPattern[] = [
	{
		name: "Hungarian Church",
		pattern: /^(.+?)\s+Egyház,\s+(.+)$/,
		religionGroup: 1,
		parishGroup: 2,
	},
	{
		name: "Slovak Church",
		pattern: /^(.+?)\s+cirkev\.\s+(.+?)(?:\s+\(|$)/i,
		religionGroup: 1,
		parishGroup: 2,
	},
	{
		name: "English Church",
		pattern: /^(.+?)\s+Church,\s+(.+)$/,
		religionGroup: 1,
		parishGroup: 2,
	},
];

/**
 * Default parish patterns for extracting parish names
 */
export const DEFAULT_PARISH_PATTERNS: ParishPattern[] = [
	{
		name: "Slovak Parish Office",
		pattern: /^Farský\s+úrad\s+(.+)$/i,
		parishGroup: 1,
	},
	{
		name: "Hungarian Parish",
		pattern: /^(.+)\s+Plébánia$/,
		parishGroup: 1,
	},
];

export class ReligionConfig {
	private translations: ReligionTranslations[];
	private churchPatterns: ChurchPattern[];
	private parishPatterns: ParishPattern[];
	private nameToCanonical: Map<string, string>;

	constructor(
		additionalTranslations: ReligionTranslations[] = [],
		additionalChurchPatterns: ChurchPattern[] = [],
		additionalParishPatterns: ParishPattern[] = []
	) {
		this.translations = [
			...DEFAULT_RELIGION_TRANSLATIONS,
			...additionalTranslations,
		];
		this.churchPatterns = [
			...DEFAULT_CHURCH_PATTERNS,
			...additionalChurchPatterns,
		];
		this.parishPatterns = [
			...DEFAULT_PARISH_PATTERNS,
			...additionalParishPatterns,
		];
		this.nameToCanonical = new Map();
		for (const translation of this.translations) {
			for (const name of translation.names) {
				this.nameToCanonical.set(
					name.toLowerCase(),
					translation.canonical
				);
			}
		}
	}

	normalize(name: string): string {
		return this.nameToCanonical.get(name.toLowerCase()) || name;
	}

	detectReligion(text: string): string | undefined {
		const lowerText = text.toLowerCase();
		for (const translation of this.translations) {
			for (const name of translation.names) {
				if (lowerText.includes(name.toLowerCase())) {
					return translation.canonical;
				}
			}
		}
		return undefined;
	}

	extractFromChurchPattern(
		creator: string
	): { parish?: string; religion?: string } | undefined {
		for (const pattern of this.churchPatterns) {
			const match = creator.match(pattern.pattern);
			if (match) {
				const religionRaw = match[pattern.religionGroup]?.trim();
				const parish = match[pattern.parishGroup]?.trim();
				if (religionRaw && parish) {
					return { religion: this.normalize(religionRaw), parish };
				}
			}
		}
		return undefined;
	}

	extractFromParishPattern(creator: string): string | undefined {
		for (const pattern of this.parishPatterns) {
			const match = creator.match(pattern.pattern);
			if (match) {
				return match[pattern.parishGroup]?.trim();
			}
		}
		return undefined;
	}
}
