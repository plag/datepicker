import React, { Component } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import ArrowSvg from '../date-time/Arrow';
import Button from '../button/Button';
import modalService from './modalService';
// import './CleanModal.sass';

import './Modal.sass'

class CleanModalComponent extends Component {
  static defaultProps = {
    showCloseButton: true,
    showBackButton: false,
  }

  static propTypes = {
    onClose: PropTypes.func,
    onBackClick: PropTypes.func,
    noWrap: PropTypes.bool,
  }

  componentDidMount() {
    modalService.addModal();
  }

  componentWillUnmount() {
    modalService.closeModal();
  }

  renderWrappedModal() {
    return (
      <div className="dialog js-dialog dialog_opened" data-dialog="change_pass">
        {
          this.props.showCloseButton &&
          <div className="button__icon dialog__close js-dialog-close" onClick={ this.props.onClose }>CLOSE
            <ArrowSvg className="dialog__close-i" />
          </div>
        }
        {
          this.props.showBackButton &&
          <Button className="button__icon dialog__back js-dialog-show" data-dialog="send_step1" data-hide="true" onClick={ this.props.onBackClick }>
            <ArrowSvg className="dialog__back-i" />
            <div className="dialog__back-text">BACK</div>
          </Button>
        }
        { this.props.children }
      </div>
    )
  }

  render() {
    return createPortal(
      <div className={ classnames('clean-modal', this.props.className) }>
        {
          this.props.noWrap
            ? this.props.children
            : this.renderWrappedModal()
        }
      </div>,
      document.body);
  }

}

export default CleanModalComponent;
