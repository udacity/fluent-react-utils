import { assert } from 'chai';
import fluentReactUtils from '../src';

describe('fluentReactUtils', () => {
  it('has Loc export', () => {
    assert(fluentReactUtils.Loc !== undefined);
  });
  it('has pseudolocalize export', () => {
    assert(fluentReactUtils.pseudolocalize !== undefined);
  });
  it('has makeLocalizedElement export', () => {
    assert(fluentReactUtils.makeLocalizedElement !== undefined);
  });
  it('has augmentLoc export', () => {
    assert(fluentReactUtils.augmentLoc !== undefined);
  });
});
