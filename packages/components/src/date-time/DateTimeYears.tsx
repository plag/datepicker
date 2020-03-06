import React, { Component } from 'react';
import classnames from 'classnames';

import ArrowSvg from './Arrow';

import { isDateInRange, startOfDecade, getDirectionFromEvent } from './helpers';
import { Granularity, OnYearSelect, Modificator, OnHeaderClick, OnChangePage, Direction } from './types';

import Input from '../input/Input';

import {
  addYears,
  getYear,
  isSameYear,
  subYears,
  endOfYear,
  startOfYear,
  format,
  isBefore,
  isAfter,
} from 'date-fns';

export interface DateTimeYearsProps {
  showingPageDate: Date;
  onChangePage: OnChangePage;
  onHeaderClick: OnHeaderClick;
  onSelect: OnYearSelect;
  selectedDate: Date;
  selectedFromDate: Date;
  selectedToDate: Date;
  canSelectFromDate: Date;
  canSelectToDate: Date;
  isHighMode: boolean;
}

export interface DateTimeYearsState {
  focusedDate: Date;
}

type Years = Date[]
type Decade = Years[]

class DateTimeYears extends Component<DateTimeYearsProps, DateTimeYearsState> {
  private controlRef: React.RefObject<HTMLInputElement>

  constructor(props) {
    super(props);

    this.controlRef = React.createRef();

    this.state = {
      focusedDate: null,
    };
  }

  makeFourYearsArray(current: Date): Years {
    const result: Years = [current];

    for (let i = 1; i < 4; i += 1) {
      result.push(addYears(current, i));
    }

    return result;
  }

  makeDecadeYearsArray(current: Date): Decade {
    const fourYearsArray: Decade = [];

    const lastYear = getYear(current) + 10;

    let iteratee = current;

    while (lastYear > getYear(iteratee)) {
      fourYearsArray.push(this.makeFourYearsArray(iteratee));
      iteratee = addYears(iteratee, 4);
    }

    return fourYearsArray;
  }

  render(): React.ReactNode {
    const startDecade = startOfDecade(this.props.showingPageDate);
    const startDate = startOfYear(startDecade);

    const headerTitle = `${ getYear(startDate) }-${ getYear(startDate) + 11 }`;

    const isCanNavigatePrev = this.isPrevButtonEnabled(startDate);
    const isCanNavigateNext = this.isNextButtonEnabled(startDate);

    return (<div className="rdtYears">
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
              onClick={ isCanNavigatePrev ? this.handleNavigationClick.bind(this, -1) : this.preventEvent }
            ><ArrowSvg /></th>
            <th
              className="date-time__switch"
              colSpan={ 2 }
              onClick={ this.handleHeaderClick }
            >{ headerTitle }</th>
            <th
              className={
                classnames('date-time__arrows date-time__arrows--next', {
                  'date-time__disabled': !isCanNavigateNext,
                })
              }
              onClick={ isCanNavigateNext ? this.handleNavigationClick.bind(this, 1) : this.preventEvent }
            ><ArrowSvg /></th>
          </tr>
        </thead>
        <tbody onClick={ this.handleCellClick }>
          { this.makeDecadeYearsArray(startDate).map((fourYears: Years, index) => (
            <tr key={ `year-${index}` }>
              { fourYears.map((year: Date) => (
                <td
                  key={ format(year, 'yyyy') }
                  className={ classnames('date-time__year', {
                    'date-time__disabled': !isDateInRange(year, this.props.canSelectFromDate, this.props.canSelectToDate, Granularity.YEAR),
                    'date-time__year--current': isSameYear(year, this.props.selectedDate),
                    'date-time__year--in-range': this.isInRange(year),
                    'date-time__year--is-focused': this.state.focusedDate ? isSameYear(year, this.state.focusedDate) : false,
                  }) }
                  data-value={ getYear(year) }
                >{ format(year, 'yyyy') }</td>
              )) }
            </tr>
          )) }
        </tbody>
      </table>
    </div>);
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
      case 13:
        this.props.onSelect(getYear(this.state.focusedDate));
    }
  }

  private moveToYear = (currentDate: Date, direction: Direction): Date => {
    switch (direction) {
      case Direction.DOWN:
        return addYears(currentDate, 4);
      case Direction.UP:
        return subYears(currentDate, 4);
      case Direction.LEFT:
        return subYears(currentDate, 1);
      case Direction.RIGHT:
        return addYears(currentDate, 1);
    }
  }

  private navigate = (direction: Direction): void => {
    this.setState(state => {
      const willDate = this.moveToYear(state.focusedDate, direction);

      if (!isDateInRange(willDate, this.props.canSelectFromDate, this.props.canSelectToDate, Granularity.YEAR)) {
        return;
      }

      const pageFrom = startOfDecade(this.props.showingPageDate);
      const pageTo = addYears(pageFrom, 11);
      const inRange = isDateInRange(willDate, pageFrom, pageTo, Granularity.YEAR);

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


  private onFocusControl = (): void => {
    let willDate: Date;

    willDate = startOfDecade(this.props.showingPageDate);
    if (this.props.canSelectFromDate && isBefore(willDate, this.props.canSelectFromDate)) {
      willDate = startOfYear(this.props.canSelectFromDate);
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

  isInRange = (date: Date): boolean => {
    if (!this.props.selectedFromDate || !this.props.selectedToDate) {
      return false;
    }

    return isDateInRange(date, this.props.selectedFromDate, this.props.selectedToDate, Granularity.YEAR);
  }

  preventEvent(e): void {
    e.preventDefault();
  }

  isPrevButtonEnabled(startDate: Date): boolean {
    const prevDecadeYear = endOfYear(subYears(startDate, 1));

    return isDateInRange(prevDecadeYear, this.props.canSelectFromDate, this.props.canSelectToDate, Granularity.YEAR);
  }

  isNextButtonEnabled(startDate: Date): boolean {
    const nextDecadeYear = startOfYear(addYears(startDate, 10));

    return isDateInRange(nextDecadeYear, this.props.canSelectFromDate, this.props.canSelectToDate, Granularity.YEAR);
  }

  handleCellClick = (e): void => {
    const year = e.target.getAttribute('data-value');

    if (!year) {
      return;
    }

    const date = new Date(year, 0, 1, 0, 0, 0);

    if (isDateInRange(date, this.props.canSelectFromDate, this.props.canSelectToDate, Granularity.YEAR)) {
      this.props.onSelect(parseInt(year, 10));
    }
  }

  handleNavigationClick(modificator: Modificator, e): void {
    e.preventDefault();

    this.changePage(modificator);
  }

  changePage(modificator: Modificator): void {
    let currentYear = startOfYear(this.props.showingPageDate);

    switch (modificator) {
      case Modificator.ADD: currentYear = addYears(currentYear, 10); break;
      case Modificator.SUB: currentYear = subYears(currentYear, 10); break;
    }

    this.props.onChangePage(currentYear);
  }

  handleHeaderClick = (): void => {
    this.props.onHeaderClick();
  }
}

export default DateTimeYears;
