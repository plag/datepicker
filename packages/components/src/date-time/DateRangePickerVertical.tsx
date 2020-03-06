import React, { Component } from 'react';

import VirtualList from 'react-tiny-virtual-list';

import { Granularity, Range, RangeDates } from './types';

import {
  format,
  differenceInCalendarMonths,
  differenceInCalendarWeeks,
  addMonths,
  lastDayOfMonth,
} from 'date-fns';

const TODAY = new Date();

import DateTime from './DateTime';

const FIRST_VERTICAL_DATE = new Date(2000, 0, 1);

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

export interface DateStateRangePickerVerticalProps {
  selectedFrom: Date;
  selectedTo: Date;
  selectionLimits: RangeDates;
  highMode?: Granularity;
  onSelect: (date: Date) => void;
}

export default class DateStateRangePickerVertical extends Component<DateStateRangePickerVerticalProps> {

  render(): React.ReactNode {
    const { selectionLimits } = this.props;

    return (
      <div className="date-range__container">
        <VirtualList
          width={ 280 }
          height='100%'
          itemCount={ differenceInCalendarMonths(TODAY, FIRST_VERTICAL_DATE) + 1 }
          itemSize={ (index): number => calculateMonthHeight(index) }
          scrollOffset={ calculateMonthOffset(this.props.selectedFrom || TODAY) }
          renderItem={
            ({ index, style }): React.ReactElement => (
              <div key={ index } style={ style }>
                <DateTime
                  key={ format(addMonths(FIRST_VERTICAL_DATE, index), 'yyyy-MM-dd') }
                  canSelectFromDate={ selectionLimits[Range.FROM] }
                  canSelectToDate={ selectionLimits[Range.TO] }
                  selectedFromDate={ this.props.selectedFrom }
                  selectedToDate={ this.props.selectedTo }
                  onSelect={ this.props.onSelect }
                  value={ null }
                  highMode={ this.props.highMode || Granularity.DAY }
                  showingPageDate={ addMonths(FIRST_VERTICAL_DATE, index) }
                  onChangePage={ null }
                  hidePrevPageArrow
                  hideNextPageArrow
                  disableQuickSelect
                  disableWeekDays
                  mode={ Granularity.DAY }
                />
              </div>
            )
          }
        />
      </div>
    );
  }
}
