import { Granularity, Week, Direction } from './types';

import {
  isSameMonth,
  isSameYear,
  isSameDay,
  isAfter,
  isBefore,
  addDays,
  subYears,
  getYear,
  addYears,
} from 'date-fns';

const sameDateFunctions = {
  [Granularity.DAY]: isSameDay,
  [Granularity.MONTH]: isSameMonth,
  [Granularity.YEAR]: isSameYear,
};

const parsingReq = /^(\d{4})-(\d{2})-(\d{2})$/;

export function parseDate(date: string): Date {
  if (!date) {
    return null;
  }

  const [, year, month, day] = parsingReq.exec(date);

  return new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
}

function isSameOfAfter(date: Date, compareDate: Date, granularity: Granularity): boolean {
  const sameDate = sameDateFunctions[granularity];

  return sameDate(date, compareDate) || isAfter(date, compareDate);
}

function isSameOrBefore(date: Date, compareDate: Date, granularity: Granularity): boolean {
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

export function getDirectionFromEvent(e: React.KeyboardEvent): Direction {
  switch (e.keyCode) {
    case 39:
      return Direction.RIGHT;
    case 37:
      return Direction.LEFT;
    case 38:
      return Direction.UP;
    case 40:
      return Direction.DOWN;
    default:
      return null;
  }
}

export function startOfDecade(current: Date): Date {
  const currentYear = getYear(current);

  return subYears(current, currentYear % 10);
}

export function isSameDecade(date: Date, decade: Date): boolean {
  const from = startOfDecade(decade);
  const to = addYears(from, 11);

  return isDateInRange(date, from, to, Granularity.YEAR);
}

export function nextModeUp(currentMode: Granularity): Granularity {
  const modesOrder = [Granularity.DAY, Granularity.MONTH, Granularity.YEAR];
  const currentIndex = modesOrder.indexOf(currentMode);

  if (currentIndex >= modesOrder.length - 1) {
    return;
  }

  return modesOrder[currentIndex + 1];
}

export function nextModeDown(currentMode: Granularity): Granularity {
  switch (currentMode) {
    case Granularity.MONTH:
      return Granularity.DAY;
    case Granularity.YEAR:
      return Granularity.MONTH;
    default:
      return Granularity.DAY;
  }
}

export function makeWeekArray(current: Date): Week {
  const result: Week = [current];

  for (let i = 1; i < 7; i += 1) {
    result.push(addDays(current, i));
  }

  return result;
}
