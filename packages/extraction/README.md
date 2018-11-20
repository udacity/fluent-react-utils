
# Fluent React Extract

Get default messages from your source code so that you don't have to switch
context to manage translatable messages

Uses the [fluent-syntax](https://github.com/projectfluent/fluent.js/tree/master/fluent-syntax) serializer
and [Babel parser](https://github.com/babel/babel/tree/master/packages/babel-parser) to
create an AST for your React code to pull out default messages and format them in
FTL.

### How to Use
```sh
l10n extract [--pattern '...'] [--outputDir '...']
```
This will run through all files matching the file pattern, parse the code into an
AST, locate all the `Localized` or `Loc.X` (`Loc.` is the default, but this can
be customized, see `.l10nrc` information below) helper components and pull the id,
messages, and comments for that component into a fresh `data.ftl` file located
in the specified output directory.

### Example
```jsx
// imports

export function NotAuthorized() {
  return (
    <div className="container">
      <Loc.H1 l10nId="NotAuthorized_oopsMessage">
        {/* here is a comment for the localizer */}
        Oops! looks like you're not authorized to use this app.
      </Loc.H1>
      <Loc.Img
        l10nId="NotAuthorized_warningImg"
        alt="warning sign"
        src={warningImg}
      />
      <Loc.P
        l10nId="NotAuthorized_possibleActions"
        l10nJsx={{
          link: <Link to="/" />,
          a: <a href="https://www.udacity.com" />,
          button: <button onClick={signOut} />
        }}
      >
        {
          '<link>Try again</link>, go <a>Home</a> or <button>Logout</button>'
        }
      </Loc.P>
    </div>
  );
}
```

Running the localization script on this file would result in the `data.ftl` below:
```
# here is a comment for the localizer
NotAuthorized_oopsMessage = Oops! looks like you're not authorized to use this app.
NotAuthorized_warningImg = 
  .alt = warning sign
NotAuthorized_possibleActions = <link>Try again</link>, go <a>Home</a> or <button>Logout</button>
```

*NOTE*: adding comments along with the children of a component will extract this
out as a comment to the localizer. This can be helpful for leaving tips about
context of the message to make translation easier.

## .l10nrc File
In order to run the extraction based on your project's custom needs, a `.l10nrc` 
file is supported. Possible values of this file:

### `customElementsPath` 
If you use the custom elements as described above, if they include any attributes
(i.e. `label` on the `MyButton` component), they need to be included to tell the
extraction scripts which attributes to look for. The format for this is a json object
with the component names as keys, and an object of their allowed (or explicitly
disallowed) attributes. For example:

```json
// custom-elements.json
{
  "MyButton": {"label": true}
}
```
It is recommended that this record of custom element attributes is held in a json
file that is pulled into any file defining the `attrs` of that element in the React
code.
```js
import {augmentLoc, makeLocalizedElement} from 'fluent-react-utils';
import customAttrs from './custom-elements.json';

const customElements = {
  MyButton: makeLocalizedElement(MyButton, customAttrs.MyButton)
};

export const Loc = augmentLoc(customElements);
```

The value for `customElementsPath` is the path to the `custom-elements.json` file
from the project root.

For example:
```json
{
  "customElementsPath": "./src/app/utils/custom-elements.json",
}
```

### `shorthandName`
By default, this is `Loc`, but if your project prefers not to use the same name
as this library's `Loc` utility, you can update this in the `.l10nrc` file.

```js
// my-utils
import {augmentLoc, makeLocalizedElement} from 'fluent-react-utils';
import customAttrs from './custom-elements.json';

const customElements = {
  MyButton: makeLocalizedElement(MyButton, customAttrs.MyButton)
};

export const L = augmentLoc(customElements);

// elsewhere

import {L} from 'my-utils';

...
<L.H1 l10nId="ButtonPage_title">
  Look, a button!
</L.H1>
<L.MyButton
  l10nId="ButtonPage_clickButton"
  label="click me!"
  onClick={handleClick}
/>
```

```json
{
  "shorthandName": "L",
}
```

### `filePattern`
In case your project always extracts the same file pattern, this can be defined
in `.l10nrc` as opposed to passing it into the cli every time.
```json
{
  "filePattern": "./src/app/**/*.{js,jsx}",
}
```

### `outputDir`
The location you want the string extraction script to write its results.
```json
{
  "outputDir": "./public/locales/new-strings/",
}
```

# Future Work:
- Message deduplication with interface
  - decide which message to keep, or to create a new l10nId and write back to file
- Compare string extraction output with production files
  - provide no reference warnings (may indicate obsolete string)
