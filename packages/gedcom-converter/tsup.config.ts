import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'converters/index': 'src/converters/index.ts',
    'converters/gedcom': 'src/converters/gedcom.ts',
    'converters/json': 'src/converters/json.ts',
    'converters/excel': 'src/converters/excel.ts',
    'converters/csv': 'src/converters/csv.ts',
    'converters/docx': 'src/converters/docx.ts',
    'converters/pdf': 'src/converters/pdf.ts',
    'converters/card': 'src/converters/card.ts',
    'converters/svg': 'src/converters/svg.ts',
    'factories/index': 'src/factories/index.ts',
    'factories/i18n-factory': 'src/factories/i18n-factory.ts',
    'factories/state-factory': 'src/factories/state-factory.ts',
    'types/index': 'src/types/index.ts',
    'utils/index': 'src/utils/index.ts',
  },
  format: ['esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  target: 'node20',
  platform: 'node',
});
