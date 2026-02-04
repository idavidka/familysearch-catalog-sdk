/**
 * In-memory LRU cache with TTL support
 */

import type { Cache, CacheEntry } from "../types/index";

export class MemoryCache implements Cache {
	private cache: Map<string, CacheEntry<unknown>>;
	private readonly maxSize: number;
	private readonly defaultTTL: number;

	/**
	 * Create a new memory cache
	 * @param maxSize Maximum number of entries (default: 1000)
	 * @param defaultTTL Default TTL in seconds (default: 3600 = 1 hour)
	 */
	constructor(maxSize: number = 1000, defaultTTL: number = 3600) {
		this.cache = new Map();
		this.maxSize = maxSize;
		this.defaultTTL = defaultTTL;
	}

	/**
	 * Get value from cache
	 */
	get<T>(key: string): T | undefined {
		const entry = this.cache.get(key) as CacheEntry<T> | undefined;

		if (!entry) {
			return undefined;
		}

		// Check if expired
		const now = Date.now();
		const age = (now - entry.timestamp) / 1000;

		if (age > entry.ttl) {
			this.cache.delete(key);
			return undefined;
		}

		// Move to end (LRU)
		this.cache.delete(key);
		this.cache.set(key, entry);

		return entry.data;
	}

	/**
	 * Set value in cache
	 */
	set<T>(key: string, value: T, ttl?: number): void {
		// Remove oldest if at max size
		if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
			const firstKey = this.cache.keys().next().value;
			if (firstKey !== undefined) {
				this.cache.delete(firstKey);
			}
		}

		const entry: CacheEntry<T> = {
			data: value,
			timestamp: Date.now(),
			ttl: ttl ?? this.defaultTTL,
		};

		this.cache.set(key, entry as CacheEntry<unknown>);
	}

	/**
	 * Check if key exists in cache
	 */
	has(key: string): boolean {
		const value = this.get(key);
		return value !== undefined;
	}

	/**
	 * Delete key from cache
	 */
	delete(key: string): boolean {
		return this.cache.delete(key);
	}

	/**
	 * Clear all cache entries
	 */
	clear(): void {
		this.cache.clear();
	}

	/**
	 * Get cache size
	 */
	size(): number {
		return this.cache.size;
	}

	/**
	 * Clean up expired entries
	 */
	cleanup(): void {
		const now = Date.now();
		const keysToDelete: string[] = [];

		for (const [key, entry] of this.cache.entries()) {
			const age = (now - entry.timestamp) / 1000;
			if (age > entry.ttl) {
				keysToDelete.push(key);
			}
		}

		for (const key of keysToDelete) {
			this.cache.delete(key);
		}
	}
}

export { type Cache, type CacheEntry } from "../types/index";
