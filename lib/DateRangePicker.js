"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactTinyVirtualList = _interopRequireDefault(require("react-tiny-virtual-list"));

var _classnames = _interopRequireDefault(require("classnames"));

var _helpers = require("./helpers");

var _types = require("./types");

var _Modal = _interopRequireDefault(require("../components/modal/Modal"));

var _dateFns = require("date-fns");

var _DateTime = _interopRequireWildcard(require("./DateTime"));

var _DateRangePresets = _interopRequireWildcard(require("../components/form/date-time/DateRangePresets"));

var _util = require("util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var USER_FORMAT = 'DD MMM YYYY';
var TODAY = new Date();
var FIRST_VERTICAL_DATE = new Date(2000, 0, 1);

function calculateMonthHeight(index) {
  var monthDate = (0, _dateFns.addMonths)(FIRST_VERTICAL_DATE, index);
  var lastDay = (0, _dateFns.lastDayOfMonth)(monthDate);
  var weeksCount = (0, _dateFns.differenceInCalendarWeeks)(lastDay, monthDate, {
    weekStartsOn: 1
  }) + 1;
  return weeksCount * 40 + 45; // ROW height + Header height
}

function calculateMonthOffset(date) {
  var monthIndex = (0, _dateFns.differenceInCalendarMonths)(date, FIRST_VERTICAL_DATE);
  var result = 0;

  for (var i = 0; i < monthIndex; i += 1) {
    result += calculateMonthHeight(i);
  }

  return result;
}

function prepareShowingPages(currentPage) {
  return [(0, _dateFns.subMonths)(currentPage, 1), currentPage];
}

function modifyShowingPages(index, page, showingPages) {
  var change = (0, _dateFns.differenceInCalendarMonths)(page, showingPages[index]);
  var result = showingPages.map(function (page) {
    return (0, _dateFns.addMonths)(page, change);
  });
  return result;
}

function prepareState(props) {
  var parsedFrom = props.value ? (0, _helpers.parseDate)(props.value.from) : null;
  var parsedTo = props.value ? (0, _helpers.parseDate)(props.value.to) : null;
  return {
    selectedFrom: parsedFrom,
    selectedTo: parsedTo,
    showingPages: prepareShowingPages(parsedTo ? parsedTo : TODAY),
    prevValue: props.value,
    selectionMode: _types.Range.FROM
  };
}

var DateStateRangePicker =
/*#__PURE__*/
function (_Component) {
  _inherits(DateStateRangePicker, _Component);

  function DateStateRangePicker(props) {
    var _this;

    _classCallCheck(this, DateStateRangePicker);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(DateStateRangePicker).call(this, props));

    _defineProperty(_assertThisInitialized(_this), "containerRef", void 0);

    _defineProperty(_assertThisInitialized(_this), "componentRef", void 0);

    _defineProperty(_assertThisInitialized(_this), "toggleDatePicker", function () {
      if (!_this.state.isShowDatePicker) {
        _this.showDatePicker();
      } else {
        _this.hideDatePicker();
      }
    });

    _defineProperty(_assertThisInitialized(_this), "handleOutsideClick", function (e) {
      var clickInComponent = _this.containerRef.current.contains(e.target);

      if (clickInComponent) {
        return;
      }

      if (!_this.state.selectedFrom || !_this.state.selectedTo) {
        _this.restoreValue();
      }

      _this.hideDatePicker();
    });

    _defineProperty(_assertThisInitialized(_this), "handleChangePreset", function (value) {
      _this.hideDatePicker();

      _this.props.onChange(value);
    });

    _defineProperty(_assertThisInitialized(_this), "handleChangePage", function (index, pageDate) {
      _this.setState(function (state) {
        return {
          showingPages: modifyShowingPages(index, pageDate, state.showingPages)
        };
      });
    });

    _defineProperty(_assertThisInitialized(_this), "handleDateSelect", function (value) {
      if (_this.state.selectionMode === _types.Range.FROM) {
        _this.setState({
          selectedFrom: value,
          selectedTo: null,
          selectionMode: _types.Range.TO
        });
      }

      if (_this.state.selectionMode === _types.Range.TO) {
        _this.setState({
          selectedTo: value,
          selectionMode: _types.Range.FROM
        });

        var result = {
          from: (0, _dateFns.format)(_this.state.selectedFrom, _DateTime.DATE_FORMAT),
          to: (0, _dateFns.format)(value, _DateTime.DATE_FORMAT)
        };

        _this.props.onChange(result);

        _this.hideDatePicker();
      }
    });

    _this.state = _objectSpread({}, prepareState(props), {
      isShowDatePicker: false
    });
    _this.containerRef = _react.default.createRef();
    _this.componentRef = _react.default.createRef();
    return _this;
  }

  _createClass(DateStateRangePicker, [{
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      document.removeEventListener('click', this.handleOutsideClick, true);
    }
  }, {
    key: "getCanSelectFrom",
    value: function getCanSelectFrom(canSelectFrom, selectedFrom) {
      if (canSelectFrom && selectedFrom) {
        return (0, _dateFns.max)(canSelectFrom, selectedFrom);
      }

      if (canSelectFrom) {
        return canSelectFrom;
      }

      if (selectedFrom) {
        return selectedFrom;
      }

      return null;
    }
  }, {
    key: "showDatePicker",
    value: function showDatePicker() {
      var clientRect = this.componentRef.current.getBoundingClientRect();
      var windowWidth = document.body.clientWidth;
      var windowHeight = document.body.scrollHeight;
      var popupXPosition = 0;
      var popupYPosition = clientRect.height;

      if (clientRect.left + 645 > windowWidth) {
        popupXPosition = windowWidth - 645 - clientRect.left;
      }

      var scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      if (scrollTop + clientRect.top + clientRect.height + 450 > windowHeight) {
        popupYPosition = -450;
      }

      this.setState({
        isShowDatePicker: true,
        popupXPosition: popupXPosition,
        popupYPosition: popupYPosition
      });
      document.addEventListener('click', this.handleOutsideClick, true);
    }
  }, {
    key: "hideDatePicker",
    value: function hideDatePicker() {
      this.setState({
        isShowDatePicker: false
      });
      document.removeEventListener('click', this.handleOutsideClick, true);
    }
  }, {
    key: "renderHorizontal",
    value: function renderHorizontal() {
      var _this2 = this;

      var canSelectFrom = this.props.from ? (0, _helpers.parseDate)(this.props.from) : null;
      var canSelectTo = this.props.to ? (0, _helpers.parseDate)(this.props.to) : null;
      return _react.default.createElement("div", {
        className: "date-range date-range--horizontal",
        style: {
          left: this.state.popupXPosition,
          top: this.state.popupYPosition
        },
        ref: this.containerRef
      }, _react.default.createElement(_DateRangePresets.default, {
        onSelect: this.handleChangePreset,
        selectedFrom: this.state.selectedFrom,
        selectedTo: this.state.selectedTo
      }), _react.default.createElement("div", {
        className: "date-range__container"
      }, this.state.showingPages.map(function (showingPage, index) {
        return _react.default.createElement(_DateTime.default, {
          key: (0, _dateFns.format)(showingPage, 'YYYY-MM-DD'),
          canSelectFromDate: _this2.state.selectionMode === _types.Range.TO ? _this2.getCanSelectFrom(canSelectFrom, _this2.state.selectedFrom) : canSelectFrom,
          canSelectToDate: canSelectTo,
          selectedFromDate: _this2.state.selectedFrom,
          selectedToDate: _this2.state.selectedTo,
          onSelect: _this2.handleDateSelect,
          value: null,
          highMode: _this2.props.highMode,
          showingPageDate: showingPage,
          onChangePage: _this2.handleChangePage.bind(_this2, index),
          hidePrevPageArrow: index !== 0,
          hideNextPageArrow: index !== _this2.state.showingPages.length - 1,
          disableQuickSelect: false,
          disableWeekDays: false
        });
      })));
    }
  }, {
    key: "renderSelectedDates",
    value: function renderSelectedDates(onClick) {
      return _react.default.createElement("div", {
        className: "date-range__selected-dates",
        onClick: onClick
      }, _react.default.createElement("span", null, (0, _DateRangePresets.getPresetLabel)(this.state.selectedFrom, this.state.selectedTo, USER_FORMAT)));
    }
  }, {
    key: "renderVertical",
    value: function renderVertical() {
      var _this3 = this;

      var canSelectFrom = this.props.from ? (0, _helpers.parseDate)(this.props.from) : null;
      var canSelectTo = this.props.to ? (0, _helpers.parseDate)(this.props.to) : null;
      return _react.default.createElement(_Modal.default, {
        className: "modal_nopadding_mod",
        onClose: this.hideDatePicker
      }, _react.default.createElement("div", {
        className: "date-range date-range--vertical",
        ref: this.containerRef
      }, this.renderSelectedDates(_util.isNullOrUndefined), _react.default.createElement(_DateRangePresets.default, {
        onSelect: this.handleChangePreset,
        selectedFrom: this.state.selectedFrom,
        selectedTo: this.state.selectedTo
      }), _react.default.createElement("div", {
        className: "date-range__external-weekdays"
      }, (0, _helpers.makeWeekArray)((0, _dateFns.startOfWeek)(TODAY, {
        weekStartsOn: 1
      })).map(function (day) {
        return _react.default.createElement("div", {
          className: "date-time__week-day",
          key: (0, _dateFns.format)(day, 'dd')
        }, (0, _dateFns.format)(day, 'dd'));
      })), _react.default.createElement("div", {
        className: "date-range__container"
      }, _react.default.createElement(_reactTinyVirtualList.default, {
        width: 280,
        height: "100%",
        itemCount: (0, _dateFns.differenceInCalendarMonths)(TODAY, FIRST_VERTICAL_DATE) + 1,
        itemSize: function itemSize(index) {
          return calculateMonthHeight(index);
        },
        scrollOffset: calculateMonthOffset(this.state.selectedFrom || TODAY),
        renderItem: function renderItem(_ref) {
          var index = _ref.index,
              style = _ref.style;
          return _react.default.createElement("div", {
            key: index,
            style: style
          }, _react.default.createElement(_DateTime.default, {
            key: (0, _dateFns.format)((0, _dateFns.addMonths)(FIRST_VERTICAL_DATE, index), 'YYYY-MM-DD'),
            canSelectFromDate: _this3.state.selectionMode === _types.Range.TO ? _this3.getCanSelectFrom(canSelectFrom, _this3.state.selectedFrom) : canSelectFrom,
            canSelectToDate: canSelectTo,
            selectedFromDate: _this3.state.selectedFrom,
            selectedToDate: _this3.state.selectedTo,
            onSelect: _this3.handleDateSelect,
            value: null,
            highMode: _this3.props.highMode,
            showingPageDate: (0, _dateFns.addMonths)(FIRST_VERTICAL_DATE, index),
            onChangePage: _this3.handleChangePage.bind(_this3, index),
            hidePrevPageArrow: true,
            hideNextPageArrow: true,
            disableQuickSelect: true,
            disableWeekDays: true
          }));
        }
      }))));
    }
  }, {
    key: "render",
    value: function render() {
      return _react.default.createElement("div", {
        className: (0, _classnames.default)('date-range__input', {
          'date-range__input--is-menu-open': this.state.isShowDatePicker
        }),
        ref: this.componentRef
      }, this.renderSelectedDates(this.toggleDatePicker), this.state.isShowDatePicker && (window.innerWidth < 700 ? this.renderVertical() : this.renderHorizontal()));
    }
  }, {
    key: "restoreValue",
    value: function restoreValue() {
      this.setState(prepareState(this.props));
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(props, state) {
      if (props.value !== state.prevValue) {
        return prepareState(props);
      }

      return null;
    }
  }]);

  return DateStateRangePicker;
}(_react.Component);

exports.default = DateStateRangePicker;

_defineProperty(DateStateRangePicker, "defaultProps", {
  from: null,
  to: null
});