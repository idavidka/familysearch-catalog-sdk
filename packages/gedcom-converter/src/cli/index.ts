import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, extname, basename } from 'node:path';
import { Command } from 'commander';
import chalk from 'chalk';
import {
  convertToGedcom,
  convertToJson,
  convertToExcel,
  convertToCsv,
  convertToDocx,
  convertToPdf,
  convertToCard,
  convertToSvg,
} from '../converters/index.js';
import type { IndiKey } from '../types/index.js';
import { setConverterSettings } from '../factories/state-factory.js';

type SupportedFormat = 'gedcom' | 'json' | 'excel' | 'csv' | 'docx' | 'pdf' | 'card' | 'svg';

const FORMAT_EXTENSIONS: Record<SupportedFormat, string> = {
  gedcom: '.ged',
  json: '.json',
  excel: '.xlsx',
  csv: '.csv',
  docx: '.docx',
  pdf: '.pdf',
  card: '.vcf',
  svg: '.svg',
};

const SUPPORTED_FORMATS = Object.keys(FORMAT_EXTENSIONS) as SupportedFormat[];

export function createCli(): Command {
  const program = new Command();

  program
    .name('gedcom-convert')
    .description('Convert GEDCOM files to various output formats')
    .version('1.0.0');

  program
    .argument('<input>', 'Path to the input GEDCOM file (.ged)')
    .requiredOption('-f, --format <format>', `Output format (${SUPPORTED_FORMATS.join(', ')})`)
    .option('-o, --out <path>', 'Output file path (defaults to <input>.<ext>)')
    .option('--filter <ids>', 'Comma-separated list of individual IDs to include')
    .option('--pretty', 'Pretty-print JSON output', false)
    .option('--generations <n>', 'Number of ancestor generations for SVG chart', '4')
    .option('--locale <lang>', 'Language/locale for labels (e.g. en, hu)', 'en')
    .option('--include-private', 'Include living/private individuals', false)
    .option('-q, --quiet', 'Suppress progress output', false)
    .action(async (inputPath: string, opts: Record<string, unknown>) => {
      const format = opts['format'] as string;
      const outPath = opts['out'] as string | undefined;
      const filterRaw = opts['filter'] as string | undefined;
      const pretty = Boolean(opts['pretty']);
      const generations = parseInt(opts['generations'] as string, 10);
      const locale = opts['locale'] as string;
      const includePrivate = Boolean(opts['includePrivate']);
      const quiet = Boolean(opts['quiet']);

      const log = (...args: unknown[]) => {
        if (!quiet) console.log(...args);
      };

      if (!SUPPORTED_FORMATS.includes(format as SupportedFormat)) {
        console.error(
          chalk.red(`Error: unsupported format "${format}". Supported formats: ${SUPPORTED_FORMATS.join(', ')}`),
        );
        process.exit(4);
      }

      const typedFormat = format as SupportedFormat;
      const filter = filterRaw
        ? (filterRaw.split(',').map((id) => id.trim()) as IndiKey[])
        : undefined;

      setConverterSettings({ locale, includePrivate });

      let rawContent: string;
      try {
        const absInput = resolve(inputPath);
        rawContent = readFileSync(absInput, 'utf-8');
        log(chalk.gray(`Reading: ${absInput}`));
      } catch {
        console.error(chalk.red(`Error: cannot read input file "${inputPath}"`));
        process.exit(1);
      }

      log(chalk.gray(`Converting to ${typedFormat}...`));

      let result: Buffer | string;
      try {
        const baseOptions = { filter, includePrivate, locale };
        switch (typedFormat) {
          case 'gedcom':
            result = await convertToGedcom(rawContent, baseOptions);
            break;
          case 'json':
            result = await convertToJson(rawContent, { ...baseOptions, pretty });
            break;
          case 'excel':
            result = await convertToExcel(rawContent, baseOptions);
            break;
          case 'csv':
            result = await convertToCsv(rawContent, baseOptions);
            break;
          case 'docx':
            result = await convertToDocx(rawContent, baseOptions);
            break;
          case 'pdf':
            result = await convertToPdf(rawContent, baseOptions);
            break;
          case 'card':
            result = await convertToCard(rawContent, baseOptions);
            break;
          case 'svg':
            result = await convertToSvg(rawContent, { ...baseOptions, generations });
            break;
        }
      } catch (err) {
        console.error(chalk.red(`Conversion error: ${String(err)}`));
        process.exit(3);
      }

      const ext = FORMAT_EXTENSIONS[typedFormat];
      const defaultOut = basename(inputPath, extname(inputPath)) + ext;
      const outputPath = resolve(outPath ?? defaultOut);

      try {
        if (result instanceof Buffer) {
          writeFileSync(outputPath, result);
        } else {
          writeFileSync(outputPath, result, 'utf-8');
        }
        log(chalk.green(`✓ Written: ${outputPath}`));
      } catch {
        console.error(chalk.red(`Error: cannot write output file "${outputPath}"`));
        process.exit(3);
      }
    });

  return program;
}
