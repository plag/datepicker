import React, { Component } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import ArrowSvg from '../date-time/Arrow';
import Button from '../button/Button';
// import './CleanModal.sass';

const FOCUSABLE_ELEMENTS = [
  'a[href]',
  'area[href]',
  'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
  'select:not([disabled]):not([aria-hidden])',
  'textarea:not([disabled]):not([aria-hidden])',
  'button:not([disabled]):not([aria-hidden])',
  'iframe',
  'object',
  'embed',
  '[contenteditable]',
  '[tabindex]:not([tabindex^="-"])',
];

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

  constructor(props) {
    super(props);

    this.modalRef = React.createRef();
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onKeydown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeydown);
  }

  onKeydown = (e) => {
    if (e.keyCode === 9) {
      this.maintainFocus(e);
    }
  }

  getFocusableNodes = () => {
    const nodes = this.modalRef.current.querySelectorAll(FOCUSABLE_ELEMENTS);
    return Array(...nodes);
  }

  maintainFocus (event) {
    const focusableNodes = this.getFocusableNodes();

    // if disableFocus is true
    if (!this.modalRef.current.contains(document.activeElement)) {
      focusableNodes[0].focus();
    } else {
      const focusedItemIndex = focusableNodes.indexOf(document.activeElement);

      if (event.shiftKey && focusedItemIndex === 0) {
        focusableNodes[focusableNodes.length - 1].focus();
        event.preventDefault();
      }

      if (!event.shiftKey && focusedItemIndex === focusableNodes.length - 1) {
        focusableNodes[0].focus();
        event.preventDefault();
      }
    }
  }

  renderWrappedModal() {
    return (
      <div className="dialog js-dialog dialog_opened" data-dialog="change_pass">
        {
          this.props.showCloseButton &&
          <Button className="button__icon dialog__close js-dialog-close" onClick={ this.props.onClose }>
            <div className="dialog__back-text">CLOSE</div>
            <div className="dialog__close-i-container">
              <ArrowSvg className="dialog__close-i" />
            </div>
          </Button>
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
      <div className={ classnames('clean-modal', this.props.className) } ref={ this.modalRef }>
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
