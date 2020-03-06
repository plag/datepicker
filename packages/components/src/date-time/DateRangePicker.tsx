import React, { Component, ReactNode } from 'react';
import classnames from 'classnames';
import {
  format,
  max,
  startOfWeek,
} from 'date-fns';

import DateRangePickerHorizontal from './DateRangePickerHorizontal';
import DateRangePickerVertical from './DateRangePickerVertical';
import DateRangePresets, { getPresetLabel } from './DateRangePresets';
import { DATE_FORMAT } from './DateTime';

import { parseDate, makeWeekArray } from './helpers';
import { Granularity, Range, RangeValue, OnChange, RangeDates } from './types';
import Modal from '../modal/Modal';

// import './DateRangePicker.sass';
import { isNullOrUndefined } from 'util';

const USER_FORMAT = 'dd MMM yyyy';

const TODAY = new Date();

export interface DateStateRangePickerProps {
  from?: string;
  to?: string;
  value: RangeValue | null;
  onChange: OnChange;
  highMode?: Granularity;
}

export interface DateStateRangePickerState {
  selectedFrom: Date;
  selectedTo: Date;
  selectionMode: Range;
  prevValue: RangeValue;
  isShowDatePicker?: boolean;
  popupXPosition?: number;
  popupYPosition?: number;
  isFocused?: boolean;
  focusedDay?: Date;
}

function prepareState(props: DateStateRangePickerProps): DateStateRangePickerState {
  const parsedFrom = props.value ? parseDate(props.value.from) : null;
  const parsedTo = props.value ? parseDate(props.value.to) : null;

  return {
    selectedFrom: parsedFrom,
    selectedTo: parsedTo,
    prevValue: props.value,
    selectionMode: Range.FROM,
  };
}

export default class DateStateRangePicker extends Component<DateStateRangePickerProps, DateStateRangePickerState> {

  public static defaultProps = {
    from: null,
    to: null,
  };

  private containerRef: React.RefObject<HTMLTableHeaderCellElement>
  private componentRef: React.RefObject<HTMLTableHeaderCellElement>
  private inputRef: React.RefObject<HTMLInputElement>


  public constructor(props: DateStateRangePickerProps) {
    super(props);

    this.state = {
      ...prepareState(props),
      isShowDatePicker: false,
      isFocused: false,
    };

    this.containerRef = React.createRef();
    this.componentRef = React.createRef();
    this.inputRef = React.createRef();
  }

  public static getDerivedStateFromProps(props: DateStateRangePickerProps, state: DateStateRangePickerState): DateStateRangePickerState {
    if (props.value !== state.prevValue) {

      return prepareState(props);
    }

    return null;
  }

  public componentWillUnmount(): void {
    document.removeEventListener('click', this.handleOutsideClick, true);
  }

  private getCanSelectFrom(canSelectFrom: Date, selectedFrom: Date): Date {
    if (canSelectFrom && selectedFrom) {
      return max([canSelectFrom, selectedFrom]);
    }

    if (canSelectFrom) {
      return canSelectFrom;
    }

    if (selectedFrom) {
      return selectedFrom;
    }

    return null;
  }

  private showDatePicker(): void {
    const clientRect = this.componentRef.current.getBoundingClientRect();
    const windowWidth = document.body.clientWidth;
    const windowHeight = document.body.scrollHeight;

    let popupXPosition = 0;
    let popupYPosition = clientRect.height;

    if (clientRect.left + 645 > windowWidth) {
      popupXPosition = windowWidth - 645 - clientRect.left;
    }

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop + clientRect.top + clientRect.height + 450 > windowHeight) {
      popupYPosition = -450;
    }

    this.setState({
      isShowDatePicker: true,
      popupXPosition,
      popupYPosition,
    });

