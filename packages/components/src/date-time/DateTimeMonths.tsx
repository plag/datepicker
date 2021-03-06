import React, { Component } from 'react';
import classnames from 'classnames';
import ArrowSvg from './Arrow';

import {
  subYears,
  endOfYear,
  startOfYear,
  addYears,
  isSameMonth,
  format,
  getYear,
  getMonth,
  addMonths,
  subMonths,
  isBefore,
  startOfMonth,
  isAfter,
} from 'date-fns';

import Input from '../input/Input';

import { OnMonthSelect, OnHeaderClick, Granularity, Modificator, OnChangePage, Direction } from './types';
import { isDateInRange, getDirectionFromEvent } from './helpers';

export interface DateTimeMonthsProps {
  showingPageDate: Date;
  onChangePage: OnChangePage;
  onHeaderClick: OnHeaderClick;
  onSelect: OnMonthSelect;
  selectedDate: Date;
  selectedFromDate: Date;
  selectedToDate: Date;
  canSelectFromDate: Date;
  canSelectToDate: Date;
  isHighMode: boolean;
}

export interface DateTimeMonthsState {
  focusedDate: Date;
}

type Quarter = Date[]
type Year = Quarter[]

class DateTimeMonths extends Component<DateTimeMonthsProps, DateTimeMonthsState> {
  private controlRef: React.RefObject<HTMLInputElement>

  constructor(props) {
    super(props);

    this.controlRef = React.createRef();

    this.state = {
      focusedDate: null,
    };
  }

  makeQuarterArray(current: Date): Quarter {
    const result: Quarter = [current];

    for (let i = 1; i < 4; i += 1) {
      result.push(addMonths(current, i));
    }

    return result;
  }

  makeYearQuartersArray(current: Date): Year {
    const quarters: Year = [];

    const startYear = getYear(current);

    let iteratee = current;

    while (startYear === getYear(iteratee)) {
      quarters.push(this.makeQuarterArray(iteratee));
      iteratee = addMonths(iteratee, 4);
    }

    return quarters;
  }

  render(): React.ReactNode {
    const periodStartDate = startOfYear(this.props.showingPageDate);

    const headerTitle = format(periodStartDate, 'yyyy');

    const isCanNavigatePrev = this.isPrevButtonEnabled(periodStartDate);
    const isCanNavigateNext = this.isNextButtonEnabled(periodStartDate);

    return (<div className="rdtMonths">
      {
        !this.props.isHighMode &&
          <Input inputRef={ this.controlRef } className="date-range__focusable" focusOnMount onKeyDown={ this.handleDaysKeydown } onFocus={ this.onFocusControl } onBlur={ this.onBlurControl } />
      }
      <table>
        <thead>
          <tr>
            <th
              className={
                classnames('date-time__arrows date-time__arrows--prev', {
                  'date-time__disabled': !isCanNavigatePrev,
                })
              }
              onClick={ isCanNavigatePrev ? this.handleNavigationClick.bind(this, Modificator.SUB) : this.preventEvent }
            ><ArrowSvg /></th>
            <th
              className="date-time__switch"
              colSpan={ 2 }
              data-year={ getYear(periodStartDate) }
              onClick={ this.handleHeaderClick }
            >{ headerTitle }</th>
            <th
              className={
                classnames('date-time__arrows date-time__arrows--next', {
                  'date-time__disabled': !isCanNavigateNext,
                })
              }
              onClick={ isCanNavigateNext ? this.handleNavigationClick.bind(this, Modificator.ADD) : this.preventEvent }
            ><ArrowSvg /></th>
          </tr>
        </thead>
        <tbody onClick={ this.handleCellClick }>
          { this.makeYearQuartersArray(periodStartDate).map((quarter, index) => (
            <tr key={ `quarter-${index}` }>
              { quarter.map((month: Date) => (
                <td
                  key={ format(month, 'yyyy-MM') }
                  className={ classnames('date-time__month', {
                    'date-time__disabled': !isDateInRange(month, this.props.canSelectFromDate, this.props.canSelectToDate, Granularity.MONTH),
                    'date-time__month--current': this.props.selectedDate && isSameMonth(month, this.props.selectedDate),
                    'date-time__month--in-range': this.isInRange(month),
                    'date-time__month--is-focused': this.state.focusedDate ? isSameMonth(month, this.state.focusedDate) : false,
                  }) }
                  data-year={ getYear(month) }
                  data-month={ getMonth(month) }
                >{ format(month, 'MMM') }</td>
              )) }
            </tr>
          )) }
        </tbody>
      </table>
    </div>);
  }

