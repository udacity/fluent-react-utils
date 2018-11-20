import { getProp, elementType as _elementType, hasProp } from 'jsx-ast-utils';
import { AST_NODE_TYPES, FLUENT_ATTRS, STANDARD_ELEMENT_TYPES } from './constants';
import { defaultShorthandName } from './defaults';
import { formatRule, pullLocalizedDOMAttributes, formatMessage } from './format-helper';

const {
  JSXElement,
  JSXText,
  JSXExpressionContainer,
  JSXEmptyExpression,
  StringLiteral
} = AST_NODE_TYPES;

const { attrs, l10nId } = FLUENT_ATTRS;

export function isShorthand(elementType, shorthandName = defaultShorthandName) {
  const re = new RegExp(`${shorthandName}\\.[A-Z]`);
  return re.test(elementType);
}

export function getLocalizationKey(localizedNode = {}, identifier = 'id') {
  const prop = getProp(localizedNode.openingElement.attributes, identifier);
  const localizationKey = prop.value.value;
  if (localizationKey) {
    return localizationKey;
  }
  const { expression } = prop.value;
  const variableName = expression.name;
  if (variableName) {
    console.log(`l10nId assigned a variable name "${variableName}". This message
    cannot be automatically extracted. Please ensure that all possible variations
    of this variable and its messages are added to the ftl file.`);
    return;
  }
  const functionName = expression.callee.name;
  if (functionName) {
    console.log(`l10nId assigned a return value for the function "${functionName}".
    This message cannot be automatically extracted. Please ensure that all possible
    values of this function and its messages are added to the ftl file.`);
  }
}

export function findChildNode(localizedNode = {}) {
  return localizedNode.children.find(child => child.type === JSXElement);
}

export function getExpressionNodes(children = []) {
  return children.filter(child => child.type === JSXExpressionContainer);
}

export function isNonEmptyText(node) {
  return node.type === JSXText && /\w/.test(node.value);
}

export function getLiteralNodes(children = []) {
  return children.filter(isNonEmptyText);
}

export function getComments(node = {}) {
  const expressionNodes = getExpressionNodes(node.children);
  const commentNodes = expressionNodes.filter(n => n.expression.type === JSXEmptyExpression);
  return commentNodes.map(n => n.expression.innerComments[0].value.trim());
}

export function getMessages(node) {
  const literalNodes = getLiteralNodes(node.children);
  if (literalNodes.length) {
    return literalNodes.map(literalNode => literalNode.value);
  }
  const expressionNodes = getExpressionNodes(node.children);
  const stringNodes = expressionNodes.filter(n => n.expression.type === StringLiteral);
  return stringNodes.map(stringNode => stringNode.expression.value);
}

export function getAttributesList(node) {
  const attributes = getProp(node.openingElement.attributes, attrs);
  const l10nAttrs = attributes.value.expression.properties;
  if (l10nAttrs) {
    return l10nAttrs.map(attr => attr.key.name);
  }
  return [];
}

export function getAllowedAttrs(elementType, customElements = {}, messages) {
  const elemName = elementType.split('.')[1];
  const elements = Object.assign({}, STANDARD_ELEMENT_TYPES, customElements);
  const elementAttrs = elements[elemName];
  if (elementAttrs) {
    const attributeNames = Object.keys(elementAttrs);
    return attributeNames.map(name => (elementAttrs[name] ? name : ''));
  }

  if (!messages || messages.length === 0) {
    console.log(`No allowed attributes configured for element type "${elemName}"`);
    console.log('Add this element to the object under "customElementsPath" in the .l10nrc file, or add a fallback value for string extraction.');
  }

  return [];
}

export function findShorthandTranslatableMessages(node, localizationKey, customElements) {
  const componentType = _elementType(node.openingElement);
  const comments = getComments(node);
  const messages = getMessages(node);
  const l10nAttrsList = getAllowedAttrs(componentType, customElements, messages);
  const attributes = pullLocalizedDOMAttributes(node, l10nAttrsList);
  return formatMessage({
    messages,
    comments,
    attributes,
    componentType,
    localizationKey
  });
}

export function findTranslatableMessages(node, localizationKey) {
  const childNode = findChildNode(node);
  let attributes = '';
  if (hasProp(node.openingElement.attributes, attrs)) {
    const l10nAttrsList = getAttributesList(node);
    attributes = pullLocalizedDOMAttributes(childNode, l10nAttrsList);
  }
  const comments = getComments(childNode);
  const messages = getMessages(childNode);
  const componentType = _elementType(childNode.openingElement);
  return formatMessage({
    messages,
    comments,
    attributes,
    componentType,
    localizationKey
  });
}

export function getShorthandMessages(node, customElements) {
  const localizationKey = getLocalizationKey(node, l10nId);
  const { message, comment, attributes } = findShorthandTranslatableMessages(
    node,
    localizationKey,
    customElements
  );
  return formatRule({
    localizationKey,
    comment,
    message,
    attributes
  });
}

export function getLocalizedMessages(node) {
  const localizationKey = getLocalizationKey(node);
  const { message, comment, attributes } = findTranslatableMessages(node, localizationKey);
  return formatRule({
    localizationKey,
    comment,
    message,
    attributes
  });
}

export function compileFtlMessages(node, { shorthandName, customElements }) {
  const elementType = _elementType(node.openingElement);
  if (isShorthand(elementType, shorthandName)) {
    return getShorthandMessages(node, customElements);
  }
  if (!/Localized/.test(elementType)) {
    return '';
  }
  return getLocalizedMessages(node);
}
