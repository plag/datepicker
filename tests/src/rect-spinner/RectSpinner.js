import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './RectSpinner.sass';

export default class RectSpinner extends React.Component {

  static componentClassName = 'rect-spinner';

  static propTypes = {
    inline: PropTypes.bool,
    small: PropTypes.bool,
    xsmall: PropTypes.bool,
    style: PropTypes.object,
  };

  static defaultProps = {
    style: {},
  };

  render() {
    const componentClassName = classNames(RectSpinner.componentClassName,
      {
        'small': this.props.small,
        'xsmall': this.props.xsmall,
      },
      this.props.className);

    let resultStyle = this.props.style;

    if (this.props.inline) {
      resultStyle = Object.assign({}, {
        display: 'inline-block',
        marginLeft: 10,
      }, resultStyle);
    }

    return (
      <div className={ componentClassName } style={ resultStyle }>
        <div className="rect1"></div>
        <div className="rect2"></div>
        <div className="rect3"></div>
        <div className="rect4"></div>
        <div className="rect5"></div>
      </div>
    );
  }
}
