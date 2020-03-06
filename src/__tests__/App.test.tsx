import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import App from '../App';

const resizeWindow = (width, height) => {
  Object.defineProperty(window, 'innerWidth', { value: width })
  Object.defineProperty(window, 'innerHeight', { value: height })
  window.dispatchEvent(new Event('resize'));
}

test('renders datepicker', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/All time/i);
  expect(linkElement).toBeInTheDocument();
});

test('renders desktop dropdown on click', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/All time/i);
  fireEvent.click(linkElement)
  const elements = document.getElementsByClassName('date-range--horizontal');
  expect(elements.length).toBe(1);
});

test('renders mobile dropdown on click', () => {
  const { getByText } = render(<App />);
  resizeWindow(500, 1000)
  const linkElement = getByText(/All time/i);
  fireEvent.click(linkElement)
  const elements = document.getElementsByClassName('date-range--vertical');
  expect(elements.length).toBe(1);
});
