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
 * Default religion translations
 * Languages: English, Hungarian, Slovak, Romanian, German, Czech, Serbian,
 *            Russian, Italian, Spanish, Polish, Croatian, French,
 *            Portuguese, Ukrainian, Latvian, Lithuanian, Estonian,
 *            Dutch, Swedish, Norwegian, Danish, Finnish, Latin,
 *            Belarusian, Yiddish
 * For additional languages, pass them via CatalogAPIOptions
 */
export const DEFAULT_RELIGION_TRANSLATIONS: ReligionTranslations[] = [
	{
		canonical: "Reformed",
		names: [
			// English
			"Reformed",
			// Hungarian
			"Református",
			// Slovak
			"Reformovaná",
			// Romanian
			"Reformat",
			// German
			"Reformiert",
			"Evangelisch-reformiert",
			// Czech
			"Reformovaná církev",
			"Českobratrská",
			// Polish
			"Reformowany",
			// French
			"Réformée",
			"Église réformée",
			// Italian
			"Riformata",
			// Spanish
			"Reformada",
			// Croatian
			"Reformirana",
			// Serbian
			"Reformovana",
			// Russian
			"Реформатская",
			// Portuguese
			"Reformada",
			// Ukrainian
			"Реформатська",
			// Dutch
			"Gereformeerd",
			"Hervormd",
			"Nederlands Hervormd",
			// Swedish
			"Reformert",
			// Norwegian
			"Reformert",
			// Danish
			"Reformert",
			// Finnish
			"Reformoitu",
			// Latvian
			"Reformātu",
			// Lithuanian
			"Reformatų",
			// Belarusian
			"Рэфармацкая",
		],
	},
	{
		canonical: "Roman Catholic",
		names: [
			// English
			"Roman Catholic",
			// Hungarian
			"Római Katólikus",
			"Római Katolikus",
			// Slovak
			"Rímsko-katolícka",
			// Romanian
			"Romano-Catolic",
			// German
			"Katholisch",
			"Katholische",
			"Römisch-Katholisch",
			"Römisch-katholisch",
			"Röm.-Kath",
			// Czech
			"Římskokatolická",
			"Rímskokatolická",
			"Katolická",
			// Polish
			"Rzymskokatolicki",
			"Rzymskokatolicka",
			// French
			"Catholique",
			"Catholique romain",
			// Italian
			"Cattolica",
			"Cattolica romana",
			"Cattolico",
			// Spanish
			"Católica",
			"Católico",
			"Romana Católica",
			// Croatian
			"Rimokatolička",
			"Rimokatolički",
			// Serbian
			"Rimokatolički",
			// Russian
			"Римско-католическая",
			"Католическая",
			// Portuguese
			"Católica romana",
			"Católico romano",
			// Ukrainian
			"Римо-католицька",
			// Dutch
			"Rooms-Katholiek",
			"Rooms-katholiek",
			"Katholiek",
			// Swedish
			"Romersk-katolsk",
			"Katolsk",
			// Norwegian
			"Romersk-katolsk",
			// Danish
			"Romersk-katolsk",
			// Finnish
			"Roomalaiskatolinen",
			// Latvian
			"Romas katoļu",
			"Katoļu",
			// Lithuanian
			"Romos katalikų",
			"Katalikų",
			// Estonian
			"Rooma-katoliku",
			// Belarusian
			"Рымска-каталіцкая",
			// Latin
			"Catholica",
			"Ecclesia Catholica",
		],
	},
	{
		canonical: "Lutheran",
		names: [
			// English
			"Lutheran",
			// Hungarian
			"Evangélikus",
			// Slovak
			"Evanjelická",
			// Romanian
			"Evanghelic",
			// German
			"Evangelisch",
			"Evangelische",
			"Lutherisch",
			"Lutherische",
			// Czech
			"Evangelická",
			"Luterská",
			// Polish
			"Ewangelicki",
			"Ewangelicko-augsburski",
			"Luterański",
			// French
			"Luthérienne",
			"Évangélique",
			// Italian
			"Luterana",
			"Luterano",
			"Evangelica luterana",
			// Spanish
			"Luterana",
			"Luterano",
			"Evangélica luterana",
			// Croatian
			"Evangelička",
			"Lutheranska",
			// Serbian
			"Luteranska",
			// Russian
			"Лютеранская",
			"Евангелическо-лютеранская",
			// Portuguese
			"Luterana",
			"Evangélica luterana",
			// Ukrainian
			"Лютеранська",
			"Євангельсько-лютеранська",
			// Dutch
			"Luthers",
			"Lutherse",
			"Evangelisch-Luthers",
			// Swedish
			"Luthersk",
			"Evangelisk-luthersk",
			// Norwegian
			"Luthersk",
			"Evangelisk-luthersk",
			// Danish
			"Luthersk",
			"Evangelisk-luthersk",
			// Finnish
			"Luterilainen",
			"Evankelis-luterilainen",
			// Latvian
			"Luterāņu",
			"Evaņģēliski luteriskā",
			// Lithuanian
			"Liuteronų",
			"Evangelikų liuteronų",
			// Estonian
			"Luterliku",
			"Evangeelne luteri",
			// Belarusian
			"Лютэранская",
			// Yiddish
			"לוטעריש",
		],
	},
	{
		canonical: "Greek Catholic",
		names: [
			// English
			"Greek Catholic",
			// Hungarian
			"Görög Katólikus",
			"Görög Katolikus",
			// Slovak
			"Gréckokatolícka",
			// Romanian
			"Greco-Catolic",
			// German
			"Griechisch-Katholisch",
			// Czech
			"Řeckokatolická",
			// Polish
			"Greckokatolicki",
			"Greckokatolicka",
			// French
			"Grec-catholique",
			// Italian
			"Greco-cattolica",
			// Spanish
			"Greco-católica",
			// Croatian
			"Grkokatolička",
			// Serbian
			"Grkokatolička",
			// Russian
			"Греко-католическая",
			// Ukrainian
			"Греко-католицька",
			"Угорська греко-католицька",
			// Belarusian
			"Грэка-каталіцкая",
			// Latvian
			"Grieķu katoļu",
			// Lithuanian
			"Graikų katalikų",
		],
	},
	{
		canonical: "Greek Orthodox",
		names: [
			// English
			"Greek Orthodox",
			"Orthodox",
			// Hungarian
			"Görög Keleti",
			"Görögkeleti",
			// Slovak
			"Pravoslávna",
			// Romanian
			"Ortodox",
			// German
			"Griechisch-Orthodox",
			"Orthodoxe",
			// Czech
			"Pravoslavná",
			// Polish
			"Prawosławny",
			"Prawosławna",
			// French
			"Orthodoxe",
			"Orthodoxe grecque",
			// Italian
			"Ortodossa",
			"Ortodosso",
			// Spanish
			"Ortodoxa",
			"Ortodoxo",
			// Croatian
			"Pravoslavna",
			// Serbian
			"Pravoslavna",
			"Srpska pravoslavna",
			// Russian
			"Православная",
			"Русская православная",
			// Portuguese
			"Ortodoxa",
			// Ukrainian
			"Православна",
			"Українська православна",
			// Belarusian
			"Праваслаўная",
			// Latvian
			"Pareizticīgo",
			// Lithuanian
			"Stačiatikių",
			// Estonian
			"Õigeusu",
			// Dutch
			"Orthodox",
			"Grieks-Orthodox",
			// Swedish
			"Ortodox",
			"Rysk-ortodox",
			// Norwegian
			"Ortodoks",
			// Danish
			"Ortodoks",
			// Finnish
			"Ortodoksinen",
		],
	},
	{
		canonical: "Serbian Orthodox",
		names: [
			// English
			"Serbian Orthodox",
			// Hungarian
			"Görögkeleti Szerb",
			"Görög Keleti Szerb",
			"Szerb Ortodox",
			"Szerb Keleti",
			// Serbian
			"Srpska pravoslavna",
			"Srpsko-pravoslavna",
			"Pravoslavna srpska",
			// Slovak
			"Srbská pravoslávna",
			// Romanian
			"Ortodox sârb",
			// German
			"Serbisch-Orthodox",
			"Serbisch-Orthodoxe",
			// Croatian
			"Srpska pravoslavna",
			// Russian
			"Сербская православная",
			// French
			"Orthodoxe serbe",
			// Italian
			"Ortodossa serba",
			// Spanish
			"Ortodoxa serbia",
		],
	},
	{
		canonical: "Jewish",
		names: [
			// English
			"Jewish",
			// Hungarian
			"Zsidó",
			"Izraelita",
			// Slovak
			"Židovská",
			// Romanian
			"Evreu",
			// German
			"Jüdisch",
			"Israelitisch",
			"Israelitische",
			"Jüdische",
			// Czech
			"Židovská",
			"Izraelitská",
			// Polish
			"Żydowski",
			"Żydowska",
			"Izraelicki",
			// French
			"Juive",
			"Israélite",
			// Italian
			"Ebraica",
			"Israelitica",
			// Spanish
			"Judía",
			"Israelita",
			// Croatian
			"Židovska",
			// Serbian
			"Jevrejska",
			// Russian
			"Еврейская",
			"Иудейская",
			// Portuguese
			"Judaica",
			"Israelita",
			// Ukrainian
			"Єврейська",
			"Іудейська",
			// Dutch
			"Joods",
			"Joodse",
			"Israëlitisch",
			// Swedish
			"Judisk",
			// Norwegian
			"Jødisk",
			// Danish
			"Jødisk",
			// Finnish
			"Juutalainen",
			// Latvian
			"Ebreju",
			// Lithuanian
			"Žydų",
			// Estonian
			"Juudi",
			// Belarusian
			"Яўрэйская",
			// Yiddish
			"ייִדיש",
			"אידיש",
		],
	},
	{
		canonical: "Baptist",
		names: [
			// English
			"Baptist",
			// Hungarian
			"Baptista",
			// Slovak
			"Baptistická",
			// German
			"Baptisten",
			"Baptistische",
			// Czech
			"Baptistická",
			// Polish
			"Baptystyczny",
			"Baptystyczna",
			// French
			"Baptiste",
			// Italian
			"Battista",
			// Spanish
			"Bautista",
			// Croatian
			"Baptistička",
			// Serbian
			"Baptistička",
			// Russian
			"Баптистская",
			// Portuguese
			"Batista",
			// Ukrainian
			"Баптистська",
			// Dutch
			"Baptisten",
			// Swedish
			"Baptistisk",
			// Norwegian
			"Baptistisk",
			// Danish
			"Baptistisk",
			// Finnish
			"Baptistinen",
			// Latvian
			"Baptistu",
			// Lithuanian
			"Baptistų",
			// Estonian
			"Baptisti",
			// Belarusian
			"Баптысцкая",
		],
	},
	{
		canonical: "Methodist",
		names: [
			// English
			"Methodist",
			// Hungarian
			"Metodista",
			// Slovak
			"Metodistická",
			// German
			"Methodisten",
			"Methodistische",
			// Czech
			"Metodistická",
			// Polish
			"Metodystyczny",
			"Metodystyczna",
			// French
			"Méthodiste",
			// Italian
			"Metodista",
			// Spanish
			"Metodista",
			// Croatian
			"Metodistička",
			// Serbian
			"Metodistička",
			// Russian
			"Методистская",
			// Portuguese
			"Metodista",
			// Ukrainian
			"Методистська",
			// Dutch
			"Methodistisch",
			// Swedish
			"Metodistisk",
			// Norwegian
			"Metodistisk",
			// Danish
			"Metodistisk",
			// Finnish
			"Metodistinen",
			// Latvian
			"Metodistu",
			// Lithuanian
			"Metodistų",
			// Estonian
			"Metodisti",
		],
	},
	{
		canonical: "Unitarian",
		names: [
			// English
			"Unitarian",
			// Hungarian
			"Unitárius",
			// Slovak
			"Unitárska",
			// German
			"Unitarisch",
			"Unitarische",
			// Czech
			"Unitářská",
			// Polish
			"Unitariański",
			"Unitariańska",
			// French
			"Unitarienne",
			// Italian
			"Unitariana",
			// Spanish
			"Unitaria",
			// Croatian
			"Unitarijanska",
			// Serbian
			"Unitarijanska",
			// Russian
			"Унитарианская",
			// Portuguese
			"Unitária",
			// Ukrainian
			"Унітарна",
			// Dutch
			"Unitarisch",
			// Swedish
			"Unitarisk",
			// Norwegian
			"Unitarisk",
			// Finnish
			"Unitaristinen",
			// Latvian
			"Unitāru",
			// Lithuanian
			"Unitarų",
		],
	},
];

