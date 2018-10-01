import { assert, expect } from 'chai';
import { formatVars } from '../../src/components/make-localized-element';

describe('formatVars', () => {
  it('formats the l10nVars variables for spreading into the Localized', () => {
    const l10nVars = {name: 'Alice', number: 123};
    const expectedOutput = { $name: 'Alice', $number: 123 };
    expect(formatVars(l10nVars)).to.deep.equal(expectedOutput);
  });
});
