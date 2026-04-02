import ExcelJS from 'exceljs';
import type { Common } from '@treeviz/gedcom-parser';
import type { ConvertInput, ExcelConvertOptions } from '../types/index.js';
import { resolveInput, t } from '../utils/index.js';

/**
 * Convert GEDCOM data to an Excel workbook buffer (.xlsx).
 *
 * @param input - Raw GEDCOM string or parsed GedComType object.
 * @param options - Optional conversion options.
 * @returns Buffer containing the Excel workbook.
 */
export async function convertToExcel(
  input: ConvertInput,
  options: ExcelConvertOptions = {},
): Promise<Buffer> {
  const gedcom = resolveInput(input);
  const sheetPerType = options.sheetPerType !== false;
  const filterKeys = options.filter ? new Set(options.filter) : null;

  const workbook = new ExcelJS.Workbook();
  workbook.creator = '@treeviz/gedcom-convert';
  workbook.created = new Date();

  const indis = gedcom.indis();
  const indiRows: string[][] = [];
  const headerStyle: Partial<ExcelJS.Style> = {
    font: { bold: true },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9E1F2' } },
  };

  if (indis) {
    indis.forEach((indi) => {
      if (!indi) return;
      const key = indi.id as string;
      if (filterKeys && !filterKeys.has(key as never)) return;

      indiRows.push([
        key,
        indi.toName() ?? '',
        indi.get<Common>('SEX')?.toValue() ?? '',
        indi.getBirthDate() ?? '',
        indi.getBirthPlace() ?? '',
        indi.getDeathDate() ?? '',
        indi.getDeathPlace() ?? '',
      ]);
    });
  }

  const indiHeaders = [
    t('id'),
    t('name'),
    t('sex'),
    t('birth_date'),
    t('birth_place'),
    t('death_date'),
    t('death_place'),
  ];

  if (sheetPerType) {
    addSheet(workbook, t('individuals'), indiHeaders, indiRows, headerStyle);
  } else {
    addSheet(workbook, t('individuals'), indiHeaders, indiRows, headerStyle);
  }

  const fams = gedcom.fams();
  const famRows: string[][] = [];
  const famHeaders = [
    t('id'),
    t('husband'),
    t('wife'),
    t('marriage_date'),
    t('marriage_place'),
    t('children_count'),
  ];

  if (fams) {
    fams.forEach((fam) => {
      if (!fam) return;
      const husband = fam.getHusband()?.first();
      const wife = fam.getWife()?.first();
      const children = fam.getChildren();

      famRows.push([
        fam.id as string,
        husband ? (husband.toName() ?? '') : '',
        wife ? (wife.toName() ?? '') : '',
        fam.get<Common>('MARR')?.get<Common>('DATE')?.toValue() ?? '',
        fam.get<Common>('MARR')?.get<Common>('PLAC')?.toValue() ?? '',
        String(children?.length ?? 0),
      ]);
    });
  }

  if (sheetPerType) {
    addSheet(workbook, t('families'), famHeaders, famRows, headerStyle);
  }

  const arrayBuffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(arrayBuffer);
}

function addSheet(
  workbook: ExcelJS.Workbook,
  name: string,
  headers: string[],
  rows: string[][],
  headerStyle: Partial<ExcelJS.Style>,
): void {
  const sheet = workbook.addWorksheet(name);
  const headerRow = sheet.addRow(headers);
  headerRow.eachCell((cell) => {
    Object.assign(cell, headerStyle);
  });
  for (const row of rows) {
    sheet.addRow(row);
  }
  sheet.columns.forEach((col) => {
    col.width = 20;
  });
}
