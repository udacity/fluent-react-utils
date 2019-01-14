import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { formatVars, makeLocalizedElement } from '../src/make-localized-element';

Enzyme.configure({ adapter: new Adapter() });

describe('formatVars', () => {
  it('formats the l10nVars variables for spreading into the Localized', () => {
    const l10nVars = { name: 'Alice', number: 123 };
    const expectedOutput = { $name: 'Alice', $number: 123 };
    expect(formatVars(l10nVars)).toEqual(expectedOutput);
  });
});

describe('makeLocalizedElement', () => {
  it('Makes an element wrapped in a Localized component', () => {
    const Component = makeLocalizedElement('h1');
    const wrapper = shallow(<Component l10nId="test" />);
    expect(wrapper).toMatchSnapshot();
  });

  it('Applies the attrs', () => {
    const Component = makeLocalizedElement('img', { alt: true });
    const wrapper = shallow(<Component l10nId="test" />);
    expect(wrapper).toMatchSnapshot();
  });

  it('Spreads in the l10nVars', () => {
    const Component = makeLocalizedElement('h1');
    const l10nVars = { name: 'Alice', number: 123 };
    const wrapper = shallow(<Component l10nId="test" l10nVars={l10nVars} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('Spreads in the l10nJsx', () => {
    const Component = makeLocalizedElement('h1');
    const l10nJsx = { link: <a href="https://example.com" /> };
    const wrapper = shallow(<Component l10nId="test" l10nJsx={l10nJsx} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('Applies the other props to the child', () => {
    const Component = makeLocalizedElement('h1');
    const input = (
      <Component l10nId="test" className="title_header">
        child text
      </Component>
    );
    const wrapper = shallow(input);
    expect(wrapper).toMatchSnapshot();
  });
});
