/**
 * Parser utilities for extracting information from catalog records
 * 
 * Provides utilities for:
 * - Parish name extraction
 * - Date range parsing
 * - Author extraction
 * - Registry type detection
 */

/**
 * Extract parish name from catalog title
 * 
 * @param title Catalog record title
 * 
 * @example
 * ```typescript
 * const parish = extractParishName("Roman Catholic Parish of Nagymaros, 1730-1895");
 * console.log(parish); // "Nagymaros"
 * ```
 */
export function extractParishName(title: string): string | null {
	// Pattern: "<Type> Parish of <Name>"
	const parishMatch = title.match(
		/(?:roman catholic|lutheran|reformed|evangelical|greek catholic|orthodox)\s+parish\s+of\s+([^,]+)/i
	);
	if (parishMatch) {
		return parishMatch[1].trim();
	}

	// Pattern: "<Name> Parish"
	const simpleMatch = title.match(/([^,]+)\s+parish/i);
	if (simpleMatch) {
		return simpleMatch[1].trim();
	}

	return null;
}

/**
 * Extract registry type from title
 * 
 * @param title Catalog record title
 * 
 * @example
 * ```typescript
 * const type = extractRegistryType("Roman Catholic Parish of Nagymaros");
 * console.log(type); // "Roman Catholic"
 * ```
 */
export function extractRegistryType(title: string): string | null {
	const types = [
		"Roman Catholic",
		"Lutheran",
		"Reformed",
		"Evangelical",
		"Greek Catholic",
		"Orthodox",
		"Jewish",
		"Civil Registration",
	];

	const lowerTitle = title.toLowerCase();

	for (const type of types) {
		if (lowerTitle.includes(type.toLowerCase())) {
			return type;
		}
	}

	return null;
}

/**
 * Parse date range from text
 * 
 * Supports formats like:
 * - "1730-1895"
 * - "1730 - 1895"
 * - "1730–1895"
 * - "1730"
 * 
 * @param text Text containing date range
 * 
 * @example
 * ```typescript
 * const range = parseDateRange("Records from 1730-1895");
 * console.log(range); // { start: 1730, end: 1895 }
 * ```
 */
export function parseDateRange(
	text: string
): { start: number; end: number } | null {
	// Range pattern: "YYYY-YYYY" or "YYYY – YYYY"
	const rangeMatch = text.match(/(\d{4})\s*[-–]\s*(\d{4})/);
	if (rangeMatch) {
		return {
			start: parseInt(rangeMatch[1], 10),
			end: parseInt(rangeMatch[2], 10),
		};
	}

	// Single year pattern
	const singleMatch = text.match(/(\d{4})/);
	if (singleMatch) {
		const year = parseInt(singleMatch[1], 10);
		return { start: year, end: year };
	}

	return null;
}

/**
 * Extract author name from attribution text
 * 
 * @param attribution Attribution text
 * 
 * @example
 * ```typescript
 * const author = extractAuthor("Created by John Doe");
 * console.log(author); // "John Doe"
 * ```
 */
export function extractAuthor(attribution: string): string | null {
	// Pattern: "by <Name>"
	const byMatch = attribution.match(/by\s+([^,;]+)/i);
	if (byMatch) {
		return byMatch[1].trim();
	}

	// Pattern: "Created by <Name>"
	const createdMatch = attribution.match(/created\s+by\s+([^,;]+)/i);
	if (createdMatch) {
		return createdMatch[1].trim();
	}

	// If attribution is short, assume it's the author name
	if (attribution.length < 100 && !attribution.includes(".")) {
		return attribution.trim();
	}

	return null;
}

/**
 * Format year range as string
 * 
 * @param start Start year
 * @param end End year
 * 
 * @example
 * ```typescript
 * const formatted = formatYearRange(1730, 1895);
 * console.log(formatted); // "1730-1895"
 * ```
 */
export function formatYearRange(start: number, end: number): string {
	if (start === end) {
		return start.toString();
	}
	return `${start}-${end}`;
}

/**
 * Normalize place name for comparison
 * 
 * Removes accents, converts to lowercase, removes punctuation
 * 
 * @param placeName Place name
 * 
 * @example
 * ```typescript
 * const normalized = normalizePlaceName("Kismarós");
 * console.log(normalized); // "kismaros"
 * ```
 */
export function normalizePlaceName(placeName: string): string {
	return placeName
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "") // Remove diacritics
		.replace(/[^\w\s]/g, "") // Remove punctuation
		.trim();
}

/**
 * Calculate similarity between two strings using Levenshtein distance
 * 
 * @param str1 First string
 * @param str2 Second string
 * @returns Similarity score (0-1)
 */
export function calculateSimilarity(str1: string, str2: string): number {
	const len1 = str1.length;
	const len2 = str2.length;

	if (len1 === 0) return len2 === 0 ? 1 : 0;
	if (len2 === 0) return 0;

	// Exact match
	if (str1 === str2) return 1;

	// Contains check
	if (str1.includes(str2) || str2.includes(str1)) {
		return 0.8;
	}

	// Levenshtein distance (simplified)
	const maxLen = Math.max(len1, len2);
	const distance = levenshteinDistance(str1, str2);

	return 1 - distance / maxLen;
}

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(str1: string, str2: string): number {
	const len1 = str1.length;
	const len2 = str2.length;
	const matrix: number[][] = [];

	for (let i = 0; i <= len1; i++) {
		matrix[i] = [i];
	}

	for (let j = 0; j <= len2; j++) {
		matrix[0][j] = j;
	}

	for (let i = 1; i <= len1; i++) {
		for (let j = 1; j <= len2; j++) {
			const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
			matrix[i][j] = Math.min(
				matrix[i - 1][j] + 1, // deletion
				matrix[i][j - 1] + 1, // insertion
				matrix[i - 1][j - 1] + cost // substitution
			);
		}
	}

	return matrix[len1][len2];
}
