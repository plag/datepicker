import React, { Component, ReactNode } from 'react';
import VirtualList from 'react-tiny-virtual-list';
import classnames from 'classnames';

import { parseDate, makeWeekArray } from './helpers';
import { Granularity, Range, RangeValue, OnChange } from './types';
import Modal from '~/components/modal/Modal';

import {
  format,
  max,
  subMonths,
  differenceInCalendarMonths,
  differenceInCalendarWeeks,
  addMonths,
  startOfWeek,
  lastDayOfMonth,
} from 'date-fns';

import DateTime, { DATE_FORMAT } from './DateTime';
import DateRangePresets, { getPresetLabel } from '~/components/form/date-time/DateRangePresets';

import { isNullOrUndefined } from 'util';

const USER_FORMAT = 'dd MMM yyyy';

const TODAY = new Date();
const FIRST_VERTICAL_DATE = new Date(2000, 0, 1);

type ShowingPages = Date[];

function calculateMonthHeight(index: number): number {
  const monthDate = addMonths(FIRST_VERTICAL_DATE, index);
  const lastDay = lastDayOfMonth(monthDate);

  const weeksCount = differenceInCalendarWeeks(lastDay, monthDate, { weekStartsOn: 1 }) + 1;

  return weeksCount * 40 + 45; // ROW height + Header height
}

function calculateMonthOffset(date: Date): number {
  const monthIndex = differenceInCalendarMonths(date, FIRST_VERTICAL_DATE);

  let result = 0;
  for (let i = 0; i < monthIndex; i += 1) {
    result += calculateMonthHeight(i);
  }

  return result;
}

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
  showingPages: ShowingPages;
  selectionMode: Range;
  prevValue: RangeValue;
  isShowDatePicker?: boolean;
  popupXPosition?: number;
  popupYPosition?: number;
}

function prepareShowingPages(currentPage: Date): ShowingPages {
  return [subMonths(currentPage, 1), currentPage];
}

function modifyShowingPages(index: number, page: Date, showingPages: ShowingPages): ShowingPages {
  const change = differenceInCalendarMonths(page, showingPages[index]);

  const result = showingPages.map(page => addMonths(page, change));

  return result;
}

function prepareState(props: DateStateRangePickerProps): DateStateRangePickerState {
  const parsedFrom = props.value ? parseDate(props.value.from) : null;
  const parsedTo = props.value ? parseDate(props.value.to) : null;

  return {
    selectedFrom: parsedFrom,
    selectedTo: parsedTo,
    showingPages: prepareShowingPages(parsedTo ? parsedTo : TODAY),
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

  public constructor(props: DateStateRangePickerProps) {
    super(props);

    this.state = {
      ...prepareState(props),
      isShowDatePicker: false,
    };

    this.containerRef = React.createRef();
    this.componentRef = React.createRef();
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
      return max(canSelectFrom, selectedFrom);
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

  private hideDatePicker(): void {
    this.setState({
      isShowDatePicker: false,
    });

    document.removeEventListener('click', this.handleOutsideClick, true);
  }

  private toggleDatePicker = () => {
    if (!this.state.isShowDatePicker) {
      this.showDatePicker();
    } else {
      this.hideDatePicker();
    }
  }

  private renderHorizontal(): React.ReactNode {
    const canSelectFrom = this.props.from ? parseDate(this.props.from) : null;
    const canSelectTo = this.props.to ? parseDate(this.props.to) : null;

    return (
      <div className="date-range date-range--horizontal"
        style={ { left: this.state.popupXPosition, top: this.state.popupYPosition } }
        ref={ this.containerRef }>
        <DateRangePresets
          onSelect={ this.handleChangePreset }
          selectedFrom={ this.state.selectedFrom }
          selectedTo={ this.state.selectedTo }
        />
        <div className="date-range__container">
          {
            this.state.showingPages.map((showingPage, index): React.ReactElement => (
              <DateTime
                key={ format(showingPage, 'yyyy-MM-dd') }
                canSelectFromDate={
                  this.state.selectionMode === Range.TO
                    ? this.getCanSelectFrom(canSelectFrom, this.state.selectedFrom)
                    : canSelectFrom
                }
                canSelectToDate={ canSelectTo }
                selectedFromDate={ this.state.selectedFrom }
                selectedToDate={ this.state.selectedTo }
                onSelect={ this.handleDateSelect }
                value={ null }
                highMode={ this.props.highMode }
                showingPageDate={ showingPage }
                onChangePage={ this.handleChangePage.bind(this, index) }
                hidePrevPageArrow={ index !== 0 }
                hideNextPageArrow={ index !== this.state.showingPages.length - 1 }
                disableQuickSelect={ false }
                disableWeekDays={ false }
              />
            ))
          }
        </div>
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
    const canSelectFrom = this.props.from ? parseDate(this.props.from) : null;
    const canSelectTo = this.props.to ? parseDate(this.props.to) : null;

    return (
      <Modal className="modal_nopadding_mod"
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
                return (<div className="date-time__week-day" key={ format(day, 'dd') }>{ format(day, 'dd') }</div>);
              })
            }
          </div>
          <div className="date-range__container">
            <VirtualList
              width={ 280 }
              height='100%'
              itemCount={ differenceInCalendarMonths(TODAY, FIRST_VERTICAL_DATE) + 1 }
              itemSize={ (index) => calculateMonthHeight(index) }
              scrollOffset={ calculateMonthOffset(this.state.selectedFrom || TODAY) }
              renderItem={
                ({ index, style }): React.ReactElement => (
                  <div key={ index } style={ style }>
                    <DateTime
                      key={ format(addMonths(FIRST_VERTICAL_DATE, index), 'yyyy-MM-dd') }
                      canSelectFromDate={
                        this.state.selectionMode === Range.TO
                          ? this.getCanSelectFrom(canSelectFrom, this.state.selectedFrom)
                          : canSelectFrom
                      }
                      canSelectToDate={ canSelectTo }
                      selectedFromDate={ this.state.selectedFrom }
                      selectedToDate={ this.state.selectedTo }
                      onSelect={ this.handleDateSelect }
                      value={ null }
                      highMode={ this.props.highMode }
                      showingPageDate={ addMonths(FIRST_VERTICAL_DATE, index) }
                      onChangePage={ this.handleChangePage.bind(this, index) }
                      hidePrevPageArrow
                      hideNextPageArrow
                      disableQuickSelect
                      disableWeekDays
                    />
                  </div>
                )
              }
            />
          </div>
        </div>
      </Modal>
    );
  }

  public render(): React.ReactNode {
    return (
      <div className={ classnames('date-range__input', {
        'date-range__input--is-menu-open': this.state.isShowDatePicker,
      }) } ref={ this.componentRef }>
        {
          this.renderSelectedDates(this.toggleDatePicker)
        }
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

  private handleOutsideClick = (e) => {
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

  private handleChangePreset = (value: RangeValue) => {
    this.hideDatePicker();
    this.props.onChange(value);
  }

  private handleChangePage = (index: number, pageDate: Date) => {
    this.setState(state => ({
      showingPages: modifyShowingPages(index, pageDate, state.showingPages),
    }));
  }

  private handleDateSelect = (value: Date) => {
    if (this.state.selectionMode === Range.FROM) {
      this.setState({
        selectedFrom: value,
        selectedTo: null,
        selectionMode: Range.TO,
      });
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
