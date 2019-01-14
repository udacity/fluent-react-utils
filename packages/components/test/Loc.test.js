import { MyComponent } from '../examples/components';
import { augmentLoc, Loc } from '../src/Loc';
import { makeLocalizedElement } from '../src/make-localized-element';

describe('augmentLoc', () => {
  it('Augments the Loc object with a custom element', () => {
    const existingTypes = new Set(Object.keys(Loc));
    const MyLocalizedComponent = makeLocalizedElement(MyComponent, { label: true });
    const newLoc = augmentLoc({ MyLocalizedComponent });
    const newTypes = new Set(Object.keys(newLoc));
    expect(newTypes.size).toEqual(existingTypes.size + 1);
    expect(newTypes).toContain('MyLocalizedComponent');
    expect(newLoc.MyLocalizedComponent).toEqual(
      MyLocalizedComponent,
      'newLoc value not expected'
    );
  });
});
