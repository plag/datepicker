declare module '*.svg'

export enum Granularity {
  DAY = 'day',
  MONTH = 'month',
  YEAR = 'year',
}

export enum Direction {
  UP = 'up',
  DOWN = 'down',
  LEFT = 'left',
  RIGHT = 'right',
}

export enum Modificator {
  ADD = 1,
  SUB = -1,
}

export interface OnSelect {
  (date: Date);
}

export interface OnHeaderClick {
  ();
}

export interface OnMonthSelect {
  (year: number, month: number);
}

export interface OnYearSelect {
  (year: number);
}

export interface OnChangePage {
  (date: Date);
}

export enum Range {
  FROM = 'from',
  TO = 'to',
}

export type RangeValue = {
  [Range.FROM]: string;
  [Range.TO]: string;
}

export type RangeDates = {
  [Range.FROM]: Date;
  [Range.TO]: Date;
}

export interface OnChange {
  (value: RangeValue);
}

export type Week = Date[];

