import React, { Component } from 'react';
import classnames from 'classnames';
import ArrowSvg from './arrow';
import { isDateInRange, parseDate } from './helpers';
import {
  startOfMonth,
  format,
  getMonth,
  getYear,
  startOfWeek,
  addDays,
  subMonths,
  endOfMonth,
  addMonths,
  isSameDay,
  isSameMonth,
  isToday,
} from 'date-fns';

import {
  OnHeaderClick,
  Granularity,
  OnSelect,
  Modificator,
  OnChangePage,
  Week,
} from './types';

import {
  makeWeekArray,
} from './helpers';

export interface DateTimeDaysProps {
  showingPageDate: Date;
  onChangePage: OnChangePage;
  onHeaderClick: OnHeaderClick;
  onSelectDate: OnSelect;
  selectedDate: Date;
  selectedFromDate: Date;
  selectedToDate: Date;
  canSelectFromDate: Date;
  canSelectToDate: Date;
  hideNextPageArrow: boolean;
  hidePrevPageArrow: boolean;
  disableWeekDays: boolean;
}

type Month = Week[]

class DateTimeDays extends Component<DateTimeDaysProps> {
  private headerRef: React.RefObject<HTMLTableHeaderCellElement>

  public constructor(props: DateTimeDaysProps) {
    super(props);

    this.headerRef = React.createRef();
  }

  private makeMonthWeeksArray(current: Date): Month {
    const weeks: Week[] = [];

    const startMonth = getMonth(current);
    const startYear = getYear(current);

    let iteratee = startOfWeek(current, { weekStartsOn: 1 });

    while ((getMonth(iteratee) <= startMonth) || (startMonth === 0 && getMonth(iteratee) === 11)) {
      weeks.push(makeWeekArray(iteratee));
      iteratee = addDays(iteratee, 7);

      if (getYear(iteratee) > startYear) {
        break;
      }
    }

    return weeks;
  }

  public render(): React.ReactNode {
    const periodStartDate = startOfMonth(this.props.showingPageDate);

    const headerTitle = format(periodStartDate, 'MMMM, yyyy');

    const isCanNavigatePrev = this.isPrevButtonEnabled(periodStartDate);
    const isCanNavigateNext = this.isNextButtonEnabled(periodStartDate);

    return (<div className="date-time__days">
      <table>
        <thead>
          <tr>
            <th
              className={
                classnames('date-time__arrows date-time__arrows--prev', {
                  'date-time__disabled': !isCanNavigatePrev,
                })
              }
              onClick={
                (isCanNavigatePrev && !this.props.hidePrevPageArrow)
                  ? this.handleNavigationClick.bind(this, Modificator.SUB)
                  : this.preventEvent
              }
            >
              {
                !this.props.hidePrevPageArrow && <Svg src={ ArrowSvg } />
              }
            </th>
            <th
              ref={ this.headerRef }
              className="date-time__switch"
              colSpan={ 5 }
              data-year={ getYear(periodStartDate) }
              data-month={ getMonth(periodStartDate) }
              onClick={ this.handleHeaderClick }
            >{ headerTitle }</th>
            <th
              className={
                classnames('date-time__arrows date-time__arrows--next', {
                  'date-time__disabled': !isCanNavigateNext,
                })
              }
              onClick={
                (isCanNavigateNext && !this.props.hideNextPageArrow)
                  ? this.handleNavigationClick.bind(this, Modificator.ADD)
                  : this.preventEvent
              }
            >
              {
                !this.props.hideNextPageArrow && <Svg src={ ArrowSvg } />
              }
            </th>
          </tr>
          <tr>
            {
              !this.props.disableWeekDays && makeWeekArray(startOfWeek(periodStartDate, { weekStartsOn: 1 })).map(day => {
                return (<th className="date-time__week-day" key={ format(day, 'dd') }>{ format(day, 'dd') }</th>);
              })
            }
          </tr>
        </thead>
        <tbody onClick={ this.handleCellClick }>
          { this.makeMonthWeeksArray(periodStartDate).map((week, index) => (
            <tr key={ `week-${index}` }>
              { week.map((day: Date) => (
                isSameMonth(day, periodStartDate)
                  ? <td
                    key={ format(day, 'yyyy-MM-dd') }
                    data-value={ format(day, 'yyyy-MM-dd') }
                    className={
                      classnames('date-time__day', {
                        'date-time__disabled': !isDateInRange(day, this.props.canSelectFromDate, this.props.canSelectToDate, Granularity.DAY),
                        'date-time__day--current': this.props.selectedDate && isSameDay(day, this.props.selectedDate),
                        'date-time__day--in-range': this.isInRange(day),
                        'date-time__day--first-date': this.isFirstDateInRange(day),
                        'date-time__day--last-date': this.isLastDateInRange(day),
                        'date-time__day--preselect': this.isFirstDateInRange(day) && this.props.selectedFromDate && !this.props.selectedToDate,
                        'date-time__day--today': isToday(day),
                      })
                    }
                  >{ format(day, 'D') }{ isToday(day) && <div className="date-time__today-label">Today</div> } </td>
                  : <td key={ format(day, 'yyyy-MM-dd') }>&nbsp;</td>
              )) }
            </tr>
          )) }
        </tbody>
      </table>
    </div>);
  }

  private isInRange = (date: Date) => {
    if (!this.props.selectedFromDate || !this.props.selectedToDate) {
      return false;
    }

    return isDateInRange(date, this.props.selectedFromDate, this.props.selectedToDate, Granularity.DAY);
  }

  private isFirstDateInRange = (date: Date) => {
    if (!this.props.selectedFromDate) {
      return false;
    }

    return isSameDay(date, this.props.selectedFromDate);
  }

  private isLastDateInRange = (date: Date) => {
    if (!this.props.selectedToDate) {
      return false;
    }

    return isSameDay(date, this.props.selectedToDate);
  }

  private preventEvent(e): void {
    e.preventDefault();
  }

  private isPrevButtonEnabled(startDate: Date): boolean {
    const prevMonthDate = endOfMonth(subMonths(startDate, 1));

    return isDateInRange(prevMonthDate, this.props.canSelectFromDate, this.props.canSelectToDate, Granularity.DAY);
  }

  private isNextButtonEnabled(startDate: Date): boolean {
    const nextMonthDate = startOfMonth(addMonths(startDate, 1));

    return isDateInRange(nextMonthDate, this.props.canSelectFromDate, this.props.canSelectToDate, Granularity.DAY);
  }

  private handleHeaderClick = () => {
    this.props.onHeaderClick();
  }

  private handleCellClick = (e) => {
    const value = e.target.getAttribute('data-value');

    if (!value) {
      return;
    }

    const date = parseDate(value);

    if (isDateInRange(date, this.props.canSelectFromDate, this.props.canSelectToDate, Granularity.DAY)) {
      this.props.onSelectDate(date);
    }
  }

  private handleNavigationClick(modificator: Modificator, e): void {
    e.preventDefault();

    let currentDate = startOfMonth(this.props.showingPageDate);

    switch (modificator) {
      case Modificator.ADD: currentDate = addMonths(currentDate, 1); break;
      case Modificator.SUB: currentDate = subMonths(currentDate, 1); break;
    }

    this.props.onChangePage(currentDate);
  }
}

export default DateTimeDays;