  private onFocusControl = (): void => {
    let willDate: Date;

    willDate = startOfYear(this.props.showingPageDate);
    if (this.props.canSelectFromDate && isBefore(willDate, this.props.canSelectFromDate)) {
      willDate = startOfMonth(this.props.canSelectFromDate);
    }

    this.setState({
      focusedDate: willDate,
    });
  }

  private onBlurControl = (): void => {
    this.setState({
      focusedDate: null,
    });
  }

  private moveToMonth = (currentDate: Date, direction: Direction): Date => {
    switch (direction) {
      case Direction.DOWN:
        return addMonths(currentDate, 4);
      case Direction.UP:
        return subMonths(currentDate, 4);
      case Direction.LEFT:
        return subMonths(currentDate, 1);
      case Direction.RIGHT:
        return addMonths(currentDate, 1);
    }
  }

  private navigate = (direction: Direction): void => {
    this.setState(state => {
      const willDate = this.moveToMonth(state.focusedDate, direction);

      if (!isDateInRange(willDate, this.props.canSelectFromDate, this.props.canSelectToDate, Granularity.MONTH)) {
        return;
      }

      const pageFrom = startOfYear(this.props.showingPageDate);
      const pageTo = endOfYear(this.props.showingPageDate);
      const inRange = isDateInRange(willDate, pageFrom, pageTo, Granularity.MONTH);

      if (!inRange && isBefore(willDate, pageFrom)) {
        this.changePage(Modificator.SUB);
      }

      if (!inRange && isAfter(willDate, pageTo)) {
        this.changePage(Modificator.ADD);
      }

      return {
        focusedDate: willDate,
      };
    });
  }


  private handleDaysKeydown = (e: React.KeyboardEvent): void => {
    const direction = getDirectionFromEvent(e);

    if (direction != null) {
      this.navigate(direction);
      return;
    }

    switch (e.keyCode) {
      // case 27:
      //   this.hideDatePicker();
      //   break;
      case 77: // M letter
        this.props.onHeaderClick();
        break;
      case 13:
        this.props.onSelect(getMonth(this.state.focusedDate), getYear(this.state.focusedDate));
        break;
    }
  }

  isInRange = (date: Date): boolean => {
    if (!this.props.selectedFromDate || !this.props.selectedToDate) {
      return false;
    }

    return isDateInRange(date, this.props.selectedFromDate, this.props.selectedToDate, Granularity.MONTH);
  }

  preventEvent(e): void {
    e.preventDefault();
  }

  isPrevButtonEnabled(startDate: Date): boolean {
    const prevYearDate = endOfYear(subYears(startDate, 1));

    return isDateInRange(prevYearDate, this.props.canSelectFromDate, this.props.canSelectToDate, Granularity.MONTH);
  }

  isNextButtonEnabled(startDate: Date): boolean {
    const nextYearDate = startOfYear(addYears(startDate, 1));

    return isDateInRange(nextYearDate, this.props.canSelectFromDate, this.props.canSelectToDate, Granularity.MONTH);
  }

  handleHeaderClick = (): void => {
    this.props.onHeaderClick();
  }

  handleCellClick = (e): void => {
    const year = e.target.getAttribute('data-year');
    const month = e.target.getAttribute('data-month');

    if (!year && !month) {
      return;
    }

    const date = new Date(year, month, 1, 0, 0, 0);

    if (isDateInRange(date, this.props.canSelectFromDate, this.props.canSelectToDate, Granularity.MONTH)) {
      this.props.onSelect(parseInt(month, 10), parseInt(year, 10));
    }
  }

  handleNavigationClick(modificator: Modificator, e): void {
    e.preventDefault();

    this.changePage(modificator);
  }

  changePage(modificator: Modificator): void {
    let currentYear = startOfYear(this.props.showingPageDate);

    switch (modificator) {
      case Modificator.ADD: currentYear = addYears(currentYear, 1); break;
      case Modificator.SUB: currentYear = subYears(currentYear, 1); break;
    }

    this.props.onChangePage(currentYear);
  }
}

export default DateTimeMonths;
