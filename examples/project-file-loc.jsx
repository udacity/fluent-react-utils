import React from 'react';
import { Link } from 'react-router';
import { signOut } from 'utils';
import warningImg from 'assets/images';
import { Loc } from '../src';

export function NotAuthorized() {
  return (
    <div className="container">
      <Loc.H1 l10nId="NotAuthorized_oopsMessage">
        Oops! looks like you are not authorized to use this app.
      </Loc.H1>
      <Loc.Img l10nId="NotAuthorized_warningImg" alt="warning sign" src={warningImg} />
      <Loc.P
        l10nId="NotAuthorized_possibleActions"
        l10nJsx={{
          link: <Link to="/" />,
          a: <a href="https://www.udacity.com" />,
          button: <button onClick={signOut} />
        }}
      >
        {'<link>Try again</link>, go <a>Home</a> or <button>Logout</button>'}
      </Loc.P>
    </div>
  );
}
