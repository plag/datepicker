import React, { Component } from 'react';
import classnames from 'classnames';

import ArrowSvg from './arrow';

import { isDateInRange } from './helpers';
import { Granularity, OnYearSelect, Modificator, OnHeaderClick, OnChangePage } from './types';

import {
  addYears,
  getYear,
  isSameYear,
  subYears,
  endOfYear,
  startOfYear,
  format,
} from 'date-fns';

export interface DateTimeYearsProps {
  showingPageDate: Date,
  onChangePage: OnChangePage,
  onHeaderClick: OnHeaderClick,
  onSelect: OnYearSelect,
  selectedDate: Date,
  selectedFromDate: Date,
  selectedToDate: Date,
  canSelectFromDate: Date,
  canSelectToDate: Date,
}

type Years = Date[]
type Decade = Years[]

class DateTimeYears extends Component<DateTimeYearsProps> {
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
      fourYearsArray.push(this.makeFourYearsArray(iteratee))
      iteratee = addYears(iteratee, 4);
    }

    return fourYearsArray;
  }

  render() {
    const startDecade = subYears(this.props.showingPageDate, getYear(this.props.showingPageDate) % 10 - 1);
    const startDate = startOfYear(startDecade);

    const headerTitle = `${ getYear(startDate) }-${ getYear(startDate) + 11 }`;

    const isCanNavigatePrev = this.isPrevButtonEnabled(startDate);
    const isCanNavigateNext = this.isNextButtonEnabled(startDate);

    return (<div className="rdtYears">
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
            ><Svg src={ArrowSvg} /></th>
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
            ><Svg src={ArrowSvg} /></th>
          </tr>
        </thead>
        <tbody onClick={ this.handleCellClick }>
          { this.makeDecadeYearsArray(startDate).map((fourYears: Years, index) => (
            <tr key={ `year-${index}` }>
              { fourYears.map((year: Date) => (
                <td
                  key={ format(year, 'yyyy') }
                  className={classnames('date-time__year', {
                    'date-time__disabled': !isDateInRange(year, this.props.canSelectFromDate, this.props.canSelectToDate, Granularity.YEAR),
                    'date-time__year--current': isSameYear(year, this.props.selectedDate),
                    'date-time__year--in-range': this.isInRange(year),
                  }) }
                  data-value={ getYear(year) }
                >{ format(year, 'yyyy') }</td>
              )) }
            </tr>
          ))}
        </tbody>
      </table>
    </div>)
  }

  isInRange = (date: Date) => {
    if (!this.props.selectedFromDate || !this.props.selectedToDate) {
      return false;
    }

    return isDateInRange(date, this.props.selectedFromDate, this.props.selectedToDate, Granularity.YEAR)
  }

  preventEvent(e) {
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

  handleCellClick = (e) => {
    const year = e.target.getAttribute('data-value');

    if (!year) {
      return;
    }

    const date = new Date(year, 0, 1, 0, 0, 0);

    if (isDateInRange(date, this.props.canSelectFromDate, this.props.canSelectToDate, Granularity.YEAR)) {
      this.props.onSelect(parseInt(year, 10));
    }
  }

  handleNavigationClick(modificator: Modificator, e) {
    e.preventDefault();

    let currentYear = startOfYear(this.props.showingPageDate);

    switch (modificator) {
      case Modificator.ADD: currentYear = addYears(currentYear, 10); break;
      case Modificator.SUB: currentYear = subYears(currentYear, 10); break;
    }

    this.props.onChangePage(currentYear);
  }

  handleHeaderClick = () => {
    this.props.onHeaderClick();
  }
}

export default DateTimeYears;
