import fs from 'fs';
import glob from 'glob';
import {simple} from 'babylon-walk';
import {parse} from '@babel/parser';
import {compileFtlMessages} from './ast-helper';

export function parseForFtl(code, opts) {
  let ftlRules = '';
  const ast = parse(code, {
    sourceType: 'module',
    plugins: [
      'jsx',
      'decorators-legacy',
      'classProperties',
      'objectRestSpread',
      'exportDefaultFrom'
    ]
  });
  simple(ast, {
    JSXElement: (node) => {
      ftlRules += compileFtlMessages(node, opts);
    }
  });
  return ftlRules;
}

export function getSourceStrings({filePattern, shorthandName, customElements}) {
  return glob
    .sync(filePattern)
    .map((filename) => fs.readFileSync(filename, 'utf8'))
    .map((file) => parseForFtl(file, {shorthandName, customElements}))
    .reduce((collection, messages) => collection + messages, '');
}
