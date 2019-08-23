"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.DATE_FORMAT = void 0;

var _react = _interopRequireWildcard(require("react"));

var _DateTimeDays = _interopRequireDefault(require("./DateTimeDays"));

var _DateTimeMonths = _interopRequireDefault(require("./DateTimeMonths"));

var _DateTimeYears = _interopRequireDefault(require("./DateTimeYears"));

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

var DATE_FORMAT = 'yyyy-MM-dd';
exports.DATE_FORMAT = DATE_FORMAT;

var DateTimeComponent =
/*#__PURE__*/
function (_Component) {
  _inherits(DateTimeComponent, _Component);

  function DateTimeComponent(props) {
    var _this;

    _classCallCheck(this, DateTimeComponent);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(DateTimeComponent).call(this, props));

    _defineProperty(_assertThisInitialized(_this), "changeInternalPage", function (internalPage) {
      _this.setState({
        internalPage: internalPage
      });
    });

    _defineProperty(_assertThisInitialized(_this), "handleHeaderClick", function () {
      if (_this.props.disableQuickSelect) {
        return;
      }

      var modesOrder = [_types.Granularity.DAY, _types.Granularity.MONTH, _types.Granularity.YEAR];
      var currentIndex = modesOrder.indexOf(_this.state.mode);

      if (currentIndex >= modesOrder.length - 1) {
        return;
      }

      var nextMode = modesOrder[currentIndex + 1];

      _this.setState({
        mode: nextMode,
        internalPage: nextMode !== _types.Granularity.DAY ? _this.props.showingPageDate : null
      });
    });

    _defineProperty(_assertThisInitialized(_this), "handleDateSelect", function (date) {
      _this.props.onSelect(date);
    });

    _defineProperty(_assertThisInitialized(_this), "handleMonthSelect", function (selectedMonth, selectedYear) {
      var month = new Date(selectedYear, selectedMonth, 1);

      if (_this.props.highMode === _types.Granularity.MONTH) {
        _this.props.onSelect(month);

        return;
      }

      _this.setState({
        mode: _types.Granularity.DAY
      });

      _this.props.onChangePage(month);
    });

    _defineProperty(_assertThisInitialized(_this), "handleYearSelect", function (selectedYear) {
      var year = new Date(selectedYear, 0, 1);

      if (_this.props.highMode === _types.Granularity.YEAR) {
        _this.props.onSelect(year);

        return;
      }

      _this.setState({
        mode: _types.Granularity.MONTH
      });

      _this.changeInternalPage(year);
    });

    _this.state = {
      mode: props.highMode || _types.Granularity.DAY,
      internalPage: null
    };
    return _this;
  }

  _createClass(DateTimeComponent, [{
    key: "renderDays",
    value: function renderDays() {
      return _react.default.createElement(_DateTimeDays.default, {
        showingPageDate: this.props.showingPageDate,
        onChangePage: this.props.onChangePage,
        onHeaderClick: this.handleHeaderClick,
        onSelectDate: this.handleDateSelect,
        selectedDate: this.props.value,
        selectedFromDate: this.props.selectedFromDate,
        selectedToDate: this.props.selectedToDate,
        canSelectFromDate: this.props.canSelectFromDate,
        canSelectToDate: this.props.canSelectToDate,
        hideNextPageArrow: this.props.hideNextPageArrow,
        hidePrevPageArrow: this.props.hidePrevPageArrow,
        disableWeekDays: this.props.disableWeekDays
      });
    }
  }, {
    key: "renderMonths",
    value: function renderMonths() {
      return _react.default.createElement(_DateTimeMonths.default, {
        showingPageDate: this.state.internalPage,
        onChangePage: this.changeInternalPage,
        onHeaderClick: this.handleHeaderClick,
        onSelect: this.handleMonthSelect,
        selectedDate: this.props.value,
        selectedFromDate: this.props.selectedFromDate,
        selectedToDate: this.props.selectedToDate,
        canSelectFromDate: this.props.canSelectFromDate,
        canSelectToDate: this.props.canSelectToDate
      });
    }
  }, {
    key: "renderYears",
    value: function renderYears() {
      return _react.default.createElement(_DateTimeYears.default, {
        showingPageDate: this.state.internalPage,
        onChangePage: this.changeInternalPage,
        onHeaderClick: this.handleHeaderClick,
        onSelect: this.handleYearSelect,
        selectedDate: this.props.value,
        selectedFromDate: this.props.selectedFromDate,
        selectedToDate: this.props.selectedToDate,
        canSelectFromDate: this.props.canSelectFromDate,
        canSelectToDate: this.props.canSelectToDate
      });
    }
  }, {
    key: "renderPickerByMode",
    value: function renderPickerByMode(mode) {
      switch (mode) {
        case _types.Granularity.DAY:
          return this.renderDays();

        case _types.Granularity.MONTH:
          return this.renderMonths();

        case _types.Granularity.YEAR:
          return this.renderYears();
      }
    }
  }, {
    key: "render",
    value: function render() {
      return _react.default.createElement("div", {
        className: "date-time"
      }, this.renderPickerByMode(this.state.mode));
    }
  }]);

  return DateTimeComponent;
}(_react.Component);

var _default = DateTimeComponent;
exports.default = _default;