    document.addEventListener('click', this.handleOutsideClick, true);
  }

  private hideDatePicker = (): void => {
    this.setState({
      isShowDatePicker: false,
    });

    this.inputRef.current.focus();

    document.removeEventListener('click', this.handleOutsideClick, true);
  }

  private toggleDatePicker = (): void => {
    if (!this.state.isShowDatePicker) {
      this.showDatePicker();
    } else {
      this.hideDatePicker();
    }
  }

  private handleKeyboard = (e: React.KeyboardEvent): void => {
    switch (e.keyCode) {
      case 13:
      case 32:
        this.toggleDatePicker();
        break;
    }
  }

  private getSelectionLimits = (): RangeDates => {
    const canSelectFrom = this.props.from ? parseDate(this.props.from) : null;
    const canSelectTo = this.props.to ? parseDate(this.props.to) : null;

    return {
      [Range.FROM]: this.state.selectionMode === Range.TO
        ? this.getCanSelectFrom(canSelectFrom, this.state.selectedFrom)
        : canSelectFrom,
      [Range.TO]: canSelectTo,
    };
  }

  private renderHorizontal(): React.ReactNode {
    const selectionLimits = this.getSelectionLimits();

    return (
      <div className="date-range date-range--horizontal"
        style={ { left: this.state.popupXPosition, top: this.state.popupYPosition } }
        ref={ this.containerRef }>
        <DateRangePresets
          onSelect={ this.handleChangePreset }
          selectedFrom={ this.state.selectedFrom }
          selectedTo={ this.state.selectedTo }
        />
        <DateRangePickerHorizontal
          selectionLimits={ selectionLimits }
          onSelect={ this.handleDateSelect }
          value={ this.props.value }
          onClose={ this.hideDatePicker }
          selectedFrom={ this.state.selectedFrom }
          selectedTo={ this.state.selectedTo }
          highMode={ this.props.highMode }
        />
      </div>
    );
  }

  private renderSelectedDates(onClick): ReactNode {
    return (
      <div className="date-range__selected-dates" onClick={ onClick }>
        <span>
          {
            getPresetLabel(this.state.selectedFrom, this.state.selectedTo, USER_FORMAT)
          }
        </span>
      </div>
    );
  }

  private renderVertical(): ReactNode {
    const selectionLimits = this.getSelectionLimits();

    return (
      <Modal className="modal_nopadding_mod modal_nopadding_mod-datepicker"
        onClose={ this.hideDatePicker }
      >
        <div className="date-range date-range--vertical" ref={ this.containerRef }>
          {
            this.renderSelectedDates(isNullOrUndefined)
          }
          <DateRangePresets
            onSelect={ this.handleChangePreset }
            selectedFrom={ this.state.selectedFrom }
            selectedTo={ this.state.selectedTo }
          />
          <div className="date-range__external-weekdays">
            {
              makeWeekArray(startOfWeek(TODAY, { weekStartsOn: 1 })).map((day): React.ReactElement => {
                return (<div className="date-time__week-day" key={ format(day, 'E') }>{ format(day, 'E') }</div>);
              })
            }
          </div>
          <DateRangePickerVertical
            selectionLimits={ selectionLimits }
            selectedFrom={ this.state.selectedFrom }
            selectedTo={ this.state.selectedTo }
            highMode={ this.props.highMode }
            onSelect={ this.handleDateSelect }
          />
        </div>
      </Modal>
    );
  }

  private onFocus = (): void => {
    this.setState({
      isFocused: true,
    });
  }

  private onBlur = (): void => {
    this.setState({
      isFocused: false,
    });
  }

  public render(): React.ReactNode {
    return (
      <div className={ classnames('date-range__input', {
        'date-range__input--is-menu-open': this.state.isShowDatePicker,
        'date-range__input--is-focused': this.state.isFocused,
      }) } ref={ this.componentRef }>
        {
          this.renderSelectedDates(this.toggleDatePicker)
        }
        <input className="date-range__focusable" ref={ this.inputRef } onFocus={ this.onFocus } onBlur={ this.onBlur } onKeyDown={ this.handleKeyboard }/>
        {
          this.state.isShowDatePicker && (
            window.innerWidth < 700
              ? this.renderVertical()
              : this.renderHorizontal()
          )
        }
      </div>
    );
  }

  private handleOutsideClick = (e): void => {
    const clickInComponent = this.containerRef.current.contains(e.target);

    if (clickInComponent) {
      return;
    }

    if (!this.state.selectedFrom || !this.state.selectedTo) {
      this.restoreValue();
    }

    this.hideDatePicker();
  }

  private restoreValue(): void {
    this.setState(prepareState(this.props));
  }

  private handleChangePreset = (value: RangeValue): void => {
    this.hideDatePicker();
    this.props.onChange(value);
  }

  private handleDateSelect = (value: Date): void => {
    if (this.state.selectionMode === Range.FROM) {
      this.setState({
        selectedFrom: value,
        selectedTo: null,
        selectionMode: Range.TO,
      });

      // this.inputRef.current.focus();
    }

    if (this.state.selectionMode === Range.TO) {
      this.setState({
        selectedTo: value,
        selectionMode: Range.FROM,
      });

      const result: RangeValue = {
        from: format(this.state.selectedFrom, DATE_FORMAT),
        to: format(value, DATE_FORMAT),
      };

      this.props.onChange(result);
      this.hideDatePicker();
    }
  }
}
