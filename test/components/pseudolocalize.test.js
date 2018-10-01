import { assert } from 'chai';
import { pseudolocalize } from '../../src';

describe('pseudolocalize', () => {
  it('should transform a message', () => {
    const expectedOutput = 'Ƥẏŧħǿǿƞ';
    assert(pseudolocalize('Python') === expectedOutput);
  });
});

