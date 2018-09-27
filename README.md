# fluent-react-utils
String extraction and helper components for using [fluent-react](https://github.com/projectfluent/fluent.js/tree/master/fluent-react) in your projects.

```
npm i fluent-react-utils
```

## Helper Components
Basic fluent-react makes use of `Localized` components to wrap jsx components, like this:

```jsx
export function NotAuthorized() {
  return (
    <div className='container'>
      <Localized id='NotAuthorized_oopsMessage'>
        <h1>Oops! looks like you're not authorized to use this app.</h1>
      </Localized>
      <Localized
        id='NotAuthorized_talkToAdmin'
        attrs={{alt: true}}
      >
        <img src={warningImg} alt="warning sign" />
      </Localized>
      <Localized
        id='NotAuthorized_possibleActions'
        link={<Link to='/' />}
        a={<a href='https://www.udacity.com' />}
        button={<button onClick={() => signOut()} />}
      >
        <p>
          {
            '<link>Try again</link>, go <a>Home</a> or <button>Logout</button>'
          }
        </p>
      </Localized>
    </div>
  );
}
```

This makes for a lot of `Localized` components on the page, and can make it hard
to visually scan for specific HTML elements. This package comes with standard HTML
elements already wrapped in `Localized` with their typical `attrs` enabled in the
`Loc` component. This turns the above into:

```jsx
import {Loc} from 'fluent-react-utils';

export function NotAuthorized() {
  return (
    <div className="container">
      <Loc.H1 l10nId="NotAuthorized_oopsMessage">
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

#### Props
In the `Loc` components you have access to three `l10n` props to describe how
this message needs to be translated.

##### l10nId (Required)
The localization key for that message

##### l10nVars
This is a plain object with the message variables as keys. It's only used if the message has a variable to substitute.

```jsx
<Loc.P
  l10nId="welcome"
  l10nVars={{name: 'Alice'}}
>
  {'Welcome, { $name }'}
</Loc.P>
```

##### l10nJsx
A plain object with the element alias as the key and a JSX component as the value.
This is used for any components that are included inline in the message, with the
alias used in HTML-like syntax to wrap the translated message.

```jsx
<Loc.P
  l10nId="homeLink"
  l10nJsx={{
    link: <Link to="/" />
  }}
>
  {
    'Go <link>home</link>'
  }
</Loc.P>
```

### Custom Loc Components
Your project may have components that would be great to include in the `Loc`
object, but which are not standard HTML. Say you have a styled `Button`
component, for example.

```jsx
<Localized id="Button_click" attrs={{label: true}}>
  <MyButton
    label="click me!"
    onClick={handleClick}
  />
</Localized>
```

You can make use of two helpers from fluent-react-utils to quickly wrap a
component in `Localized` and / or add it to the `Loc` object.

#### `makeLocalizedElement(Element[, attrs])`

```js
const MyLocalizedButton = makeLocalizedElement(MyButton, {label: true})
```

`MyLocalizedButton` will now have access to the `l10nId`, `l10nVars`, and
`l10nJsx` props.


#### `augmentLoc(customElements)`
In order for your custom elements to be recognized by the string extraction tool,
they need to be prefixed by `Loc.` (or a custom name of your choice -
see information about the `.l10nrc file).

```js
// my-utils
import {augmentLoc} from 'fluent-react-utils';

const customElements = {
  MyButton: MyLocalizedButton
};

export const Loc = augmentLoc(customElements);

// elsewhere

import {Loc} from 'my-utils';

...
<Loc.H1 l10nId="ButtonPage_title">
  Look, a button!
</Loc.H1>
<Loc.MyButton
  l10nId="ButtonPage_clickButton"
  label="click me!"
  onClick={handleClick}
/>
```

## String Extraction
Get default messages from your source code so that you don't have to switch
context to manage translatable messages

Uses the [fluent-syntax](https://github.com/projectfluent/fluent.js/tree/master/fluent-syntax) serializer
and [Babel parser](https://github.com/babel/babel/tree/master/packages/babel-parser) to
create an AST for your React code to pull out default messages and format them in
FTL.

### How to Use
```sh
l10n extract [--pattern '...'] [--output-dir '...']
```
This will run through all files matching the file pattern, parse the code into an
AST, locate all the `Localized` or `Loc.X` (`Loc.` is the default, but this can
be customized, see .l10nrc information below) helper components and pull the id,
messages, and comments for that component into a fresh `data.ftl` file located
in the specified output directory.

#### Example
```jsx
// imports

export function NotAuthorized() {
  return (
    <div className="container">
      <Loc.H1 l10nId="NotAuthorized_oopsMessage">
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
NotAuthorized_oopsMessage = Oops! looks like you're not authorized to use this app.
NotAuthorized_warningImg = 
  .alt = warning sign
NotAuthorized_possibleActions = <link>Try again</link>, go <a>Home</a> or <button>Logout</button>
```

### .l10nrc File
In order to run the extraction based on your project's custom needs, a .l10nrc 
file is supported. Possible values of this file:

#### `customElementsPath` 
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

#### `shorthandName`
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

#### `filePattern`
In case your project always extracts the same file pattern, this can be defined
in `.l10nrc` as opposed to passing it into the cli every time.
```json
{
  "filePattern": "./src/app/**/*.{js,jsx}",
}
```

#### `outputDir`
The location you want the string extraction script to write its results.
```json
{
  "outputDir": "./public/locales/new-strings/",
}
```

## future work:
- message deduplication with interface
- compare production files, and provide no reference warnings (may indicate obsolete string)
