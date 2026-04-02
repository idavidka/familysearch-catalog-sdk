import { stringify } from 'csv-stringify/sync';
import type { Common } from '@treeviz/gedcom-parser';
import type { ConvertInput, CsvConvertOptions } from '../types/index.js';
import { resolveInput, t } from '../utils/index.js';

/**
 * Convert GEDCOM data to a CSV string.
 *
 * @param input - Raw GEDCOM string or parsed GedComType object.
 * @param options - Optional conversion options.
 * @returns CSV formatted string.
 */
export async function convertToCsv(
  input: ConvertInput,
  options: CsvConvertOptions = {},
): Promise<string> {
  const gedcom = resolveInput(input);
  const entityType = options.type ?? 'INDI';
  const delimiter = options.delimiter ?? ',';
  const filterKeys = options.filter ? new Set(options.filter) : null;

  const csvOptions = { delimiter, header: true };

  if (entityType === 'INDI' || entityType === 'all') {
    const indis = gedcom.indis();
    const rows: Record<string, string>[] = [];

    if (indis) {
      indis.forEach((indi) => {
        if (!indi) return;
        const key = indi.id as string;
        if (filterKeys && !filterKeys.has(key as never)) return;

        rows.push({
          [t('id')]: key,
          [t('name')]: indi.toName() ?? '',
          [t('sex')]: indi.get<Common>('SEX')?.toValue() ?? '',
          [t('birth_date')]: indi.getBirthDate() ?? '',
          [t('birth_place')]: indi.getBirthPlace() ?? '',
          [t('death_date')]: indi.getDeathDate() ?? '',
          [t('death_place')]: indi.getDeathPlace() ?? '',
        });
      });
    }

    if (entityType === 'INDI') {
      return stringify(rows, csvOptions);
    }

    if (entityType === 'all') {
      const indiCsv = stringify(rows, csvOptions);
      const famCsv = await convertFamsToCsv(gedcom, delimiter);
      return `${t('individuals')}\n${indiCsv}\n${t('families')}\n${famCsv}`;
    }
  }

  if (entityType === 'FAM') {
    return convertFamsToCsv(gedcom, delimiter);
  }

  if (entityType === 'SOUR') {
    return convertSourcesToCsv(gedcom, delimiter);
  }

  return '';
}

async function convertFamsToCsv(gedcom: ReturnType<typeof resolveInput>, delimiter: string): Promise<string> {
  const fams = gedcom.fams();
  const rows: Record<string, string>[] = [];

  if (fams) {
    fams.forEach((fam) => {
      if (!fam) return;
      const husband = fam.getHusband()?.first();
      const wife = fam.getWife()?.first();
      const children = fam.getChildren();

      rows.push({
        [t('id')]: fam.id as string,
        [t('husband')]: husband ? (husband.toName() ?? '') : '',
        [t('wife')]: wife ? (wife.toName() ?? '') : '',
        [t('marriage_date')]: fam.get<Common>('MARR')?.get<Common>('DATE')?.toValue() ?? '',
        [t('marriage_place')]: fam.get<Common>('MARR')?.get<Common>('PLAC')?.toValue() ?? '',
        [t('children_count')]: String(children?.length ?? 0),
      });
    });
  }

  return stringify(rows, { delimiter, header: true });
}

async function convertSourcesToCsv(gedcom: ReturnType<typeof resolveInput>, delimiter: string): Promise<string> {
  const sources = gedcom.sours();
  const rows: Record<string, string>[] = [];

  if (sources) {
    sources.forEach((sour) => {
      if (!sour) return;
      rows.push({
        [t('id')]: sour.id as string,
        [t('title')]: sour.get<Common>('TITL')?.toValue() ?? '',
        [t('author')]: sour.get<Common>('AUTH')?.toValue() ?? '',
        [t('publication')]: sour.get<Common>('PUBL' as 'TITL')?.toValue() ?? '',
      });
    });
  }

  return stringify(rows, { delimiter, header: true });
}
