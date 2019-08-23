"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseDate = parseDate;
exports.isDateInRange = isDateInRange;
exports.makeWeekArray = makeWeekArray;

var _types = require("./types");

var _dateFns = require("date-fns");

var _sameDateFunctions;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var sameDateFunctions = (_sameDateFunctions = {}, _defineProperty(_sameDateFunctions, _types.Granularity.DAY, _dateFns.isSameDay), _defineProperty(_sameDateFunctions, _types.Granularity.MONTH, _dateFns.isSameMonth), _defineProperty(_sameDateFunctions, _types.Granularity.YEAR, _dateFns.isSameYear), _sameDateFunctions);
var parsingReq = /^(\d{4})-(\d{2})-(\d{2})$/;

function parseDate(date) {
  if (!date) {
    return null;
  }

  var _parsingReq$exec = parsingReq.exec(date),
      _parsingReq$exec2 = _slicedToArray(_parsingReq$exec, 4),
      year = _parsingReq$exec2[1],
      month = _parsingReq$exec2[2],
      day = _parsingReq$exec2[3];

  return new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
}

function isSameOfAfter(date, compareDate, granularity) {
  var sameDate = sameDateFunctions[granularity];
  return sameDate(date, compareDate) || (0, _dateFns.isAfter)(date, compareDate);
}

function isSameOrBefore(date, compareDate, granularity) {
  var sameDate = sameDateFunctions[granularity];
  return sameDate(date, compareDate) || (0, _dateFns.isBefore)(date, compareDate);
}

function isDateInRange(date, from, to, granularity) {
  if (from === null && to === null) {
    return true;
  }

  if (from === null && isSameOrBefore(date, to, granularity)) {
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

function makeWeekArray(current) {
  var result = [current];

  for (var i = 1; i < 7; i += 1) {
    result.push((0, _dateFns.addDays)(current, i));
  }

  return result;
}