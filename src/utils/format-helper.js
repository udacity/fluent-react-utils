import { parse, serialize, FluentSerializer } from 'fluent-syntax';

export function getAttributeName(attribute = {}) {
  if (attribute.name) {
    return attribute.name.name;
  }
}

export function getAttributeValue(attribute = {}) {
  if (attribute.value) {
    return attribute.value.value;
  }
}

function getEntryName(entry = {}) {
  if (entry.id) {
    return entry.id.name;
  }
}

export function pullLocalizedDOMAttributes(node, l10nAttrsList) {
  if (!l10nAttrsList || l10nAttrsList.length === 0) {
    return '';
  }
  const { attributes } = node.openingElement;
  const l10nAttributes = attributes.filter(att => l10nAttrsList.includes(getAttributeName(att)));
  return l10nAttributes.reduce((ftlRules, attribute) => {
    const propName = getAttributeName(attribute);
    const message = getAttributeValue(attribute);
    return `${ftlRules}
    .${propName} = ${message}`;
  }, '');
}

export function formatMessage({
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
    message: message.trim(),
    comment: comment.trim(),
    attributes: attributes.trim()
  };
}

export function formatRule({
  localizationKey, comment, message, attributes
}) {
  const commentRule = comment ? `# ${comment}` : '';
  const attributeRule = attributes ? `    ${attributes}` : '';
  return `${commentRule}\n${localizationKey} = ${message}\n${attributeRule}`;
}

export function dedupe(resource) {
  const serializer = new FluentSerializer();
  const entryList = resource.body;
  const hash = entryList.reduce((obj, entry) => {
    const localizationKey = getEntryName(entry);
    let list = [entry];
    if (obj[localizationKey]) {
      list = [...obj[localizationKey], entry];
    }

    return Object.assign(obj, { [localizationKey]: list });
  }, {});

  const l10nKeys = Object.keys(hash);

  const deduped = l10nKeys.map((localizationKey) => {
    const list = hash[localizationKey];
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

export function clean(ftlRules) {
  // uses fluent-syntax to parse and then serialize the strings to ensure they
  // are properly formatted
  const resource = parse(ftlRules);

  const uniqueMessages = dedupe(resource);

  return serialize(uniqueMessages);
}
