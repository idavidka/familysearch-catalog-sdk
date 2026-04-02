import { describe, it, expect, beforeEach } from 'vitest';
import { convertToDocx } from '../src/converters/docx.js';
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
1 DEAT
2 DATE 5 MAR 1970
2 PLAC Paris
0 TRLR`;

describe('convertToDocx', () => {
  beforeEach(() => {
    resetConverterSettings();
  });

  it('returns a non-empty Buffer', async () => {
    const result = await convertToDocx(MINIMAL_GEDCOM);
    expect(result).toBeInstanceOf(Buffer);
    expect(result.length).toBeGreaterThan(0);
  });

  it('output starts with PK (ZIP/OOXML magic bytes)', async () => {
    const result = await convertToDocx(MINIMAL_GEDCOM);
    expect(result[0]).toBe(0x50);
    expect(result[1]).toBe(0x4b);
  });
});
