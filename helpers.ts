import { Granularity, Week } from './types';

import {
  isSameMonth,
  isSameYear,
  isSameDay,
  isAfter,
  isBefore,
  addDays,
} from 'date-fns';

const sameDateFunctions = {
  [Granularity.DAY]: isSameDay,
  [Granularity.MONTH]: isSameMonth,
  [Granularity.YEAR]: isSameYear,
}

const parsingReq = /^(\d{4})-(\d{2})-(\d{2})$/;

export function parseDate(date: string): Date {
  if (!date) {
    return null;
  }

  const [, year, month, day] = parsingReq.exec(date);

  return new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
}

function isSameOfAfter(date: Date, compareDate: Date, granularity: Granularity) {
  const sameDate = sameDateFunctions[granularity];

  return sameDate(date, compareDate) || isAfter(date, compareDate);
}

function isSameOrBefore(date: Date, compareDate: Date, granularity: Granularity) {
  const sameDate = sameDateFunctions[granularity];

  return sameDate(date, compareDate) || isBefore(date, compareDate);
}

export function isDateInRange(date: Date, from: Date, to: Date, granularity: Granularity): boolean {
  if (from === null && to === null) {
    return true;
  }

  if (from === null && isSameOrBefore(date, to, granularity))  {
    return true;
  }

  if (to === null && isSameOfAfter(date, from, granularity)) {
    return true;
  }

  if (isSameOfAfter(date, from, granularity) && isSameOrBefore(date, to, granularity)) {
    return true;
  }

  return false;
}

export function makeWeekArray(current: Date): Week {
  const result: Week = [current];

  for (let i = 1; i < 7; i += 1) {
    result.push(addDays(current, i));
  }

  return result;
}
