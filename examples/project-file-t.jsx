import React from 'react';
import { Link } from 'react-router';
import { signOut, T } from 'utils';
import warningImg from 'assets/images';

export function NotAuthorized() {
  return (
    <div className="container">
      <T.H1 l10nId="NotAuthorized_oopsMessage">
        Oops! looks like you are not authorized to use this app.
      </T.H1>
      <T.Img l10nId="NotAuthorized_warningImg" alt="warning sign" src={warningImg} />
      <T.P
        l10nId="NotAuthorized_possibleActions"
        l10nJsx={{
          link: <Link to="/" />,
          a: <a href="https://www.udacity.com" />,
          button: <button onClick={signOut} />
        }}
      >
        {'<link>Try again</link>, go <a>Home</a> or <button>Logout</button>'}
      </T.P>
    </div>
  );
}
