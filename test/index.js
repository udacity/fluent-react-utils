import { assert } from 'chai';
import { pseudolocalize } from '../lib';

describe('pseudolocalize', () => {
  it('should transform a message', () => {
    const expectedOutput = 'Ƥẏŧħǿǿƞ';
    assert(pseudolocalize('Python') === expectedOutput, 'woops');
  });
});
