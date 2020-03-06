import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import DateRangePicker from '../DateRangePicker';
import format from 'date-fns/format';
import subDays from 'date-fns/subDays';
import setDate from 'date-fns/setDate';
import parse from 'date-fns/parse';
import addDays from 'date-fns/addDays';
import subMonths from 'date-fns/subMonths';
import addMonths from 'date-fns/addMonths';
import getMonth from 'date-fns/getMonth';
import getYear from 'date-fns/getYear';
import getDate from 'date-fns/getDate';
import addYears from 'date-fns/addYears';
import subYears from 'date-fns/subYears';

test('renders datepicker all time', () => {
  const { getByText } = render(
    <DateRangePicker
      value={ null }
      onChange={ () => {} }
    />
  );
  const linkElement = getByText(/All time/i);
  expect(linkElement).toBeInTheDocument();
});

test('renders datepicker last 7 days', () => {
  const value = {
    from: format(subDays(new Date(), 7), 'yyyy-MM-dd'),
    to: format(new Date(), 'yyyy-MM-dd'),
  }

  const { getByText } = render(
    <DateRangePicker
      value={ value }
      onChange={ () => {} }
    />
  );
  const linkElement = getByText(/Last 7 days/i);
  expect(linkElement).toBeInTheDocument();
});

test('renders datepicker today', () => {
  const today = format(new Date(), 'yyyy-MM-dd');
  const value = {
    from: today,
    to: today,
  }

  const { getByText } = render(
    <DateRangePicker
      value={ value }
      onChange={ () => {} }
    />
  );
  const linkElement = getByText(/Today/i);
  expect(linkElement).toBeInTheDocument();
});

test('renders datepicker yesterday', () => {
  const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');
  const value = {
    from: yesterday,
    to: yesterday,
  }

  const { getByText } = render(
    <DateRangePicker
      value={ value }
      onChange={ () => {} }
    />
  );
  const linkElement = getByText(/Yesterday/i);
  expect(linkElement).toBeInTheDocument();
});

test('renders datepicker last 30 days', () => {
  const from = format(subDays(new Date(), 30), 'yyyy-MM-dd');
  const to = format(new Date(), 'yyyy-MM-dd');
  const value = {
    from,
    to,
  }

  const { getByText } = render(
    <DateRangePicker
      value={ value }
      onChange={ () => {} }
    />
  );
  const linkElement = getByText(/Last 30 days/i);
  expect(linkElement).toBeInTheDocument();
});

test('renders datepicker last month', () => {
  const from = format(setDate(new Date(), 1), 'yyyy-MM-dd');
  const to = format(new Date(), 'yyyy-MM-dd');
  const value = {
    from,
    to,
  }

  const { getByText } = render(
    <DateRangePicker
      value={ value }
      onChange={ () => {} }
    />
  );
  const linkElement = getByText(/Last month/i);
  expect(linkElement).toBeInTheDocument();
});

test('renders two last monthes', () => {
  const { getByText } = render(
    <DateRangePicker
      value={ null }
      onChange={ () => {} }
    />
  );
  const linkElement = getByText(/All time/i);
  fireEvent.click(linkElement)
  const firstMonth = getByText(/December, 2019/i);
  expect(firstMonth).toBeInTheDocument();
  const secondMonth = getByText(/January, 2020/i);
  expect(secondMonth).toBeInTheDocument();
});

test('block dates', () => {
  const date = parse('2020-01-15', 'yyyy-MM-dd', new Date())

  const from = format(subDays(date, 7), 'yyyy-MM-dd');
  const to = format(date, 'yyyy-MM-dd');

  const { getByText } = render(
    <DateRangePicker
      value={ null }
      onChange={ () => {} }
      from={ from }
      to={ to }
    />
  );
  const linkElement = getByText(/All time/i);
  fireEvent.click(linkElement)

  const prevDate = format(subDays(date, 8), 'yyyy-MM-dd');
  const prevDateElement = document.querySelectorAll(`[data-value='${ prevDate }']`)

  expect(prevDateElement[0]).toHaveClass('date-time__disabled');

  const postDate = format(addDays(date, 1), 'yyyy-MM-dd');
  const postDateElement = document.querySelectorAll(`[data-value='${ postDate }']`)

  expect(postDateElement[0]).toHaveClass('date-time__disabled');
});

test('render right month name', () => {
  const { getByText } = render(
    <DateRangePicker
      value={ null }
      onChange={ () => {} }
    />
  );
  const linkElement = getByText(/All time/i);
  fireEvent.click(linkElement)

  const prevMonth = format(subMonths(new Date(), 1), 'MMMM, yyyy');
  const currentMonth = format(new Date(), 'MMMM, yyyy');

  const months = document.querySelectorAll(".date-time__switch")

  expect(months[0]).toHaveTextContent(prevMonth)
  expect(months[1]).toHaveTextContent(currentMonth)
});

