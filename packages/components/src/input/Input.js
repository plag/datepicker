import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Measure from 'react-measure';

function getParentFieldBlock(element) {
  if (element.parentNode.classList.contains('field__block')) {
    return element.parentNode;
  }

  return element.parentNode.parentNode; // max second level
}

export default class Input extends Component {
  state = {
    prefixWidth: 0,
  }

  static propTypes = {
    prefix: PropTypes.string,
    postfix: PropTypes.string,
    onChange: PropTypes.func,
    focusOnMount: PropTypes.bool,
    disabled: PropTypes.bool,
    name: PropTypes.string,
    isValid: PropTypes.bool,
    style: PropTypes.object,
    value: PropTypes.string,
    inputRef: PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.inputRef = React.createRef();
  }

  componentDidMount() {
    if (!this.props.disabled && this.props.focusOnMount) {
      if (this.props.inputRef) {
        this.props.inputRef.current.focus();
      } else {
        this.inputRef.current.focus();
      }
    }
  }


  handleChange = (e) => {
    if (!this.props.onChange) {
      return;
    }

    this.props.onChange(e.target.value, this.props.name);
  }

  handleFocus = (e) => {
    getParentFieldBlock(e.target).classList.add('field_focus');
    this.props.onFocus && this.props.onFocus(e);
  }

  handleBlur = (e) => {
    getParentFieldBlock(e.target).classList.remove('field_focus');
    this.props.onBlur && this.props.onBlur(e);
  }

  render() {
    const { prefix, onChange, value, isValid, name, inputRef, focusOnMount, onBlur, onFocus, ...restProps } = this.props;

    // warning! `name` not needed, use FormField wrapper instead

    const input = <input
      className={ classnames('field', {
        'is-error': isValid === false,
      }) }
      type="text"
      onChange={ this.handleChange }
      onFocus={ this.handleFocus }
      onBlur={ this.handleBlur }
      value={ value || '' }
      data-input-name={ this.props.name }
      style={ {
        paddingLeft: this.state.prefixWidth ? parseInt(this.state.prefixWidth + 15, 10) + 'px' : null,
        paddingRight: this.state.postfixWitdh ? parseInt(this.state.postfixWitdh + 15, 10) + 'px' : null,
        ...this.props.style,
      } }
      ref={ inputRef || this.inputRef }
      { ...restProps }
    />;

    if (!this.props.prefix && !this.props.postfix) {
      return input;
    }

    return (
      <div className="input-with-prefix">
        {
          this.props.prefix &&
          <Measure
            bounds
            onResize={ (contentRect) => {
              this.setState({ prefixWidth: contentRect.bounds.width });
            } }
          >
            { ({ measureRef }) =>
              <span ref={ measureRef } className="input-prefix">{ this.props.prefix }</span>
            }
          </Measure>
        }
        { input }
        {
          this.props.postfix &&
          <Measure
            bounds
            onResize={ (contentRect) => {
              this.setState({ postfixWitdh: contentRect.bounds.width });
            } }
          >
            { ({ measureRef }) =>
              <span ref={ measureRef } className="input-postfix">{ this.props.postfix }</span>
            }
          </Measure>
        }
      </div>
    );
  }
}
