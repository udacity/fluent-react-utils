# Fluent React Components

```
npm install fluent-react-components
```

Basic fluent-react makes use of `Localized` components to wrap jsx components, like this:

```jsx
export function NotAuthorized() {
  return (
    <div className='container'>
      <Localized id='NotAuthorized_oopsMessage'>
        <h1>
          {/* here is a comment for the localizer */}
          Oops! looks like you're not authorized to use this app.
        </h1>
      </Localized>
      <Localized
        id='NotAuthorized_warningImg'
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
import {Loc} from 'fluent-react-components';

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

### Props
In the `Loc` components you have access to three `l10n` props to describe how
this message needs to be translated.

#### l10nId (Required)
The localization key for that message

#### l10nVars
This is a plain object with the message variables as keys. It's only used if the message has a variable to substitute.

```jsx
<Loc.P
  l10nId="welcome"
  l10nVars={{name: 'Alice'}}
>
  {'Welcome, { $name }'}
</Loc.P>
```

#### l10nJsx
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

## Custom Loc Components
Your project may have components that would be great to include in the `Loc`
object, but which are not standard HTML. Say you have a styled `MyButton`
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

### `makeLocalizedElement(Element[, attrs])`

```js
const MyLocalizedButton = makeLocalizedElement(MyButton, {label: true})
```

`MyLocalizedButton` will now have access to the `l10nId`, `l10nVars`, and
`l10nJsx` props.


### `augmentLoc(customElements)`
In order for your custom elements to be recognized by the string extraction tool,
they need to be prefixed by `Loc.` (or a custom name of your choice -
see information about the `.l10nrc` file).

```js
// my-utils
import {augmentLoc} from 'fluent-react-components';

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