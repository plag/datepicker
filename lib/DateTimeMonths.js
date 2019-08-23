"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _arrow = _interopRequireDefault(require("./arrow"));

var _dateFns = require("date-fns");

var _types = require("./types");

var _helpers = require("./helpers");

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

var DateTimeMonths =
/*#__PURE__*/
function (_Component) {
  _inherits(DateTimeMonths, _Component);

  function DateTimeMonths(props) {
    var _this;

    _classCallCheck(this, DateTimeMonths);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(DateTimeMonths).call(this, props));

    _defineProperty(_assertThisInitialized(_this), "headerRef", void 0);

    _defineProperty(_assertThisInitialized(_this), "isInRange", function (date) {
      if (!_this.props.selectedFromDate || !_this.props.selectedToDate) {
        return false;
      }

      return (0, _helpers.isDateInRange)(date, _this.props.selectedFromDate, _this.props.selectedToDate, _types.Granularity.MONTH);
    });

    _defineProperty(_assertThisInitialized(_this), "handleHeaderClick", function () {
      _this.props.onHeaderClick();
    });

    _defineProperty(_assertThisInitialized(_this), "handleCellClick", function (e) {
      var year = e.target.getAttribute('data-year');
      var month = e.target.getAttribute('data-month');

      if (!year && !month) {
        return;
      }

      var date = new Date(year, month, 1, 0, 0, 0);

      if ((0, _helpers.isDateInRange)(date, _this.props.canSelectFromDate, _this.props.canSelectToDate, _types.Granularity.MONTH)) {
        _this.props.onSelect(parseInt(month, 10), parseInt(year, 10));
      }
    });

    _this.headerRef = _react.default.createRef();
    return _this;
  }

  _createClass(DateTimeMonths, [{
    key: "makeQuarterArray",
    value: function makeQuarterArray(current) {
      var result = [current];

      for (var i = 1; i < 4; i += 1) {
        result.push((0, _dateFns.addMonths)(current, i));
      }

      return result;
    }
  }, {
    key: "makeYearQuartersArray",
    value: function makeYearQuartersArray(current) {
      var quarters = [];
      var startYear = (0, _dateFns.getYear)(current);
      var iteratee = current;

      while (startYear === (0, _dateFns.getYear)(iteratee)) {
        quarters.push(this.makeQuarterArray(iteratee));
        iteratee = (0, _dateFns.addMonths)(iteratee, 4);
      }

      return quarters;
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var periodStartDate = (0, _dateFns.startOfYear)(this.props.showingPageDate);
      var headerTitle = (0, _dateFns.format)(periodStartDate, 'yyyy');
      var isCanNavigatePrev = this.isPrevButtonEnabled(periodStartDate);
      var isCanNavigateNext = this.isNextButtonEnabled(periodStartDate);
      return _react.default.createElement("div", {
        className: "rdtMonths"
      }, _react.default.createElement("table", null, _react.default.createElement("thead", null, _react.default.createElement("tr", null, _react.default.createElement("th", {
        className: (0, _classnames.default)('date-time__arrows date-time__arrows--prev', {
          'date-time__disabled': !isCanNavigatePrev
        }),
        onClick: isCanNavigatePrev ? this.handleNavigationClick.bind(this, _types.Modificator.SUB) : this.preventEvent
      }, _react.default.createElement(Svg, {
        src: _arrow.default
      })), _react.default.createElement("th", {
        ref: this.headerRef,
        className: "date-time__switch",
        colSpan: 2,
        "data-year": (0, _dateFns.getYear)(periodStartDate),
        onClick: this.handleHeaderClick
      }, headerTitle), _react.default.createElement("th", {
        className: (0, _classnames.default)('date-time__arrows date-time__arrows--next', {
          'date-time__disabled': !isCanNavigateNext
        }),
        onClick: isCanNavigateNext ? this.handleNavigationClick.bind(this, _types.Modificator.ADD) : this.preventEvent
      }, _react.default.createElement(Svg, {
        src: _arrow.default
      })))), _react.default.createElement("tbody", {
        onClick: this.handleCellClick
      }, this.makeYearQuartersArray(periodStartDate).map(function (quarter, index) {
        return _react.default.createElement("tr", {
          key: "quarter-".concat(index)
        }, quarter.map(function (month) {
          return _react.default.createElement("td", {
            key: (0, _dateFns.format)(month, 'yyyy-MM'),
            className: (0, _classnames.default)('date-time__month', {
              'date-time__disabled': !(0, _helpers.isDateInRange)(month, _this2.props.canSelectFromDate, _this2.props.canSelectToDate, _types.Granularity.MONTH),
              'date-time__month--current': _this2.props.selectedDate && (0, _dateFns.isSameMonth)(month, _this2.props.selectedDate),
              'date-time__month--in-range': _this2.isInRange(month)
            }),
            "data-year": (0, _dateFns.getYear)(month),
            "data-month": (0, _dateFns.getMonth)(month)
          }, (0, _dateFns.format)(month, 'MMM'));
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
      var prevYearDate = (0, _dateFns.endOfYear)((0, _dateFns.subYears)(startDate, 1));
      return (0, _helpers.isDateInRange)(prevYearDate, this.props.canSelectFromDate, this.props.canSelectToDate, _types.Granularity.MONTH);
    }
  }, {
    key: "isNextButtonEnabled",
    value: function isNextButtonEnabled(startDate) {
      var nextYearDate = (0, _dateFns.startOfYear)((0, _dateFns.addYears)(startDate, 1));
      return (0, _helpers.isDateInRange)(nextYearDate, this.props.canSelectFromDate, this.props.canSelectToDate, _types.Granularity.MONTH);
    }
  }, {
    key: "handleNavigationClick",
    value: function handleNavigationClick(modificator, e) {
      e.preventDefault();
      var currentYear = (0, _dateFns.startOfYear)(this.props.showingPageDate);

      switch (modificator) {
        case _types.Modificator.ADD:
          currentYear = (0, _dateFns.addYears)(currentYear, 1);
          break;

        case _types.Modificator.SUB:
          currentYear = (0, _dateFns.subYears)(currentYear, 1);
          break;
      }

      this.props.onChangePage(currentYear);
    }
  }]);

  return DateTimeMonths;
}(_react.Component);

var _default = DateTimeMonths;
exports.default = _default;