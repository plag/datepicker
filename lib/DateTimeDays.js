"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _arrow = _interopRequireDefault(require("./arrow"));

var _helpers = require("./helpers");

var _dateFns = require("date-fns");

var _types = require("./types");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var DateTimeDays =
/*#__PURE__*/
function (_Component) {
  _inherits(DateTimeDays, _Component);

  function DateTimeDays(props) {
    var _this;

    _classCallCheck(this, DateTimeDays);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(DateTimeDays).call(this, props));

    _defineProperty(_assertThisInitialized(_this), "headerRef", void 0);

    _defineProperty(_assertThisInitialized(_this), "isInRange", function (date) {
      if (!_this.props.selectedFromDate || !_this.props.selectedToDate) {
        return false;
      }

      return (0, _helpers.isDateInRange)(date, _this.props.selectedFromDate, _this.props.selectedToDate, _types.Granularity.DAY);
    });

    _defineProperty(_assertThisInitialized(_this), "isFirstDateInRange", function (date) {
      if (!_this.props.selectedFromDate) {
        return false;
      }

      return (0, _dateFns.isSameDay)(date, _this.props.selectedFromDate);
    });

    _defineProperty(_assertThisInitialized(_this), "isLastDateInRange", function (date) {
      if (!_this.props.selectedToDate) {
        return false;
      }

      return (0, _dateFns.isSameDay)(date, _this.props.selectedToDate);
    });

    _defineProperty(_assertThisInitialized(_this), "handleHeaderClick", function () {
      _this.props.onHeaderClick();
    });

    _defineProperty(_assertThisInitialized(_this), "handleCellClick", function (e) {
      var value = e.target.getAttribute('data-value');

      if (!value) {
        return;
      }

      var date = (0, _helpers.parseDate)(value);

      if ((0, _helpers.isDateInRange)(date, _this.props.canSelectFromDate, _this.props.canSelectToDate, _types.Granularity.DAY)) {
        _this.props.onSelectDate(date);
      }
    });

    _this.headerRef = _react.default.createRef();
    return _this;
  }

  _createClass(DateTimeDays, [{
    key: "makeMonthWeeksArray",
    value: function makeMonthWeeksArray(current) {
      var weeks = [];
      var startMonth = (0, _dateFns.getMonth)(current);
      var startYear = (0, _dateFns.getYear)(current);
      var iteratee = (0, _dateFns.startOfWeek)(current, {
        weekStartsOn: 1
      });

      while ((0, _dateFns.getMonth)(iteratee) <= startMonth || startMonth === 0 && (0, _dateFns.getMonth)(iteratee) === 11) {
        weeks.push((0, _helpers.makeWeekArray)(iteratee));
        iteratee = (0, _dateFns.addDays)(iteratee, 7);

        if ((0, _dateFns.getYear)(iteratee) > startYear) {
          break;
        }
      }

      return weeks;
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var periodStartDate = (0, _dateFns.startOfMonth)(this.props.showingPageDate);
      var headerTitle = (0, _dateFns.format)(periodStartDate, 'MMMM, YYYY');
      var isCanNavigatePrev = this.isPrevButtonEnabled(periodStartDate);
      var isCanNavigateNext = this.isNextButtonEnabled(periodStartDate);
      return _react.default.createElement("div", {
        className: "date-time__days"
      }, _react.default.createElement("table", null, _react.default.createElement("thead", null, _react.default.createElement("tr", null, _react.default.createElement("th", {
        className: (0, _classnames.default)('date-time__arrows date-time__arrows--prev', {
          'date-time__disabled': !isCanNavigatePrev
        }),
        onClick: isCanNavigatePrev && !this.props.hidePrevPageArrow ? this.handleNavigationClick.bind(this, _types.Modificator.SUB) : this.preventEvent
      }, !this.props.hidePrevPageArrow && _react.default.createElement(Svg, {
        src: _arrow.default
      })), _react.default.createElement("th", {
        ref: this.headerRef,
        className: "date-time__switch",
        colSpan: 5,
        "data-year": (0, _dateFns.getYear)(periodStartDate),
        "data-month": (0, _dateFns.getMonth)(periodStartDate),
        onClick: this.handleHeaderClick
      }, headerTitle), _react.default.createElement("th", {
        className: (0, _classnames.default)('date-time__arrows date-time__arrows--next', {
          'date-time__disabled': !isCanNavigateNext
        }),
        onClick: isCanNavigateNext && !this.props.hideNextPageArrow ? this.handleNavigationClick.bind(this, _types.Modificator.ADD) : this.preventEvent
      }, !this.props.hideNextPageArrow && _react.default.createElement(Svg, {
        src: _arrow.default
      }))), _react.default.createElement("tr", null, !this.props.disableWeekDays && (0, _helpers.makeWeekArray)((0, _dateFns.startOfWeek)(periodStartDate, {
        weekStartsOn: 1
      })).map(function (day) {
        return _react.default.createElement("th", {
          className: "date-time__week-day",
          key: (0, _dateFns.format)(day, 'dd')
        }, (0, _dateFns.format)(day, 'dd'));
      }))), _react.default.createElement("tbody", {
        onClick: this.handleCellClick
      }, this.makeMonthWeeksArray(periodStartDate).map(function (week, index) {
        return _react.default.createElement("tr", {
          key: "week-".concat(index)
        }, week.map(function (day) {
          return (0, _dateFns.isSameMonth)(day, periodStartDate) ? _react.default.createElement("td", {
            key: (0, _dateFns.format)(day, 'YYYY-MM-DD'),
            "data-value": (0, _dateFns.format)(day, 'YYYY-MM-DD'),
            className: (0, _classnames.default)('date-time__day', {
              'date-time__disabled': !(0, _helpers.isDateInRange)(day, _this2.props.canSelectFromDate, _this2.props.canSelectToDate, _types.Granularity.DAY),
              'date-time__day--current': _this2.props.selectedDate && (0, _dateFns.isSameDay)(day, _this2.props.selectedDate),
              'date-time__day--in-range': _this2.isInRange(day),
              'date-time__day--first-date': _this2.isFirstDateInRange(day),
              'date-time__day--last-date': _this2.isLastDateInRange(day),
              'date-time__day--preselect': _this2.isFirstDateInRange(day) && _this2.props.selectedFromDate && !_this2.props.selectedToDate,
              'date-time__day--today': (0, _dateFns.isToday)(day)
            })
          }, (0, _dateFns.format)(day, 'D'), (0, _dateFns.isToday)(day) && _react.default.createElement("div", {
            className: "date-time__today-label"
          }, "Today"), " ") : _react.default.createElement("td", {
            key: (0, _dateFns.format)(day, 'YYYY-MM-DD')
          }, "\xA0");
        }));
      }))));
    }
  }, {
    key: "preventEvent",
    value: function preventEvent(e) {
      e.preventDefault();
    }
  }, {
    key: "isPrevButtonEnabled",
    value: function isPrevButtonEnabled(startDate) {
      var prevMonthDate = (0, _dateFns.endOfMonth)((0, _dateFns.subMonths)(startDate, 1));
      return (0, _helpers.isDateInRange)(prevMonthDate, this.props.canSelectFromDate, this.props.canSelectToDate, _types.Granularity.DAY);
    }
  }, {
    key: "isNextButtonEnabled",
    value: function isNextButtonEnabled(startDate) {
      var nextMonthDate = (0, _dateFns.startOfMonth)((0, _dateFns.addMonths)(startDate, 1));
      return (0, _helpers.isDateInRange)(nextMonthDate, this.props.canSelectFromDate, this.props.canSelectToDate, _types.Granularity.DAY);
    }
  }, {
    key: "handleNavigationClick",
    value: function handleNavigationClick(modificator, e) {
      e.preventDefault();
      var currentDate = (0, _dateFns.startOfMonth)(this.props.showingPageDate);

      switch (modificator) {
        case _types.Modificator.ADD:
          currentDate = (0, _dateFns.addMonths)(currentDate, 1);
          break;

        case _types.Modificator.SUB:
          currentDate = (0, _dateFns.subMonths)(currentDate, 1);
          break;
      }

      this.props.onChangePage(currentDate);
    }
  }]);

  return DateTimeDays;
}(_react.Component);

var _default = DateTimeDays;
exports.default = _default;