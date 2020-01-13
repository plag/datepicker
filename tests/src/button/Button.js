import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import RectSpinner from '../rect-spinner/RectSpinner';

export default class Button extends Component {
  static propTypes = {
    isLoading: PropTypes.bool,
    isDisabled: PropTypes.bool,
    type: PropTypes.string,
    originalRef: PropTypes.func,
  }

  render() {
    const { isLoading, type, originalRef, isDisabled, ...restProps } = this.props;

    return (
      <button
        className={ classnames('button', { 'button_disabled': isDisabled || isLoading }) }
        disabled={ isLoading || isDisabled }
        type={ type || 'button' }
        ref={ originalRef }
        { ...restProps }
      >
        {
          isLoading && <RectSpinner small />
        }
        {
          !isLoading && this.props.children
        }
      </button>
    );
  }
}
