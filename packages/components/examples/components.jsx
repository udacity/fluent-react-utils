import React from 'react';
import PropTypes from 'prop-types';

export function MyComponent(props) {
  return (
    <div>
      <h1>Widget for {props.label}</h1>
      <img src={props.imageSrc} alt={props.label} />
    </div>
  );
}

MyComponent.propTypes = {
  label: PropTypes.string.isRequired,
  imageSrc: PropTypes.string.isRequired
};
