import React, { Component } from 'react';
import DateTimeDays from './DateTimeDays';
import DateTimeMonths from './DateTimeMonths';
import DateTimeYears from './DateTimeYears';

import { Granularity, OnChangePage } from './types';
// import './DateTime.sass';

export const DATE_FORMAT = 'yyyy-MM-dd';

interface DateTimeComponentProps {
  selectedFromDate: Date;
  selectedToDate: Date;
  canSelectFromDate: Date;
  canSelectToDate: Date;
  onSelect: (date: Date, mode: Granularity) => void;
  value: Date;
  showingPageDate: Date;
  onChangePage: OnChangePage;
  hideNextPageArrow: boolean;
  hidePrevPageArrow: boolean;
  disableQuickSelect: boolean;
  disableWeekDays: boolean;
  focusedDay?: Date;
  mode: Granularity;
  highMode: Granularity;
  onChangeMode?: (mode: Granularity) => void;
}

class DateTimeComponent extends Component<DateTimeComponentProps> {
  private renderDays(): React.ReactNode {
    return (
      <DateTimeDays
        showingPageDate={ this.props.showingPageDate }
        onChangePage={ this.props.onChangePage }
        onHeaderClick={ this.handleHeaderClick }
        onSelectDate={ this.handleDateSelect }
        selectedDate={ this.props.value }
        selectedFromDate={ this.props.selectedFromDate }
        selectedToDate={ this.props.selectedToDate }
        canSelectFromDate={ this.props.canSelectFromDate }
        canSelectToDate={ this.props.canSelectToDate }
        hideNextPageArrow={ this.props.hideNextPageArrow }
        hidePrevPageArrow={ this.props.hidePrevPageArrow }
        disableWeekDays={ this.props.disableWeekDays }
        focusedDay={ this.props.focusedDay }
      />
    );
  }

  private renderMonths(): React.ReactNode {
    return (
      <DateTimeMonths
        showingPageDate={ this.props.showingPageDate }
        onChangePage={ this.props.onChangePage }
        onHeaderClick={ this.handleHeaderClick }
        onSelect={ this.handleMonthSelect }
        selectedDate={ this.props.value }
        selectedFromDate={ this.props.selectedFromDate }
        selectedToDate={ this.props.selectedToDate }
        canSelectFromDate={ this.props.canSelectFromDate }
        canSelectToDate={ this.props.canSelectToDate }
        isHighMode={ this.props.highMode === Granularity.MONTH }
      />
    );
  }

  private renderYears(): React.ReactNode {
    return (
      <DateTimeYears
        showingPageDate={ this.props.showingPageDate }
        onChangePage={ this.props.onChangePage }
        onHeaderClick={ this.handleHeaderClick }
        onSelect={ this.handleYearSelect }
        selectedDate={ this.props.value }
        selectedFromDate={ this.props.selectedFromDate }
        selectedToDate={ this.props.selectedToDate }
        canSelectFromDate={ this.props.canSelectFromDate }
        canSelectToDate={ this.props.canSelectToDate }
        isHighMode={ this.props.highMode === Granularity.YEAR }
      />
    );
  }

  private renderPickerByMode(mode: Granularity): React.ReactNode {
    switch (mode) {
      case Granularity.DAY: return this.renderDays();
      case Granularity.MONTH: return this.renderMonths();
      case Granularity.YEAR: return this.renderYears();
    }
  }

  public render(): React.ReactNode {
    return (
      <div className="date-time">
        { this.renderPickerByMode(this.props.mode) }
      </div>
    );
  }

  private handleHeaderClick = (): void => {
    if (this.props.disableQuickSelect) {
      return;
    }

    const modesOrder = [Granularity.DAY, Granularity.MONTH, Granularity.YEAR];
    const currentIndex = modesOrder.indexOf(this.props.mode);

    if (currentIndex >= modesOrder.length - 1) {
      return;
    }

    const nextMode = modesOrder[currentIndex + 1];

    this.props.onChangeMode(nextMode);
  }

  private handleDateSelect = (date: Date): void => {
    this.props.onSelect(date, Granularity.DAY);
  }

  private handleMonthSelect = (selectedMonth: number, selectedYear: number): void => {
    const month = new Date(selectedYear, selectedMonth, 1);

    this.props.onSelect(month, Granularity.MONTH);
  }

  private handleYearSelect = (selectedYear: number): void => {
    const year = new Date(selectedYear, 0, 1);

    this.props.onSelect(year, Granularity.YEAR);
  }
}

export default DateTimeComponent;
