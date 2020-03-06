import React, { Component } from 'react';

import {
  format,
  subMonths,
  differenceInCalendarMonths,
  addMonths,
  startOfMonth,
  subDays,
  addDays,
  isBefore,
  isAfter,
  isSameMonth,
  isSameYear,
} from 'date-fns';

import { Granularity, Range, RangeValue, Direction, RangeDates } from './types';
import { parseDate, isDateInRange, getDirectionFromEvent, isSameDecade, nextModeDown, nextModeUp } from './helpers';
import DateTime from './DateTime';
import Input from '../input/Input';

type ShowingPages = [Date, Date];
type CalendarsModes = [Granularity, Granularity];

const TODAY = new Date();

export interface DateStateRangePickerHorizontalProps {
  value: RangeValue | null;
  selectedFrom: Date;
  selectedTo: Date;
  selectionLimits: RangeDates;
  highMode?: Granularity;
  onSelect: (date: Date) => void;
  onClose: () => void;
}


export interface DateStateRangePickerHorizontalState {
  showingPages: ShowingPages;
  calendarModes: CalendarsModes;
  prevValue: RangeValue; // detect value changes
  focusedDay?: Date;
}

function prepareShowingPages(currentPage: Date): ShowingPages {
  return [subMonths(currentPage, 1), currentPage];
}

function prepareState(props: DateStateRangePickerHorizontalProps): DateStateRangePickerHorizontalState {
  const parsedTo = props.value ? parseDate(props.value.to) : null;

  return {
    showingPages: prepareShowingPages(parsedTo ? parsedTo : TODAY),
    calendarModes: [props.highMode || Granularity.DAY, props.highMode || Granularity.DAY],
    prevValue: props.value,
  };
}

export default class DateStateRangePickerHorizontal extends Component<DateStateRangePickerHorizontalProps, DateStateRangePickerHorizontalState> {
  private daysNavigatorRef: React.RefObject<HTMLInputElement>

  public constructor(props: DateStateRangePickerHorizontalProps) {
    super(props);

    this.state = prepareState(props);

    this.daysNavigatorRef = React.createRef();
  }

  public componentDidUpdate(_: DateStateRangePickerHorizontalProps, prevState: DateStateRangePickerHorizontalState): void {
    if (prevState.calendarModes === this.state.calendarModes) {
      return;
    }

    const highMode = this.props.highMode || Granularity.DAY;

    if (prevState.calendarModes[0] != this.state.calendarModes[0] && this.state.calendarModes[0] === highMode) {
      this.focusOnControl();
      return;
    }

    if (prevState.calendarModes[1] != this.state.calendarModes[1] && this.state.calendarModes[1] === highMode) {
      this.focusOnControl();
      return;
    }
  }

  componentDidMount(): void {
    this.daysNavigatorRef.current.focus();
  }

  public static getDerivedStateFromProps(props: DateStateRangePickerHorizontalProps, state: DateStateRangePickerHorizontalState): DateStateRangePickerHorizontalState {
    if (props.value !== state.prevValue) {

      return prepareState(props);
    }

    return null;
  }

  public render(): React.ReactNode {
    const { selectionLimits } = this.props;

    return (
      <div className="date-range__container">
        <Input
          inputRef={ this.daysNavigatorRef }
          className="date-range__focusable"
          onKeyDown={ this.handleDaysKeydown }
          onFocus={ this.onFocusDays }
          onBlur={ this.onBlurDays }
        />
        {
          this.state.showingPages.map((showingPage, index): React.ReactElement => (
            <DateTime
              key={ format(showingPage, 'yyyy-MM-dd') }
              canSelectFromDate={ selectionLimits[Range.FROM] }
              canSelectToDate={ selectionLimits[Range.TO] }
              selectedFromDate={ this.props.selectedFrom }
              selectedToDate={ this.props.selectedTo }
              onSelect={ this.handleCalendarSelect.bind(this, index) }
              value={ null }
              mode={ this.state.calendarModes[index] }
              showingPageDate={ showingPage }
              onChangePage={ this.handleChangePage.bind(this, index) }
              hidePrevPageArrow={ index !== 0 }
              hideNextPageArrow={ index !== this.state.showingPages.length - 1 }
              disableQuickSelect={ false }
              disableWeekDays={ false }
              focusedDay={ this.state.focusedDay }
              highMode={ this.props.highMode || Granularity.DAY }
              onChangeMode={ this.handleChangeMode.bind(this, index) }
            />
          ))
        }
      </div>
    );
  }

  private handleChangeMode = (index: number, mode: Granularity): void => {
    const calendarModes: CalendarsModes = [this.state.calendarModes[0], this.state.calendarModes[1]];
    calendarModes[index] = mode;

    this.setState({
      calendarModes,
    });
  }

  private canFocusDate = (date: Date): boolean => {
    const { selectionLimits } = this.props;

    return isDateInRange(date, selectionLimits[Range.FROM], selectionLimits[Range.TO], this.props.highMode || Granularity.DAY);
  }

