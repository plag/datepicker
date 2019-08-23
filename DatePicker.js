import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import DateTime, { DATE_FORMAT } from './DateTime';

export default class DateStatePicker extends Component {

  static defaultProps = {
    options: {},
    value: '',
  };

  static propTypes = {
    options: PropTypes.object,
    openOnMount: PropTypes.bool,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    clearable: PropTypes.bool,
    highMode: PropTypes.oneOf(['months', 'years']),
  };

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  render() {
    const classNames = classnames('datepicker', this.props.className, { 'is-error': this.props.isValid === false });

    const { startDate, endDate, placeholder } = this.props.options;

    return (
      <div className={ classNames }>
        <div className="input" data-input-name={ this.props.name }>
          <DateTime
            canSelectFromDate={ startDate }
            canSelectToDate={ endDate }
            onChange={ this.handleChange }
            value={ this.props.value }
            clearable={ this.props.clearable }
            openOnMount={ this.props.openOnMount }
            highMode={ this.props.highMode }
            placeholder={ placeholder }
          />
          <i className="icon icon-calendar"></i>
        </div>
      </div>
    );
  }

  handleChange(value) {
    this.props.onChange(value ? value.format(DATE_FORMAT) : null, this.props.name);
  }
}
