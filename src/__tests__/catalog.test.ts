/**
 * Unit tests for Catalog API - parish and religion extraction
 */

import { describe, it, expect, beforeEach } from "vitest";
import { CatalogAPI } from "../catalog/index";
import type { CatalogPlacesClient } from "../client/index";
import {
	CENTRAL_EUROPEAN_RELIGION_TRANSLATIONS,
	CENTRAL_EUROPEAN_CHURCH_PATTERNS,
	CENTRAL_EUROPEAN_PARISH_PATTERNS,
} from "../../../../src/configs/religion-translations";

// Mock client
const mockClient: CatalogPlacesClient = {
	getWebBaseUrl: () => "https://www.familysearch.org",
} as any;

describe("CatalogAPI - Parish and Religion Extraction", () => {
	let catalogAPI: CatalogAPI;

	beforeEach(() => {
		// Initialize with Central European patterns (same as main app)
		catalogAPI = new CatalogAPI(mockClient, {
			additionalReligionTranslations:
				CENTRAL_EUROPEAN_RELIGION_TRANSLATIONS,
			additionalChurchPatterns: CENTRAL_EUROPEAN_CHURCH_PATTERNS,
			additionalParishPatterns: CENTRAL_EUROPEAN_PARISH_PATTERNS,
		});
	});

	describe("Hungarian mock data", () => {
		it("should extract Reformed church and parish", () => {
			const creators = [
				"Magyarország. Országos Levéltár",
				"Református Egyház, Balaton-Udvari",
			];

			// Access private method via any
			const result = (catalogAPI as any).extractParishAndReligion(
				creators
			);

			expect(result.religion).toBe("Reformed");
			expect(result.parish).toBe("Balaton-Udvari");
		});

		it("should extract Roman Catholic church and parish", () => {
			const creators = [
				"Magyar Országos Levéltár",
				"Római Katólikus Egyház, Aszófő",
			];

			const result = (catalogAPI as any).extractParishAndReligion(
				creators
			);

			expect(result.religion).toBe("Roman Catholic");
			expect(result.parish).toBe("Aszófő");
		});

		it("should extract civil registration (no religion)", () => {
			const creators = [
				"Balaton-Udvari (Zala). Anyakönyvi Hivatal",
				"Szekszárdon a Tolna Megyei Levéltárban",
			];

			const result = (catalogAPI as any).extractParishAndReligion(
				creators
			);

			// Civil records don't have religion
			expect(result.religion).toBeUndefined();
			expect(result.parish).toBeUndefined();
		});
	});

	describe("Slovak mock data", () => {
		it("should extract Roman Catholic church and parish from Slovak format", () => {
			const creators = [
				"Rímsko-katolícka cirkev. Farský úrad Bajtava (Parkan)",
				"Štátny oblastný archív v Nitre",
			];

			const result = (catalogAPI as any).extractParishAndReligion(
				creators
			);

			expect(result.religion).toBe("Roman Catholic");
			// Slovak pattern should extract parish from "Farský úrad Bajtava"
			expect(result.parish).toBeDefined();
		});
	});

	describe("Religion normalization", () => {
		it("should normalize Hungarian Reformed to canonical English", () => {
			const creators = ["Református Egyház, Test Parish"];

			const result = (catalogAPI as any).extractParishAndReligion(
				creators
			);

			expect(result.religion).toBe("Reformed");
		});

		it("should normalize Slovak Roman Catholic to canonical English", () => {
			const creators = ["Rímsko-katolícka Egyház, Test Parish"];

			const result = (catalogAPI as any).extractParishAndReligion(
				creators
			);

			expect(result.religion).toBe("Roman Catholic");
		});
	});

	describe("Edge cases", () => {
		it("should handle empty creators array", () => {
			const result = (catalogAPI as any).extractParishAndReligion([]);

			expect(result.religion).toBeUndefined();
			expect(result.parish).toBeUndefined();
		});

		it("should handle creators with no matching patterns", () => {
			const creators = ["Some Random Archive Name"];

			const result = (catalogAPI as any).extractParishAndReligion(
				creators
			);

			expect(result.religion).toBeUndefined();
			expect(result.parish).toBeUndefined();
		});
	});
});
