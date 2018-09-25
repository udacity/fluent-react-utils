#!/usr/bin/env node
import { readFile, writeFileSync } from 'fs';
import { sync } from 'mkdirp';
import { argv } from 'yargs';
import {
  clean,
  defaultOutputDir,
  defaultFilePattern,
  defaultShorthandName,
  getSourceStrings
} from './utils';

const command = argv._[0];

const DOCSTRING = `
Fluent React Utils

Usage:
  l10n --help           Show this Message
  l10n extract          Extract strings from your project react files
`;

switch (command) {
  case 'extract': {
    readFile(`${process.cwd()}/.l10nrc`, 'utf8', (err, data) => {
      if (err) throw new Error(err);
      const rcFile = JSON.parse(data);

      const userOutputDir = rcFile.outputDir;
      const outputDir = userOutputDir || defaultOutputDir;

      const userFilePattern = rcFile.filePattern;
      const userShorthandName = rcFile.shorthandName;
      const userCustomElements = rcFile.customElements;

      const filePattern = userFilePattern || defaultFilePattern;
      const shorthandName = userShorthandName || defaultShorthandName;
      const customElements = userCustomElements;

      const sourceStrings = getSourceStrings({
        filePattern,
        shorthandName,
        customElements
      });
      const cleanedStrings = clean(sourceStrings);

      sync(outputDir);
      writeFileSync(`${outputDir}data.ftl`, cleanedStrings);
    });
    break;
  }

  case 'help': {
    console.log(DOCSTRING);
    break;
  }

  default:
    console.log(`no command ${command}`);
    console.log(DOCSTRING);
}
