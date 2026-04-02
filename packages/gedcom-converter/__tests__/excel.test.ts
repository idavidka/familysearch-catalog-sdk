import { describe, it, expect, beforeEach } from 'vitest';
import { convertToExcel } from '../src/converters/excel.js';
import { resetConverterSettings } from '../src/factories/state-factory.js';

const MINIMAL_GEDCOM = `0 HEAD
1 GEDC
2 VERS 5.5.1
1 CHAR UTF-8
0 @I1@ INDI
1 NAME John /Smith/
1 SEX M
1 BIRT
2 DATE 1 JAN 1900
2 PLAC London
0 @F1@ FAM
1 HUSB @I1@
0 TRLR`;

describe('convertToExcel', () => {
  beforeEach(() => {
    resetConverterSettings();
  });

  it('returns a non-empty Buffer', async () => {
    const result = await convertToExcel(MINIMAL_GEDCOM);
    expect(result).toBeInstanceOf(Buffer);
    expect(result.length).toBeGreaterThan(0);
  });

  it('output starts with Excel magic bytes (PK zip header)', async () => {
    const result = await convertToExcel(MINIMAL_GEDCOM);
    // .xlsx is a ZIP file starting with PK (0x50 0x4B)
    expect(result[0]).toBe(0x50);
    expect(result[1]).toBe(0x4b);
  });
});
