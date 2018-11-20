import { makeLocalizedElement } from './make-localized-element';
import { STANDARD_ELEMENT_TYPES } from '../extraction/constants';

export const Loc = {
  A: makeLocalizedElement('a'),
  Div: makeLocalizedElement('div'),
  P: makeLocalizedElement('p'),
  H1: makeLocalizedElement('h1'),
  H2: makeLocalizedElement('h2'),
  H3: makeLocalizedElement('h3'),
  H4: makeLocalizedElement('h4'),
  H5: makeLocalizedElement('h5'),
  H6: makeLocalizedElement('h6'),
  Img: makeLocalizedElement('img', STANDARD_ELEMENT_TYPES.Img),
  Label: makeLocalizedElement('label'),
  Span: makeLocalizedElement('span'),
  Td: makeLocalizedElement('td'),
  Th: makeLocalizedElement('th')
};

export function augmentLoc(customElements) {
  return Object.assign({}, Loc, customElements);
}