test('can select next months', () => {
  const { getByText } = render(
    <DateRangePicker
      value={ null }
      onChange={ () => {} }
    />
  );
  const linkElement = getByText(/All time/i);
  fireEvent.click(linkElement)

  const nextMonthButton = document.querySelectorAll(".date-time__arrows--next")
  fireEvent.click(nextMonthButton[1]); // first - prev month without arrow

  const currentMonth = format(new Date(), 'MMMM, yyyy');
  const nextMonth = format(addMonths(new Date(), 1), 'MMMM, yyyy');

  const months = document.querySelectorAll(".date-time__switch")

  expect(months[0]).toHaveTextContent(currentMonth)
  expect(months[1]).toHaveTextContent(nextMonth)
});

test('can select prev months', () => {
  const { getByText } = render(
    <DateRangePicker
      value={ null }
      onChange={ () => {} }
    />
  );
  const linkElement = getByText(/All time/i);
  fireEvent.click(linkElement)

  const nextMonthButton = document.querySelectorAll(".date-time__arrows--prev")
  fireEvent.click(nextMonthButton[0]);

  const monthAgo = format(subMonths(new Date(), 1), 'MMMM, yyyy');
  const twoMonthsAgo = format(subMonths(new Date(), 2), 'MMMM, yyyy');

  const months = document.querySelectorAll(".date-time__switch")

  expect(months[0]).toHaveTextContent(twoMonthsAgo)
  expect(months[1]).toHaveTextContent(monthAgo)
});

test('can select days in this month', () => {
  const { getByText } = render(
    <DateRangePicker
      value={ null }
      onChange={ () => {} }
    />
  );
  const linkElement = getByText(/All time/i);
  fireEvent.click(linkElement)

  const firstDate = setDate(new Date(), 1);
  const lastDate = setDate(new Date(), 10);

  const firstDateAttributeValue = format(firstDate, 'yyyy-MM-dd');
  const firstDayCell = document.querySelectorAll(`[data-value='${ firstDateAttributeValue }']`)
  const lastDateAttributeValue = format(lastDate, 'yyyy-MM-dd');
  const lastDayCell = document.querySelectorAll(`[data-value='${ lastDateAttributeValue }']`)

  fireEvent.click(firstDayCell[0]);
  fireEvent.click(lastDayCell[0]);

  const selectedDates = document.querySelectorAll('.date-range__selected-dates')
  const expectedFirstDateText = format(firstDate, 'dd MMM yyyy')
  const expectedLastDateText = format(lastDate, 'dd MMM yyyy')

  expect(selectedDates[0]).toHaveTextContent(`${ expectedFirstDateText } — ${ expectedLastDateText }`);
});

test('can change mode to months', () => {
  const { getByText } = render(
    <DateRangePicker
      value={ null }
      onChange={ () => {} }
    />
  );
  const linkElement = getByText(/All time/i);
  fireEvent.click(linkElement)

  const currentMonth = format(new Date(), 'MMMM, yyyy');

  const monthHeaderElement = getByText(currentMonth);
  fireEvent.click(monthHeaderElement)

  const monthsElements = document.querySelectorAll(".date-time__month")

  expect(monthsElements).not.toBeNull();
});

test('can select month', () => {
  const { getByText } = render(
    <DateRangePicker
      value={ null }
      onChange={ () => {} }
    />
  );

  const linkElement = getByText(/All time/i);
  fireEvent.click(linkElement)

  const now = new Date();

  const currentMonth = format(now, 'MMMM, yyyy');
  const monthHeaderElement = getByText(currentMonth);
  fireEvent.click(monthHeaderElement)

  const currentMonthIndex = getMonth(now);
  const anotherMonthIndex = (currentMonthIndex + 1) % 12;
  const anotherMonthElement = document.querySelectorAll(`[data-month='${ anotherMonthIndex }']`)

  fireEvent.click(anotherMonthElement[0])

  const months = document.querySelectorAll(".date-time__switch")

  const nextMonthDate = new Date(getYear(now), anotherMonthIndex, getDate(now));
  const nextMonthLabel = format(nextMonthDate, 'MMMM, yyyy');

  expect(months[1]).toHaveTextContent(nextMonthLabel)
});

test('can select next years', () => {
  const { getByText } = render(
    <DateRangePicker
      value={ null }
      onChange={ () => {} }
    />
  );
  const linkElement = getByText(/All time/i);
  fireEvent.click(linkElement)

  const now = new Date();

  const currentMonth = format(now, 'MMMM, yyyy');
  const monthHeaderElement = getByText(currentMonth);
  fireEvent.click(monthHeaderElement)

  const nextMonthButton = document.querySelectorAll(".date-time__arrows--next")
  fireEvent.click(nextMonthButton[1]); // first - prev month without arrow

  const nextYear = format(addYears(new Date(), 1), 'yyyy');

  const switches = document.querySelectorAll(".date-time__switch")
  expect(switches[1]).toHaveTextContent(nextYear)
});

