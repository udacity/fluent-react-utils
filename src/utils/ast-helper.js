import { parse, serialize, FluentSerializer } from 'fluent-syntax';
import { getProp, elementType as _elementType, hasProp } from 'jsx-ast-utils';
import { AST_NODE_TYPES, FLUENT_ATTRS, STANDARD_ELEMENT_TYPES } from './constants';

const {
  JSXElement,
  JSXText,
  JSXExpressionContainer,
  JSXEmptyExpression,
  StringLiteral
} = AST_NODE_TYPES;

const { attrs, l10nId } = FLUENT_ATTRS;

function isShorthand(elementType, shorthandName = 'Loc') {
  const re = new RegExp(`${shorthandName}\\.[A-Z]`);
  return re.test(elementType);
}

function getLocalizationKey(localizedNode = {}, identifier = 'id') {
  const prop = getProp(localizedNode.openingElement.attributes, identifier);
  return prop.value.value;
}

function findChildNode(localizedNode = {}) {
  return localizedNode.children.find(child => child.type === JSXElement);
}

function getExpressionNodes(children = []) {
  return children.filter(child => child.type === JSXExpressionContainer);
}

function isNonEmptyText(node) {
  return node.type === JSXText && /\w/.test(node.value);
}

function getLiteralNodes(children = []) {
  return children.filter(isNonEmptyText);
}

function getComments(node = {}) {
  const expressionNodes = getExpressionNodes(node.children);
  const commentNodes = expressionNodes.filter(n => n.expression.type === JSXEmptyExpression);
  return commentNodes.map(n => n.expression.innerComments[0].value.trim());
}

function getMessages(node) {
  const literalNodes = getLiteralNodes(node.children);
  if (!literalNodes.length) {
    return literalNodes.map(literalNode => literalNode.value);
  }
  const expressionNodes = getExpressionNodes(node.children);
  const stringNodes = expressionNodes.filter(n => n.expression.type === StringLiteral);
  return stringNodes.map(stringNode => stringNode.expression.value);
}

function getAttributesList(node) {
  const attributes = getProp(node.openingElement.attributes, attrs);
  const l10nAttrs = attributes.value.expression.properties;
  return l10nAttrs.map(attr => attr.key.name);
}

function getAllowedAttrs(elementType) {
  let elemName = elementType.split('.')[1];
  elemName = elemName.toLowerCase();
  const elements = STANDARD_ELEMENT_TYPES;
  return elements[elemName].map((isAllowed, name) => (isAllowed ? name : ''));
}

function pullLocalizedDOMAttributes(node, l10nAttrsList) {
  if (!l10nAttrsList || l10nAttrsList.length === 0) {
    return '';
  }
  const { attributes } = node.openingElement;
  const l10nAttributes = attributes.filter(att => l10nAttrsList.includes(att.name.name));
  return l10nAttributes.reduce((ftlRules, attribute) => {
    const propName = attribute.name.name;
    const message = attribute.value.value;
    return `${ftlRules}
    .${propName} = ${message}`;
  }, '');
}

function formatMessage({
  messages, comments, attributes, componentType, localizationKey
}) {
  const message = messages.join('\n    ');
  const comment = comments.join('\n# ');
  if (!message && !attributes) {
    const error = `STRING_IMPORT_ERROR:
     - no translated props or message provided to ${componentType}
     - pass in a non-empty translatable message as a child or applicable attributes
     - check the component with the localization ID "${localizationKey}"
`;
    console.error(error);
    return { message: error };
  }
  return {
    message: message.trim,
    comment: comment.trim,
    attributes: attributes.trim
  };
}

function findShorthandTranslatableMessages(node, localizationKey) {
  const componentType = _elementType(node.openingElement);
  const l10nAttrsList = getAllowedAttrs(componentType);
  const attributes = pullLocalizedDOMAttributes(node, l10nAttrsList);
  const comments = getComments(node);
  const messages = getMessages(node);
  return formatMessage({
    messages,
    comments,
    attributes,
    componentType,
    localizationKey
  });
}

function findTranslatableMessages(node, localizationKey) {
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

function formatRule({
  localizationKey, comment, message, attributes
}) {
  const commentRule = comment ? `# ${comment}` : '';
  const attributeRule = attributes ? `    ${attributes}` : '';
  return `${commentRule}\n${localizationKey} = ${message}\n${attributeRule}`;
}

function getShorthandMessages(node) {
  const localizationKey = getLocalizationKey(node, l10nId);
  const { message, comment, attributes } = findShorthandTranslatableMessages(node, localizationKey);
  return formatRule({
    localizationKey,
    comment,
    message,
    attributes
  });
}

function getLocalizedMessages(node) {
  const localizationKey = getLocalizationKey(node);
  const { message, comment, attributes } = findTranslatableMessages(node, localizationKey);
  return formatRule({
    localizationKey,
    comment,
    message,
    attributes
  });
}

function compileFtlMessages(node) {
  const elementType = _elementType(node.openingElement);
  if (isShorthand(elementType)) {
    return getShorthandMessages(node);
  }
  if (!/Localized/.test(elementType)) {
    return '';
  }
  return getLocalizedMessages(node);
}

function dedupe(resource) {
  const serializer = new FluentSerializer();
  const entryList = resource.body;
  const hash = entryList.reduce((obj, entry) => {
    const localizationKey = entry.id.name;
    let list = [entry];
    if (obj[localizationKey]) {
      list = [...obj[localizationKey], entry];
    }

    return Object.assign(obj, { [localizationKey]: list });
  }, {});

  const deduped = hash.map((list, localizationKey) => {
    if (list.length !== 1) {
      const values = new Set(list.map(serializer.serializeEntry));
      if (values.size > 1) {
        console.warn(`localization key ${localizationKey} is used multiple times and has values
${values}`);
      }
    }
    return list[0];
  });
  return Object.assign(resource, { body: deduped });
}

function clean(ftlRules) {
  // uses fluent-syntax to parse and then serialize the strings to ensure they
  // are properly formatted
  const resource = parse(ftlRules);

  const uniqueMessages = dedupe(resource);

  return serialize(uniqueMessages);
}

export default {
  compileFtlMessages,
  clean
};
