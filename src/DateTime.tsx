import React, { Component } from 'react';
import DateTimeDays from './DateTimeDays';
import DateTimeMonths from './DateTimeMonths';
import DateTimeYears from './DateTimeYears';

import { Granularity, OnSelect, OnChangePage } from './types';

export const DATE_FORMAT = 'YYYY-MM-DD';

interface DateTimeComponentProps {
  selectedFromDate: Date;
  selectedToDate: Date;
  canSelectFromDate: Date;
  canSelectToDate: Date;
  onSelect: OnSelect;
  value: Date;
  highMode: Granularity;
  showingPageDate: Date;
  onChangePage: OnChangePage;
  hideNextPageArrow: boolean;
  hidePrevPageArrow: boolean;
  disableQuickSelect: boolean;
  disableWeekDays: boolean;
}

interface DateTimeComponentState {
  mode: Granularity;
  internalPage: Date; // for years and months
}

class DateTimeComponent extends Component<DateTimeComponentProps, DateTimeComponentState> {
  public constructor(props: DateTimeComponentProps) {
    super(props);

    this.state = {
      mode: props.highMode || Granularity.DAY,
      internalPage: null,
    };
  }

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
      />
    );
  }

  private renderMonths(): React.ReactNode {
    return (
      <DateTimeMonths
        showingPageDate={ this.state.internalPage }
        onChangePage={ this.changeInternalPage }
        onHeaderClick={ this.handleHeaderClick }
        onSelect={ this.handleMonthSelect }
        selectedDate={ this.props.value }
        selectedFromDate={ this.props.selectedFromDate }
        selectedToDate={ this.props.selectedToDate }
        canSelectFromDate={ this.props.canSelectFromDate }
        canSelectToDate={ this.props.canSelectToDate }
      />
    );
  }

  private renderYears(): React.ReactNode {
    return (
      <DateTimeYears
        showingPageDate={ this.state.internalPage }
        onChangePage={ this.changeInternalPage }
        onHeaderClick={ this.handleHeaderClick }
        onSelect={ this.handleYearSelect }
        selectedDate={ this.props.value }
        selectedFromDate={ this.props.selectedFromDate }
        selectedToDate={ this.props.selectedToDate }
        canSelectFromDate={ this.props.canSelectFromDate }
        canSelectToDate={ this.props.canSelectToDate }
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
        { this.renderPickerByMode(this.state.mode) }
      </div>
    );
  }

  private changeInternalPage = (internalPage: Date) => {
    this.setState({
      internalPage,
    });
  }

  private handleHeaderClick = () => {
    if (this.props.disableQuickSelect) {
      return;
    }

    const modesOrder = [Granularity.DAY, Granularity.MONTH, Granularity.YEAR];
    const currentIndex = modesOrder.indexOf(this.state.mode);

    if (currentIndex >= modesOrder.length - 1) {
      return;
    }

    const nextMode = modesOrder[currentIndex + 1];

    this.setState({
      mode: nextMode,
      internalPage: nextMode !== Granularity.DAY ? this.props.showingPageDate : null,
    });
  }

  private handleDateSelect = (date: Date) => {
    this.props.onSelect(date);
  }

  private handleMonthSelect = (selectedMonth: number, selectedYear: number) => {
    const month = new Date(selectedYear, selectedMonth, 1);

    if (this.props.highMode === Granularity.MONTH) {
      this.props.onSelect(month);
      return;
    }

    this.setState({
      mode: Granularity.DAY,
    });

    this.props.onChangePage(month);
  }

  private handleYearSelect = (selectedYear: number) => {
    const year = new Date(selectedYear, 0, 1);

    if (this.props.highMode === Granularity.YEAR) {
      this.props.onSelect(year);
      return;
    }

    this.setState({
      mode: Granularity.MONTH,
    });

    this.changeInternalPage(year);
  }
}

export default DateTimeComponent;