/**
 * Default church patterns for extracting religion and parish
 * Covers: Hungarian, Slovak, English, German, Czech, Italian, Spanish,
 *         Polish, Croatian/Serbian, French, Russian, Portuguese, Ukrainian,
 *         Dutch, Swedish/Norwegian/Danish, Finnish, Latvian, Lithuanian,
 *         Estonian, Belarusian, Latin
 */
export const DEFAULT_CHURCH_PATTERNS: ChurchPattern[] = [
	{
		// Hungarian: "Református Egyház, Balaton-Udvari"
		name: "Hungarian Church (Egyház)",
		pattern: /^(.+?)\s+Egyház,\s+(.+)$/,
		religionGroup: 1,
		parishGroup: 2,
	},
	{
		// Slovak: "Rímskokatolícka cirkev. Farnosť Košice"
		name: "Slovak Church (cirkev)",
		pattern: /^(.+?)\s+cirkev\.\s+(.+?)(?:\s+\(|$)/i,
		religionGroup: 1,
		parishGroup: 2,
	},
	{
		// English: "Roman Catholic Church, Springfield"
		name: "English Church (Church)",
		pattern: /^(.+?)\s+Church,\s+(.+)$/,
		religionGroup: 1,
		parishGroup: 2,
	},
	{
		// German: "Katholische Kirche Braz (Innerbraz, Vorarlberg)"
		name: "German Church (Kirche)",
		pattern: /^(.+?)\s+Kirche\s+(.+)$/,
		religionGroup: 1,
		parishGroup: 2,
	},
	{
		// German: "Katholische Pfarrgemeinde Braz"
		name: "German Parish (Pfarrgemeinde)",
		pattern: /^(.+?)\s+Pfarrgemeinde\s+(.+)$/,
		religionGroup: 1,
		parishGroup: 2,
	},
	{
		// German/Austrian: "Katholische Pfarre Braz"
		name: "German Parish (Pfarre)",
		pattern: /^(.+?)\s+Pfarre\s+(.+)$/,
		religionGroup: 1,
		parishGroup: 2,
	},
	{
		// Czech: "Římskokatolická církev, farnost Praha"
		name: "Czech Church (církev)",
		pattern: /^(.+?)\s+církev,\s+(.+)$/i,
		religionGroup: 1,
		parishGroup: 2,
	},
	{
		// Italian: "Chiesa Cattolica, Milano"
		name: "Italian Church (Chiesa)",
		pattern: /^(.+?)\s+Chiesa[,\s]+(.+)$/i,
		religionGroup: 1,
		parishGroup: 2,
	},
	{
		// Spanish: "Iglesia Católica, Madrid"
		name: "Spanish Church (Iglesia)",
		pattern: /^(.+?)\s+Iglesia[,\s]+(.+)$/i,
		religionGroup: 1,
		parishGroup: 2,
	},
	{
		// Polish: "Kościół Katolicki, Kraków"
		name: "Polish Church (Kościół)",
		pattern: /^(.+?)\s+Kościół[,\s]+(.+)$/i,
		religionGroup: 1,
		parishGroup: 2,
	},
	{
		// Croatian/Serbian: "Rimokatolička Crkva, Zagreb"
		name: "Croatian/Serbian Church (Crkva)",
		pattern: /^(.+?)\s+Crkva[,\s]+(.+)$/i,
		religionGroup: 1,
		parishGroup: 2,
	},
	{
		// French: "Église catholique, Paris"
		name: "French Church (Église)",
		pattern: /^(.+?)\s+[EÉ]glise[,\s]+(.+)$/i,
		religionGroup: 1,
		parishGroup: 2,
	},
	{
		// Russian/Ukrainian/Belarusian: "Православная Церковь, Москва"
		name: "Cyrillic Church (Церковь/Церква)",
		pattern: /^(.+?)\s+Церков[ьа][,\s]+(.+)$/i,
		religionGroup: 1,
		parishGroup: 2,
	},
	{
		// Portuguese: "Igreja Católica, Lisboa"
		name: "Portuguese Church (Igreja)",
		pattern: /^(.+?)\s+Igreja[,\s]+(.+)$/i,
		religionGroup: 1,
		parishGroup: 2,
	},
	{
		// Dutch: "Rooms-Katholieke Kerk, Amsterdam"
		name: "Dutch Church (Kerk)",
		pattern: /^(.+?)\s+[Kk]erk[,\s]+(.+)$/,
		religionGroup: 1,
		parishGroup: 2,
	},
	{
		// Swedish/Norwegian/Danish: "Luthersk Kyrka/Kirke, Stockholm"
		name: "Swedish Church (Kyrka)",
		pattern: /^(.+?)\s+[Kk]yrka[,\s]+(.+)$/,
		religionGroup: 1,
		parishGroup: 2,
	},
	{
		// Norwegian/Danish: "Luthersk Kirke, Oslo"
		name: "Norwegian/Danish Church (Kirke)",
		pattern: /^(.+?)\s+[Kk]irke[,\s]+(.+)$/,
		religionGroup: 1,
		parishGroup: 2,
	},
	{
		// Finnish: "Luterilainen Kirkko, Helsinki"
		name: "Finnish Church (Kirkko)",
		pattern: /^(.+?)\s+[Kk]irkko[,\s]+(.+)$/,
		religionGroup: 1,
		parishGroup: 2,
	},
	{
		// Latvian: "Katoļu Baznīca, Rīga"
		name: "Latvian Church (Baznīca)",
		pattern: /^(.+?)\s+[Bb]aznīca[,\s]+(.+)$/,
		religionGroup: 1,
		parishGroup: 2,
	},
	{
		// Lithuanian: "Katalikų Bažnyčia, Vilnius"
		name: "Lithuanian Church (Bažnyčia)",
		pattern: /^(.+?)\s+[Bb]ažnyčia[,\s]+(.+)$/,
		religionGroup: 1,
		parishGroup: 2,
	},
	{
		// Estonian: "Rooma-katoliku Kirik, Tallinn"
		name: "Estonian Church (Kirik)",
		pattern: /^(.+?)\s+[Kk]irik[,\s]+(.+)$/,
		religionGroup: 1,
		parishGroup: 2,
	},
	{
		// Latin: "Ecclesia Catholica, Roma"
		name: "Latin Church (Ecclesia)",
		pattern: /^(.+?)\s+[Ee]cclesia[,\s]+(.+)$/,
		religionGroup: 1,
		parishGroup: 2,
	},
];

/**
 * Default parish patterns for extracting parish names (no religion prefix)
 */
export const DEFAULT_PARISH_PATTERNS: ParishPattern[] = [
	{
		// Slovak: "Farský úrad Košice"
		name: "Slovak Parish Office (Farský úrad)",
		pattern: /^Farský\s+úrad\s+(.+)$/i,
		parishGroup: 1,
	},
	{
		// Hungarian: "Kismaros Plébánia"
		name: "Hungarian Parish (Plébánia)",
		pattern: /^(.+)\s+Plébánia$/,
		parishGroup: 1,
	},
	{
		// German: "Pfarramt Braz" or "Pfarrkirche Braz"
		name: "German Parish Office (Pfarramt/Pfarrkirche)",
		pattern: /^Pfarr(?:amt|kirche)\s+(.+)$/i,
		parishGroup: 1,
	},
	{
		// Italian: "Parrocchia di Milano"
		name: "Italian Parish (Parrocchia)",
		pattern: /^Parrocchia\s+(?:di\s+)?(.+)$/i,
		parishGroup: 1,
	},
	{
		// Spanish/Portuguese: "Parroquia de Madrid" / "Paróquia de Lisboa"
		name: "Spanish/Portuguese Parish (Parroquia/Paróquia)",
		pattern: /^Par[oó]quia\s+(?:de\s+)?(.+)$/i,
		parishGroup: 1,
	},
	{
		// Polish: "Parafia Kraków"
		name: "Polish Parish (Parafia)",
		pattern: /^Parafia\s+(.+)$/i,
		parishGroup: 1,
	},
	{
		// Czech/Slovak: "Farnost Praha"
		name: "Czech/Slovak Parish (Farnost/Farnosť)",
		pattern: /^Farnos[ťt]\s+(.+)$/i,
		parishGroup: 1,
	},
	{
		// Croatian/Serbian: "Župa Zagreb"
		name: "Croatian/Serbian Parish (Župa)",
		pattern: /^Župa\s+(.+)$/i,
		parishGroup: 1,
	},
	{
		// French: "Paroisse de Paris"
		name: "French Parish (Paroisse)",
		pattern: /^Paroisse\s+(?:de\s+)?(.+)$/i,
		parishGroup: 1,
	},
	{
		// Russian: "Приход Москвы" / Ukrainian: "Парафія Львова"
		name: "Cyrillic Parish (Приход/Парафія/Прыход)",
		pattern: /^(?:Приход|Парафія|Прыход)\s+(.+)$/i,
		parishGroup: 1,
	},
	{
		// Dutch: "Parochie van Amsterdam"
		name: "Dutch Parish (Parochie)",
		pattern: /^Parochie\s+(?:van\s+)?(.+)$/i,
		parishGroup: 1,
	},
	{
		// Swedish: "Församling Stockholm"
		name: "Swedish Parish (Församling)",
		pattern: /^(.+)\s+[Ff]örsamling$/,
		parishGroup: 1,
	},
	{
		// Norwegian/Danish: "Menighet Oslo" or "Sogn Oslo"
		name: "Norwegian/Danish Parish (Menighet/Sogn)",
		pattern: /^(?:Menighet|Sogn)\s+(.+)$/i,
		parishGroup: 1,
	},
	{
		// Finnish: "Seurakunta Helsinki"
		name: "Finnish Parish (Seurakunta)",
		pattern: /^(.+)\s+[Ss]eurakunta$/,
		parishGroup: 1,
	},
	{
		// Latvian: "Draudze Rīga"
		name: "Latvian Parish (Draudze)",
		pattern: /^(.+)\s+[Dd]raudze$/,
		parishGroup: 1,
	},
	{
		// Lithuanian: "Parapija Vilnius"
		name: "Lithuanian Parish (Parapija)",
		pattern: /^Parapija\s+(.+)$/i,
		parishGroup: 1,
	},
	{
		// Estonian: "Kogudus Tallinn"
		name: "Estonian Parish (Kogudus)",
		pattern: /^(.+)\s+[Kk]ogudus$/,
		parishGroup: 1,
	},
	{
		// Latin: "Parochia Romae"
		name: "Latin Parish (Parochia)",
		pattern: /^Parochia\s+(.+)$/i,
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
		// Return canonical name if known, otherwise return the raw string as-is.
		// This ensures we never lose the religion info even for unknown languages.
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
