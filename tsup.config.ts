import { defineConfig } from "tsup";

export default defineConfig({
	entry: {
		index: "src/index.ts",
		"client/index": "src/client/index.ts",
		"places/index": "src/places/index.ts",
		"catalog/index": "src/catalog/index.ts",
		"parser/index": "src/parser/index.ts",
		"cache/index": "src/cache/index.ts",
	},
	format: ["esm", "cjs"],
	dts: true,
	clean: true,
	sourcemap: false,
	splitting: false,
	treeshake: true,
	minify: false,
});
