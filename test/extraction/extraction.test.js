import { expect } from 'chai';
import { getSourceStrings } from '../../src/extraction';

const expectedOutput = `# here is a comment
NotAuthorized_oopsMessage = Oops! looks like you are not authorized to use this app.

NotAuthorized_warningImg = 
    .alt = warning sign
NotAuthorized_possibleActions = <link>Try again</link>, go <a>Home</a> or <button>Logout</button>
`;

describe('getSourceStrings', () => {
  it('Builds an ftl format messages list for the standard Localized components', () => {
    const sourceStrings = getSourceStrings({
      filePattern: './examples/project-file-localized.jsx'
    });
    expect(sourceStrings).to.equal(expectedOutput);
  });

  it('Builds an ftl format messages list for the shorthand Loc components', () => {
    const sourceStrings = getSourceStrings({ filePattern: './examples/project-file-loc.jsx' });
    expect(sourceStrings).to.equal(expectedOutput);
  });

  it('Builds an ftl format messages list for the custom shorthand named components', () => {
    const sourceStrings = getSourceStrings({
      filePattern: './examples/project-file-t.jsx',
      shorthandName: 'T'
    });
    expect(sourceStrings).to.equal(expectedOutput);
  });
});
