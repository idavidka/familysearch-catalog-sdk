/**
 * Tests for MemoryCache
 */

import { describe, expect, it, beforeEach, vi } from "vitest";
import { MemoryCache } from "../cache/index.js";

describe("MemoryCache", () => {
	let cache: MemoryCache;

	beforeEach(() => {
		cache = new MemoryCache(3, 1); // Max 3 items, 1 second TTL
	});

	describe("set and get", () => {
		it("should store and retrieve values", () => {
			cache.set("key1", "value1");
			expect(cache.get("key1")).toBe("value1");
		});

		it("should return undefined for non-existent keys", () => {
			expect(cache.get("nonexistent")).toBeUndefined();
		});

		it("should handle different types", () => {
			cache.set("string", "test");
			cache.set("number", 42);
			cache.set("object", { foo: "bar" });

			expect(cache.get("string")).toBe("test");
			expect(cache.get("number")).toBe(42);
			expect(cache.get("object")).toEqual({ foo: "bar" });
		});
	});

	describe("TTL expiration", () => {
		it("should expire items after TTL", async () => {
			cache.set("key1", "value1", 0.1); // 0.1 second TTL

			expect(cache.get("key1")).toBe("value1");

			// Wait for expiration
			await new Promise((resolve) => setTimeout(resolve, 150));

			expect(cache.get("key1")).toBeUndefined();
		});

		it("should use default TTL when not specified", () => {
			cache.set("key1", "value1");
			expect(cache.has("key1")).toBe(true);
		});
	});

	describe("LRU eviction", () => {
		it("should evict oldest item when max size is reached", () => {
			cache.set("key1", "value1");
			cache.set("key2", "value2");
			cache.set("key3", "value3");

			// All three should be present
			expect(cache.size()).toBe(3);

			// Adding fourth item should evict the first
			cache.set("key4", "value4");

			expect(cache.size()).toBe(3);
			expect(cache.get("key1")).toBeUndefined();
			expect(cache.get("key2")).toBe("value2");
			expect(cache.get("key3")).toBe("value3");
			expect(cache.get("key4")).toBe("value4");
		});

		it("should update access order on get", () => {
			cache.set("key1", "value1");
			cache.set("key2", "value2");
			cache.set("key3", "value3");

			// Access key1 to make it most recently used
			cache.get("key1");

			// Adding fourth item should evict key2 (oldest)
			cache.set("key4", "value4");

			expect(cache.get("key1")).toBe("value1");
			expect(cache.get("key2")).toBeUndefined();
			expect(cache.get("key3")).toBe("value3");
			expect(cache.get("key4")).toBe("value4");
		});
	});

	describe("has", () => {
		it("should return true for existing keys", () => {
			cache.set("key1", "value1");
			expect(cache.has("key1")).toBe(true);
		});

		it("should return false for non-existent keys", () => {
			expect(cache.has("nonexistent")).toBe(false);
		});

		it("should return false for expired keys", async () => {
			cache.set("key1", "value1", 0.1);
			await new Promise((resolve) => setTimeout(resolve, 150));
			expect(cache.has("key1")).toBe(false);
		});
	});

	describe("delete", () => {
		it("should delete existing keys", () => {
			cache.set("key1", "value1");
			expect(cache.delete("key1")).toBe(true);
			expect(cache.get("key1")).toBeUndefined();
		});

		it("should return false for non-existent keys", () => {
			expect(cache.delete("nonexistent")).toBe(false);
		});
	});

	describe("clear", () => {
		it("should clear all entries", () => {
			cache.set("key1", "value1");
			cache.set("key2", "value2");
			cache.set("key3", "value3");

			cache.clear();

			expect(cache.size()).toBe(0);
			expect(cache.get("key1")).toBeUndefined();
			expect(cache.get("key2")).toBeUndefined();
			expect(cache.get("key3")).toBeUndefined();
		});
	});

	describe("cleanup", () => {
		it("should remove expired entries", async () => {
			cache.set("key1", "value1", 0.1);
			cache.set("key2", "value2", 10);

			await new Promise((resolve) => setTimeout(resolve, 150));

			cache.cleanup();

			expect(cache.size()).toBe(1);
			expect(cache.get("key1")).toBeUndefined();
			expect(cache.get("key2")).toBe("value2");
		});
	});
});
