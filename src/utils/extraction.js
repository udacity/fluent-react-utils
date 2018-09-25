const fs = require('fs');
const glob = require('glob');
const walk = require('babylon-walk');
const { parse } = require('@babel/parser');
const { compileFtlMessages } = require('./ast-helper');

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
  walk.simple(ast, {
    JSXElement: (node) => {
      ftlRules += compileFtlMessages(node, opts);
    }
  });
  return ftlRules;
}

export function getSourceStrings({ filePattern, shorthandName, customElements }) {
  return glob
    .sync(filePattern)
    .map(filename => fs.readFileSync(filename, 'utf8'))
    .map(file => parseForFtl(file, { shorthandName, customElements }))
    .reduce((collection, messages) => collection + messages, '');
}
