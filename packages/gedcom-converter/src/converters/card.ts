import type { Common } from '@treeviz/gedcom-parser';
import type { ConvertInput, CardConvertOptions } from '../types/index.js';
import { resolveInput } from '../utils/index.js';

/**
 * Convert GEDCOM individuals to vCard format (.vcf).
 *
 * @param input - Raw GEDCOM string or parsed GedComType object.
 * @param options - Optional conversion options.
 * @returns vCard formatted string.
 */
export async function convertToCard(
  input: ConvertInput,
  options: CardConvertOptions = {},
): Promise<string> {
  const gedcom = resolveInput(input);
  const version = options.version ?? '3.0';
  const filterKeys = options.filter ? new Set(options.filter) : null;
  const cards: string[] = [];

  const indis = gedcom.indis();

  if (indis) {
    indis.forEach((indi) => {
      if (!indi) return;
      const key = indi.id as string;
      if (filterKeys && !filterKeys.has(key as never)) return;

      const name = indi.toName() ?? '';
      const nameParts = name.split(' ');
      const givenName = nameParts.slice(0, -1).join(' ');
      const surname = nameParts[nameParts.length - 1] ?? '';
      const sex = indi.get<Common>('SEX')?.toValue() ?? '';
      const birthDate = indi.getBirthDate() ?? '';
      const note = key;

      const lines: string[] = [
        `BEGIN:VCARD`,
        `VERSION:${version}`,
        `FN:${escapeProp(name)}`,
        `N:${escapeProp(surname)};${escapeProp(givenName)};;;`,
      ];

      if (sex) {
        lines.push(`GENDER:${sex === 'M' ? 'M' : sex === 'F' ? 'F' : 'U'}`);
      }

      if (birthDate) {
        const isoDate = normalizeDate(birthDate);
        if (isoDate) {
          lines.push(`BDAY:${isoDate}`);
        }
      }

      if (note) {
        lines.push(`NOTE:${escapeProp(note)}`);
      }

      lines.push(`END:VCARD`);
      cards.push(lines.join('\r\n'));
    });
  }

  return cards.join('\r\n\r\n');
}

function escapeProp(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

function normalizeDate(rawDate: string): string | null {
  const yearMatch = rawDate.match(/\b(\d{4})\b/);
  if (!yearMatch) return null;
  return yearMatch[1];
}
