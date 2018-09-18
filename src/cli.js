#!/usr/bin/env node
const argv = require('yargs').argv;
const fs = require('fs');

const command = argv._[0];
console.log(argv);
console.log(command);
console.log(process.cwd());

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
      console.log('extracting strings, yes!');
      console.log(rcFile);
    });
    break;
  }

  case 'help': {
    console.log(DOCSTRING);
    break;
  }

  default:
    console.log(`no command ${command}`);
}

