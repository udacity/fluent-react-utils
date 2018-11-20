import React from 'react';
import { Localized } from 'fluent-react/compat';
import { Link } from 'react-router';
import { signOut } from 'utils';
import warningImg from 'assets/images';

export function NotAuthorized() {
  return (
    <div className="container">
      <Localized id="NotAuthorized_oopsMessage">
        <h1>
          {/* here is a comment */}
          Oops! looks like you are not authorized to use this app.
        </h1>
      </Localized>
      <Localized id="NotAuthorized_warningImg" attrs={{ alt: true }}>
        <img src={warningImg} alt="warning sign" />
      </Localized>
      <Localized
        id="NotAuthorized_possibleActions"
        link={<Link to="/" />}
        a={<a href="https://www.udacity.com" />}
        button={<button onClick={() => signOut()} />}
      >
        <p>{'<link>Try again</link>, go <a>Home</a> or <button>Logout</button>'}</p>
      </Localized>
    </div>
  );
}