test('can select prev years', () => {
  const { getByText } = render(
    <DateRangePicker
      value={ null }
      onChange={ () => {} }
    />
  );
  const linkElement = getByText(/All time/i);
  fireEvent.click(linkElement)

  const now = new Date();

  const currentMonth = format(now, 'MMMM, yyyy');
  const monthHeaderElement = getByText(currentMonth);
  fireEvent.click(monthHeaderElement)

  const nextMonthButton = document.querySelectorAll(".date-time__arrows--prev")
  fireEvent.click(nextMonthButton[1]); // first - prev month without arrow

  const prevYear = format(subYears(new Date(), 1), 'yyyy');

  const switches = document.querySelectorAll(".date-time__switch")
  expect(switches[1]).toHaveTextContent(prevYear)
});

test('can change mode to years', () => {
  const { getByText } = render(
    <DateRangePicker
      value={ null }
      onChange={ () => {} }
    />
  );
  const linkElement = getByText(/All time/i);
  fireEvent.click(linkElement)

  const currentMonth = format(new Date(), 'MMMM, yyyy');

  const monthHeaderElement = getByText(currentMonth);
  fireEvent.click(monthHeaderElement)

  const currentYear = format(new Date(), 'yyyy');

  const currentYearElement = getByText(currentYear);
  fireEvent.click(currentYearElement)

  const yearsElements = document.querySelectorAll(".date-time__year")

  expect(yearsElements).not.toBeNull();
});

test('can select year', () => {
  const { getByText } = render(
    <DateRangePicker
      value={ null }
      onChange={ () => {} }
    />
  );

  const linkElement = getByText(/All time/i);
  fireEvent.click(linkElement)

  const date = new Date(2020, 0, 15);

  const currentMonth = format(date, 'MMMM, yyyy');
  const monthHeaderElement = getByText(currentMonth);
  fireEvent.click(monthHeaderElement)

  const currentYear = format(new Date(), 'yyyy');

  const yearHeaderElement = getByText(currentYear);
  fireEvent.click(yearHeaderElement)

  const anotherYearElement = document.querySelectorAll(`[data-value='2021']`)
  fireEvent.click(anotherYearElement[0])

  const years = document.querySelectorAll(".date-time__switch")
  expect(years[1]).toHaveTextContent('2021')
});


test('can select next decade', () => {
  const { getByText } = render(
    <DateRangePicker
      value={ null }
      onChange={ () => {} }
    />
  );
  const linkElement = getByText(/All time/i);
  fireEvent.click(linkElement)

  const now = new Date();

  const currentMonth = format(now, 'MMMM, yyyy');
  const monthHeaderElement = getByText(currentMonth);
  fireEvent.click(monthHeaderElement)

  const currentYear = format(new Date(), 'yyyy');

  const currentYearElement = getByText(currentYear);
  fireEvent.click(currentYearElement)

  const nextDecadeButton = document.querySelectorAll(".date-time__arrows--next")
  fireEvent.click(nextDecadeButton[1]); // first - prev month without arrow

  const nextDecade = addYears(now, 10);
  const nextDecadeStart = subYears(nextDecade, getYear(nextDecade) % 10 - 1)
  const nextDecadeEnd = addYears(nextDecade, 12);

  const startDecadeLabel = format(nextDecadeStart, 'yyyy');
  const endDecadeLabel = format(nextDecadeEnd, 'yyyy');

  const switches = document.querySelectorAll(".date-time__switch")
  expect(switches[1]).toHaveTextContent(`${ startDecadeLabel }-${ endDecadeLabel }`)
});

test('can select prev decade', () => {
  const { getByText } = render(
    <DateRangePicker
      value={ null }
      onChange={ () => {} }
    />
  );
  const linkElement = getByText(/All time/i);
  fireEvent.click(linkElement)

  const now = new Date();

  const currentMonth = format(now, 'MMMM, yyyy');
  const monthHeaderElement = getByText(currentMonth);
  fireEvent.click(monthHeaderElement)

  const currentYear = format(new Date(), 'yyyy');

  const currentYearElement = getByText(currentYear);
  fireEvent.click(currentYearElement)

  const prevDecadeButton = document.querySelectorAll(".date-time__arrows--prev")
  fireEvent.click(prevDecadeButton[1]); // first - prev month without arrow

  const prevDecade = subYears(now, 10);
  const prevDecadeStart = subYears(prevDecade, getYear(prevDecade) % 10 - 1)
  const prevDecadeEnd = addYears(prevDecade, 12);

  const startDecadeLabel = format(prevDecadeStart, 'yyyy');
  const endDecadeLabel = format(prevDecadeEnd, 'yyyy');

  const switches = document.querySelectorAll(".date-time__switch")
  expect(switches[1]).toHaveTextContent(`${ startDecadeLabel }-${ endDecadeLabel }`)
});
