#!/usr/bin/env node
const fs = require('fs');
const mkdirp = require('mkdirp');
const { argv } = require('yargs');
const { clean } = require('./utils/ast-helper');
const { getSourceStrings } = require('./utils/extraction');
const { defaultOutputDir, defaultFilePattern, defaultShorthandName } = require('./utils/defaults');

const command = argv._[0];

const DOCSTRING = `
Fluent React Utils

Usage:
  l10n --help           Show this Message
  l10n extract          Extract strings from your project react files
`;

switch (command) {
  case 'extract': {
    fs.readFile(`${process.cwd()}/.l10nrc`, 'utf8', (err, data) => {
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

      const sourceStrings = getSourceStrings({ filePattern, shorthandName, customElements });
      const cleanedStrings = clean(sourceStrings);

      mkdirp.sync(outputDir);
      fs.writeFileSync(`${outputDir}data.ftl`, cleanedStrings);
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