  private getPageIndexByDate = (showingPages: ShowingPages, date: Date, calendarModes: CalendarsModes): number => {
    return showingPages.findIndex((page: Date, index: number): boolean => {
      const calendarMode = calendarModes[index];

      switch (calendarMode) {
        case Granularity.DAY:
          return isSameMonth(page, date) && isSameYear(page, date);
        case Granularity.YEAR:
          return isSameDecade(page, date);
        case Granularity.MONTH:
          return isSameYear(page, date);
      }
    });
  }

  private navigate = (direction: Direction): void => {
    this.setState(state => {
      let willDate: Date;
      // TODO: support high mode
      switch (direction) {
        case Direction.DOWN:
          willDate = addDays(state.focusedDay, 7);
          break;
        case Direction.LEFT:
          willDate = subDays(state.focusedDay, 1);
          break;
        case Direction.UP:
          willDate = subDays(state.focusedDay, 7);
          break;
        case Direction.RIGHT:
          willDate = addDays(state.focusedDay, 1);
          break;
      }

      if (!this.canFocusDate(willDate)) {
        return;
      }

      let changedShowingPages: ShowingPages;

      // TODO: support high mode
      const inRange = isDateInRange(willDate, this.state.showingPages[0], this.state.showingPages[1], Granularity.MONTH);

      if (!inRange && isBefore(willDate, this.state.showingPages[0])) {
        changedShowingPages = this.recalculatePagesOnNavigation(0, willDate, state);
      }

      if (!inRange && isAfter(willDate, this.state.showingPages[1])) {
        changedShowingPages = this.recalculatePagesOnNavigation(1, willDate, state);
      }

      return {
        focusedDay: willDate,
        showingPages: changedShowingPages || state.showingPages,
      };
    });
  }

  private recalculatePagesOnNavigation(index: number, date: Date, state: DateStateRangePickerHorizontalState): ShowingPages {
    const hightMode = this.props.highMode || Granularity.DAY;

    const change = differenceInCalendarMonths(date, state.showingPages[index]);

    const nextIndex = (index + 1) % state.calendarModes.length;
    let changedPages: ShowingPages;

    if (state.calendarModes[index] === hightMode && state.calendarModes[nextIndex] === hightMode) {
      // modify both
      changedPages = [addMonths(state.showingPages[0], change), addMonths(state.showingPages[1], change)];
    } else {
      changedPages = [state.showingPages[0], state.showingPages[1]];
      // modify only 1 page
      changedPages[index] = addMonths(state.showingPages[index], change);
      changedPages[nextIndex] = state.showingPages[nextIndex];
    }

    return changedPages;
  }

  private handleDaysKeydown = (e: React.KeyboardEvent): void => {
    const direction = getDirectionFromEvent(e);

    if (direction != null) {
      this.navigate(direction);
      return;
    }

    let pageIndex: number;
    let nextMode: Granularity;

    switch (e.keyCode) {
      case 27:
        this.props.onClose();
        break;
      case 77: // M letter
        pageIndex = this.getPageIndexByDate(this.state.showingPages, this.state.focusedDay, this.state.calendarModes);
        nextMode = nextModeUp(this.state.calendarModes[pageIndex]);
        this.handleChangeMode(pageIndex, nextMode);
        break;
      case 13:
        this.props.onSelect(this.state.focusedDay);
    }
  }

  private onFocusDays = (): void => {
    this.setState(state => ({
      focusedDay: startOfMonth(state.showingPages[0]),
    }));
  }

  private onBlurDays = (): void => {
    this.setState({
      focusedDay: null,
    });
  }

  private handleCalendarSelect = (index: number, date: Date, mode: Granularity): void => {
    const hightMode = this.props.highMode || Granularity.DAY;

    if (mode === hightMode) {
      this.props.onSelect(date);
      return;
    }

    const nextMode = nextModeDown(mode);

    const calendarModes: CalendarsModes = [this.state.calendarModes[0], this.state.calendarModes[1]];
    calendarModes[index] = nextMode;

    this.setState(state =>{
      const showingPages = state.showingPages;

      // if both calendars on high mode -> need transition both
      if (calendarModes[0] === hightMode && calendarModes[1] === hightMode) {
        const nextIndex = (index + 1) % calendarModes.length;
        showingPages[index] = date;
        showingPages[nextIndex] = addMonths(date, nextIndex - index);
      } else {
        showingPages[index] = date;
      }

      return {
        calendarModes,
        showingPages,
      };
    });
  }

  private handleChangePage = (index: number, pageDate: Date): void => {
    const hightMode = this.props.highMode || Granularity.DAY;

    this.setState(state => {
      const change = differenceInCalendarMonths(pageDate, state.showingPages[index]);

      const nextIndex = (index + 1) % state.calendarModes.length;
      let changedPages: ShowingPages;

      if (state.calendarModes[index] === hightMode && state.calendarModes[nextIndex] === hightMode) {
        // modify both
        changedPages = [addMonths(state.showingPages[0], change), addMonths(state.showingPages[1], change)];
      } else {
        changedPages = [state.showingPages[0], state.showingPages[1]];
        // modify only 1 page
        changedPages[index] = addMonths(state.showingPages[index], change);
        changedPages[nextIndex] = state.showingPages[nextIndex];
      }

      return {
        showingPages: changedPages,
      };
    });
  }

  private focusOnControl = (): void => {
    this.daysNavigatorRef.current.focus();
  }

}
