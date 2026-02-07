/**
 * URL generation utilities for FamilySearch Catalog
 *
 * @packageDocumentation
 */

/**
 * Base URL for FamilySearch Catalog search
 */
const CATALOG_SEARCH_BASE_URL =
	"https://www.familysearch.org/search/catalog/results";

/**
 * Generate a FamilySearch Catalog search URL by author ID
 *
 * @param authorId - The author ID to search for
 * @param count - Number of results to return (default: 20)
 * @returns FamilySearch Catalog search URL
 *
 * @example
 * ```typescript
 * const url = generateAuthorSearchUrl(150255802);
 * // Returns: "https://www.familysearch.org/search/catalog/results?count=20&q.authorId=150255802"
 * ```
 */
export function generateAuthorSearchUrl(
	authorId: number,
	count: number = 20
): string {
	return `${CATALOG_SEARCH_BASE_URL}?count=${count}&q.authorId=${authorId}`;
}

/**
 * Generate a FamilySearch Catalog search URL by author name
 *
 * @param authorName - The author name to search for
 * @param count - Number of results to return (default: 20)
 * @returns FamilySearch Catalog search URL
 *
 * @example
 * ```typescript
 * const url = generateAuthorNameSearchUrl("Magyar Országos Levéltár");
 * // Returns: "https://www.familysearch.org/search/catalog/results?count=20&q.author=Magyar%20Orsz%C3%A1gos%20Lev%C3%A9lt%C3%A1r"
 * ```
 */
export function generateAuthorNameSearchUrl(
	authorName: string,
	count: number = 20
): string {
	const encodedAuthor = encodeURIComponent(authorName);
	return `${CATALOG_SEARCH_BASE_URL}?count=${count}&q.author=${encodedAuthor}`;
}

/**
 * Generate a FamilySearch Catalog search URL by subject
 *
 * @param subject - The subject to search for
 * @param count - Number of results to return (default: 20)
 * @returns FamilySearch Catalog search URL
 *
 * @example
 * ```typescript
 * const url = generateSubjectSearchUrl("Református Egyház");
 * // Returns: "https://www.familysearch.org/search/catalog/results?count=20&q.subject%3A%22Reform%C3%A1tus+Egyh%C3%A1z%22"
 * ```
 */
export function generateSubjectSearchUrl(
	subject: string,
	count: number = 20
): string {
	const encodedSubject = encodeURIComponent(subject);
	return `${CATALOG_SEARCH_BASE_URL}?count=${count}&q.subject%3A%22${encodedSubject}%22`;
}

/**
 * Generate a FamilySearch Catalog search URL by author ID or subject (fallback)
 *
 * @param options - Search options
 * @param options.authorId - Optional author ID to search for (preferred)
 * @param options.authorName - Optional author name to search for (if no authorId)
 * @param options.subject - Optional subject to search for (fallback)
 * @param options.count - Number of results to return (default: 20)
 * @returns FamilySearch Catalog search URL
 *
 * @example
 * ```typescript
 * // With authorId (preferred)
 * const url1 = generateCatalogSearchUrl({ authorId: 150255802 });
 *
 * // With authorName (if no authorId)
 * const url2 = generateCatalogSearchUrl({ authorName: "Magyar Országos Levéltár" });
 *
 * // Fallback to subject
 * const url3 = generateCatalogSearchUrl({ subject: "Református Egyház" });
 * ```
 */
export function generateCatalogSearchUrl(options: {
	authorId?: number;
	authorName?: string;
	subject?: string;
	count?: number;
}): string {
	const { authorId, authorName, subject, count = 20 } = options;

	if (authorId !== undefined) {
		return generateAuthorSearchUrl(authorId, count);
	}

	if (authorName) {
		return generateAuthorNameSearchUrl(authorName, count);
	}

	if (subject) {
		return generateSubjectSearchUrl(subject, count);
	}

	throw new Error("Either authorId, authorName, or subject must be provided");
}

