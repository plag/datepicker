import React, { Component } from 'react';
import classnames from 'classnames';
import ArrowSvg from './arrow';

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
} from 'date-fns';

import { OnMonthSelect, OnHeaderClick, Granularity, Modificator, OnChangePage } from './types';
import { isDateInRange } from './helpers';

export interface DateTimeMonthsProps {
  showingPageDate: Date,
  onChangePage: OnChangePage,
  onHeaderClick: OnHeaderClick,
  onSelect: OnMonthSelect,
  selectedDate: Date,
  selectedFromDate: Date,
  selectedToDate: Date,
  canSelectFromDate: Date,
  canSelectToDate: Date,
}

type Quarter = Date[]
type Year = Quarter[]

class DateTimeMonths extends Component<DateTimeMonthsProps> {
  headerRef: React.RefObject<HTMLTableHeaderCellElement>

  constructor(props) {
    super(props);

    this.headerRef = React.createRef();
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
      quarters.push(this.makeQuarterArray(iteratee))
      iteratee = addMonths(iteratee, 4);
    }

    return quarters;
  }

  render() {
    const periodStartDate = startOfYear(this.props.showingPageDate);

    const headerTitle = format(periodStartDate, 'YYYY');

    const isCanNavigatePrev = this.isPrevButtonEnabled(periodStartDate);
    const isCanNavigateNext = this.isNextButtonEnabled(periodStartDate);

    return (<div className="rdtMonths">
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
            ><Svg src={ArrowSvg} /></th>
            <th
              ref={ this.headerRef }
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
            ><Svg src={ArrowSvg} /></th>
          </tr>
        </thead>
        <tbody onClick={ this.handleCellClick }>
          { this.makeYearQuartersArray(periodStartDate).map((quarter, index) => (
            <tr key={ `quarter-${index}` }>
              { quarter.map((month: Date) => (
                <td
                  key={ format(month, 'YYYY-MM') }
                    className={classnames('date-time__month', {
                    'date-time__disabled': !isDateInRange(month, this.props.canSelectFromDate, this.props.canSelectToDate, Granularity.MONTH),
                    'date-time__month--current': this.props.selectedDate && isSameMonth(month, this.props.selectedDate),
                    'date-time__month--in-range': this.isInRange(month),
                  }) }
                  data-year={ getYear(month) }
                  data-month={ getMonth(month) }
                >{ format(month, 'MMM') }</td>
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

    return isDateInRange(date, this.props.selectedFromDate, this.props.selectedToDate, Granularity.MONTH)
  }

  preventEvent(e) {
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

  handleHeaderClick = () => {
    this.props.onHeaderClick();
  }

  handleCellClick = (e) => {
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

  handleNavigationClick(modificator: Modificator, e) {
    e.preventDefault();

    let currentYear = startOfYear(this.props.showingPageDate);

    switch (modificator) {
      case Modificator.ADD: currentYear = addYears(currentYear, 1); break;
      case Modificator.SUB: currentYear = subYears(currentYear, 1); break;
    }

    this.props.onChangePage(currentYear);
  }
}

export default DateTimeMonths;
