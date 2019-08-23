"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _Svg = _interopRequireDefault(require("../components/Svg"));

var _arrow = _interopRequireDefault(require("../icons/arrow.svg"));

var _helpers = require("./helpers");

var _types = require("./types");

var _dateFns = require("date-fns");

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

var DateTimeYears =
/*#__PURE__*/
function (_Component) {
  _inherits(DateTimeYears, _Component);

  function DateTimeYears() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, DateTimeYears);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(DateTimeYears)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_this), "isInRange", function (date) {
      if (!_this.props.selectedFromDate || !_this.props.selectedToDate) {
        return false;
      }

      return (0, _helpers.isDateInRange)(date, _this.props.selectedFromDate, _this.props.selectedToDate, _types.Granularity.YEAR);
    });

    _defineProperty(_assertThisInitialized(_this), "handleCellClick", function (e) {
      var year = e.target.getAttribute('data-value');

      if (!year) {
        return;
      }

      var date = new Date(year, 0, 1, 0, 0, 0);

      if ((0, _helpers.isDateInRange)(date, _this.props.canSelectFromDate, _this.props.canSelectToDate, _types.Granularity.YEAR)) {
        _this.props.onSelect(parseInt(year, 10));
      }
    });

    _defineProperty(_assertThisInitialized(_this), "handleHeaderClick", function () {
      _this.props.onHeaderClick();
    });

    return _this;
  }

  _createClass(DateTimeYears, [{
    key: "makeFourYearsArray",
    value: function makeFourYearsArray(current) {
      var result = [current];

      for (var i = 1; i < 4; i += 1) {
        result.push((0, _dateFns.addYears)(current, i));
      }

      return result;
    }
  }, {
    key: "makeDecadeYearsArray",
    value: function makeDecadeYearsArray(current) {
      var fourYearsArray = [];
      var lastYear = (0, _dateFns.getYear)(current) + 10;
      var iteratee = current;

      while (lastYear > (0, _dateFns.getYear)(iteratee)) {
        fourYearsArray.push(this.makeFourYearsArray(iteratee));
        iteratee = (0, _dateFns.addYears)(iteratee, 4);
      }

      return fourYearsArray;
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var startDecade = (0, _dateFns.subYears)(this.props.showingPageDate, (0, _dateFns.getYear)(this.props.showingPageDate) % 10 - 1);
      var startDate = (0, _dateFns.startOfYear)(startDecade);
      var headerTitle = "".concat((0, _dateFns.getYear)(startDate), "-").concat((0, _dateFns.getYear)(startDate) + 11);
      var isCanNavigatePrev = this.isPrevButtonEnabled(startDate);
      var isCanNavigateNext = this.isNextButtonEnabled(startDate);
      return _react.default.createElement("div", {
        className: "rdtYears"
      }, _react.default.createElement("table", null, _react.default.createElement("thead", null, _react.default.createElement("tr", null, _react.default.createElement("th", {
        className: (0, _classnames.default)('date-time__arrows date-time__arrows--prev', {
          'date-time__disabled': !isCanNavigatePrev
        }),
        onClick: isCanNavigatePrev ? this.handleNavigationClick.bind(this, -1) : this.preventEvent
      }, _react.default.createElement(_Svg.default, {
        src: _arrow.default
      })), _react.default.createElement("th", {
        className: "date-time__switch",
        colSpan: 2,
        onClick: this.handleHeaderClick
      }, headerTitle), _react.default.createElement("th", {
        className: (0, _classnames.default)('date-time__arrows date-time__arrows--next', {
          'date-time__disabled': !isCanNavigateNext
        }),
        onClick: isCanNavigateNext ? this.handleNavigationClick.bind(this, 1) : this.preventEvent
      }, _react.default.createElement(_Svg.default, {
        src: _arrow.default
      })))), _react.default.createElement("tbody", {
        onClick: this.handleCellClick
      }, this.makeDecadeYearsArray(startDate).map(function (fourYears, index) {
        return _react.default.createElement("tr", {
          key: "year-".concat(index)
        }, fourYears.map(function (year) {
          return _react.default.createElement("td", {
            key: (0, _dateFns.format)(year, 'YYYY'),
            className: (0, _classnames.default)('date-time__year', {
              'date-time__disabled': !(0, _helpers.isDateInRange)(year, _this2.props.canSelectFromDate, _this2.props.canSelectToDate, _types.Granularity.YEAR),
              'date-time__year--current': (0, _dateFns.isSameYear)(year, _this2.props.selectedDate),
              'date-time__year--in-range': _this2.isInRange(year)
            }),
            "data-value": (0, _dateFns.getYear)(year)
          }, (0, _dateFns.format)(year, 'YYYY'));
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
      var prevDecadeYear = (0, _dateFns.endOfYear)((0, _dateFns.subYears)(startDate, 1));
      return (0, _helpers.isDateInRange)(prevDecadeYear, this.props.canSelectFromDate, this.props.canSelectToDate, _types.Granularity.YEAR);
    }
  }, {
    key: "isNextButtonEnabled",
    value: function isNextButtonEnabled(startDate) {
      var nextDecadeYear = (0, _dateFns.startOfYear)((0, _dateFns.addYears)(startDate, 10));
      return (0, _helpers.isDateInRange)(nextDecadeYear, this.props.canSelectFromDate, this.props.canSelectToDate, _types.Granularity.YEAR);
    }
  }, {
    key: "handleNavigationClick",
    value: function handleNavigationClick(modificator, e) {
      e.preventDefault();
      var currentYear = (0, _dateFns.startOfYear)(this.props.showingPageDate);

      switch (modificator) {
        case _types.Modificator.ADD:
          currentYear = (0, _dateFns.addYears)(currentYear, 10);
          break;

        case _types.Modificator.SUB:
          currentYear = (0, _dateFns.subYears)(currentYear, 10);
          break;
      }

      this.props.onChangePage(currentYear);
    }
  }]);

  return DateTimeYears;
}(_react.Component);

var _default = DateTimeYears;
exports.default = _default;