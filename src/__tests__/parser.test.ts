/**
 * Tests for Parser utilities
 */

import { describe, expect, it } from "vitest";
import * as Parser from "../parser/index.js";

describe("Parser utilities", () => {
	describe("extractParishName", () => {
		it("should extract parish name from title", () => {
			const result = Parser.extractParishName(
				"Roman Catholic Parish of Nagymaros"
			);
			expect(result).toBe("Nagymaros");
		});

		it("should extract parish name from complex title", () => {
			const result = Parser.extractParishName(
				"Roman Catholic Parish of Nagymaros, 1730-1895"
			);
			expect(result).toBe("Nagymaros");
		});

		it("should return null for invalid title", () => {
			const result = Parser.extractParishName("Some random title");
			expect(result).toBeNull();
		});
	});

	describe("extractRegistryType", () => {
		it("should extract Roman Catholic", () => {
			const result = Parser.extractRegistryType(
				"Roman Catholic Parish of Nagymaros"
			);
			expect(result).toBe("Roman Catholic");
		});

		it("should extract Lutheran", () => {
			const result = Parser.extractRegistryType(
				"Lutheran Parish of Budapest"
			);
			expect(result).toBe("Lutheran");
		});

		it("should return null for unknown type", () => {
			const result = Parser.extractRegistryType("Some other title");
			expect(result).toBeNull();
		});
	});

	describe("parseDateRange", () => {
		it("should parse date range with hyphen", () => {
			const result = Parser.parseDateRange("1730-1895");
			expect(result).toEqual({ start: 1730, end: 1895 });
		});

		it("should parse date range with spaces", () => {
			const result = Parser.parseDateRange("1730 - 1895");
			expect(result).toEqual({ start: 1730, end: 1895 });
		});

		it("should parse single year", () => {
			const result = Parser.parseDateRange("1895");
			expect(result).toEqual({ start: 1895, end: 1895 });
		});

		it("should parse date range from text", () => {
			const result = Parser.parseDateRange(
				"Records from 1730-1895"
			);
			expect(result).toEqual({ start: 1730, end: 1895 });
		});

		it("should return null for invalid text", () => {
			const result = Parser.parseDateRange("no dates here");
			expect(result).toBeNull();
		});
	});

	describe("formatYearRange", () => {
		it("should format year range", () => {
			const result = Parser.formatYearRange(1730, 1895);
			expect(result).toBe("1730-1895");
		});

		it("should format single year", () => {
			const result = Parser.formatYearRange(1895, 1895);
			expect(result).toBe("1895");
		});
	});

	describe("normalizePlaceName", () => {
		it("should normalize place name", () => {
			const result = Parser.normalizePlaceName("Kismarós");
			expect(result).toBe("kismaros");
		});

		it("should remove punctuation", () => {
			const result = Parser.normalizePlaceName("Budapest, Hungary");
			expect(result).toBe("budapest hungary");
		});

		it("should handle empty string", () => {
			const result = Parser.normalizePlaceName("");
			expect(result).toBe("");
		});
	});

	describe("calculateSimilarity", () => {
		it("should return 1 for identical strings", () => {
			const result = Parser.calculateSimilarity("test", "test");
			expect(result).toBe(1);
		});

		it("should return high similarity for substring", () => {
			const result = Parser.calculateSimilarity("test", "testing");
			expect(result).toBeGreaterThan(0.7);
		});

		it("should return 0 for empty string", () => {
			const result = Parser.calculateSimilarity("", "test");
			expect(result).toBe(0);
		});
	});
});
