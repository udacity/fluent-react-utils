#!/usr/bin/env node
import { readFile, writeFileSync } from 'fs';
import { sync } from 'mkdirp';
import yargs from 'yargs';
import {
  clean,
  defaultOutputDir,
  defaultFilePattern,
  defaultShorthandName,
  getSourceStrings
} from './extraction';

const DOCSTRING = 'Fluent React Utils';

const { argv } = yargs
  .command('extract', 'Pull strings from files matching filePattern')
  .alias('p', 'pattern')
  .describe('p', 'Matching pattern for files to include in extraction')
  .example(`l10n extract -p '${defaultFilePattern}'`)
  .alias('o', 'outputDir')
  .describe('o', 'Directory where extraction output will be saved')
  .example(`l10n extract -o '${defaultOutputDir}'`)
  .help()
  .version();

const command = argv._[0];

function finish(filePattern, shorthandName, outputDir, customElements = {}) {
  const sourceStrings = getSourceStrings({
    filePattern,
    shorthandName,
    customElements
  });
  const cleanedStrings = clean(sourceStrings);
  sync(outputDir);
  writeFileSync(`${outputDir}data.ftl`, cleanedStrings);
}

switch (command) {
  case 'extract': {
    readFile(`${process.cwd()}/.l10nrc`, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      const rcFile = JSON.parse(data);

      const cliFilePattern = argv.pattern;
      const cliOutputDir = argv.outputDir;

      const outputDir = cliOutputDir || rcFile.outputDir;
      const filePattern = cliFilePattern || rcFile.filePattern;

      if (!filePattern) {
        console.error('No file pattern supplied, please include `--pattern` option or `filePattern` value in .l10nrc');
        process.exit(1);
      }

      if (!outputDir) {
        console.error('No output directory supplied, please include `--outputDir` option or `outputDir` value in .l10nrc');
        process.exit(1);
      }

      const userShorthandName = rcFile.shorthandName;
      const { customElementsPath } = rcFile;

      const shorthandName = userShorthandName || defaultShorthandName;

      if (customElementsPath) {
        readFile(customElementsPath, 'utf8', (err2, data2) => {
          if (err) {
            console.error(err2);
            process.exit(1);
          }
          const customElements = JSON.parse(data2);
          finish(filePattern, shorthandName, outputDir, customElements);
        });
      } else {
        finish(filePattern, shorthandName, outputDir);
      }
    });
    break;
  }

  default:
    console.log(`no command ${command} - see available options with "l10n help"`);
    console.log(DOCSTRING);
}
