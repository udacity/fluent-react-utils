import { assert, expect } from 'chai';
import { MyComponent } from '../../examples/components';
import { augmentLoc, Loc } from '../../src/components/Loc';
import { makeLocalizedElement } from '../../lib/components/make-localized-element';

describe('augmentLoc', () => {
  it('Augments the Loc object with a custom element', () => {
    const existingTypes = new Set(Object.keys(Loc));
    const MyLocalizedComponent = makeLocalizedElement(MyComponent, { label: true });
    const newLoc = augmentLoc({ MyLocalizedComponent });
    const newTypes = new Set(Object.keys(newLoc));
    expect(newTypes.size).to.equal(existingTypes.size + 1, 'Component not added');
    assert(newTypes.has('MyLocalizedComponent'), 'New component not in keys');
    expect(newLoc.MyLocalizedComponent).to.deep.equal(
      MyLocalizedComponent,
      'newLoc value not expected'
    );
  });
});
