import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  WidthType,
} from 'docx';
import type { Common } from '@treeviz/gedcom-parser';
import type { ConvertInput, DocxConvertOptions } from '../types/index.js';
import { resolveInput, t } from '../utils/index.js';

/**
 * Convert GEDCOM data to a Word document buffer (.docx).
 *
 * @param input - Raw GEDCOM string or parsed GedComType object.
 * @param options - Optional conversion options.
 * @returns Buffer containing the .docx file.
 */
export async function convertToDocx(
  input: ConvertInput,
  options: DocxConvertOptions = {},
): Promise<Buffer> {
  const gedcom = resolveInput(input);
  const filterKeys = options.filter ? new Set(options.filter) : null;
  const sections: Paragraph[] = [];

  const indis = gedcom.indis();

  if (indis) {
    indis.forEach((indi) => {
      if (!indi) return;
      const key = indi.id as string;
      if (filterKeys && !filterKeys.has(key as never)) return;

      const name = indi.toName() ?? key;
      const sex = indi.get<Common>('SEX')?.toValue() ?? '';
      const birthDate = indi.getBirthDate() ?? '';
      const birthPlace = indi.getBirthPlace() ?? '';
      const deathDate = indi.getDeathDate() ?? '';
      const deathPlace = indi.getDeathPlace() ?? '';

      sections.push(
        new Paragraph({
          text: name,
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
        }),
      );

      const rows: [string, string][] = [
        [t('id'), key],
        [t('sex'), sex],
      ];

      if (birthDate || birthPlace) {
        rows.push([t('birth'), [birthDate, birthPlace].filter(Boolean).join(' – ')]);
      }
      if (deathDate || deathPlace) {
        rows.push([t('death'), [deathDate, deathPlace].filter(Boolean).join(' – ')]);
      }

      const tableRows = rows.map(
        ([label, value]) =>
          new TableRow({
            children: [
              new TableCell({
                children: [
                  new Paragraph({
                    children: [new TextRun({ text: label, bold: true })],
                  }),
                ],
                width: { size: 30, type: WidthType.PERCENTAGE },
                borders: tableBorders(),
              }),
              new TableCell({
                children: [new Paragraph({ text: value })],
                width: { size: 70, type: WidthType.PERCENTAGE },
                borders: tableBorders(),
              }),
            ],
          }),
      );

      sections.push(
        new Paragraph({ children: [] }),
      );

      if (tableRows.length > 0) {
        const table = new Table({
          rows: tableRows,
          width: { size: 100, type: WidthType.PERCENTAGE },
        });
        sections.push(table as unknown as Paragraph);
      }
    });
  }

  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            text: t('family_tree'),
            heading: HeadingLevel.HEADING_1,
          }),
          ...sections,
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  return buffer;
}

function tableBorders() {
  const border = { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' };
  return { top: border, bottom: border, left: border, right: border };
}
