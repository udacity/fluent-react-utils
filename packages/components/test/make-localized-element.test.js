import React from 'react';
import { Localized } from 'fluent-react/compat';
import { assert, expect } from 'chai';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { formatVars, makeLocalizedElement } from '../src/make-localized-element';

Enzyme.configure({ adapter: new Adapter() });

describe('formatVars', () => {
  it('formats the l10nVars variables for spreading into the Localized', () => {
    const l10nVars = { name: 'Alice', number: 123 };
    const expectedOutput = { $name: 'Alice', $number: 123 };
    expect(formatVars(l10nVars)).to.deep.equal(expectedOutput);
  });
});

describe('makeLocalizedElement', () => {
  it('Makes an element wrapped in a Localized component', () => {
    const Component = makeLocalizedElement('h1');
    const wrapper = shallow(<Component l10nId="test" />);
    const expectedOutput = (
      <Localized id="test">
        <h1 />
      </Localized>
    );
    assert(wrapper.contains(expectedOutput));
  });

  it('Applies the attrs', () => {
    const Component = makeLocalizedElement('img', { alt: true });
    const wrapper = shallow(<Component l10nId="test" />);
    const expectedOutput = (
      <Localized id="test" attrs={{ alt: true }}>
        <img />
      </Localized>
    );
    assert(wrapper.contains(expectedOutput));
  });

  it('Spreads in the l10nVars', () => {
    const Component = makeLocalizedElement('h1');
    const l10nVars = { name: 'Alice', number: 123 };
    const wrapper = shallow(<Component l10nId="test" l10nVars={l10nVars} />);
    const expectedOutput = (
      <Localized id="test" $name="Alice" $number={123}>
        <h1 />
      </Localized>
    );
    assert(wrapper.contains(expectedOutput));
  });

  it('Spreads in the l10nJsx', () => {
    const Component = makeLocalizedElement('h1');
    const l10nJsx = { link: <a href="https://example.com" /> };
    const wrapper = shallow(<Component l10nId="test" l10nJsx={l10nJsx} />);
    const expectedOutput = (
      <Localized id="test" link={<a href="https://example.com" />}>
        <h1 />
      </Localized>
    );
    assert(wrapper.contains(expectedOutput));
  });

  it('Applies the other props to the child', () => {
    const Component = makeLocalizedElement('h1');
    const input = (
      <Component l10nId="test" className="title_header">
        child text
      </Component>
    );
    const wrapper = shallow(input);
    const expectedOutput = (
      <Localized id="test">
        <h1 className="title_header">child text</h1>
      </Localized>
    );
    assert(wrapper.contains(expectedOutput));
  });
});
