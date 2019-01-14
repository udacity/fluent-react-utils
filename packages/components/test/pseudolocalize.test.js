import { pseudolocalize } from '../src';

describe('pseudolocalize', () => {
  it.only('should transform a message', () => {
    const expectedOutput = 'Ƥẏŧħǿǿƞ';
    expect(pseudolocalize('Python')).toEqual(expectedOutput);
  });
});

