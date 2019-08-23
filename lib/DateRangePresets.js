"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.getPresetLabel = void 0;

var _react = _interopRequireWildcard(require("react"));

var _dateFns = require("date-fns");

var _classnames = _interopRequireDefault(require("classnames"));

var _Button = _interopRequireDefault(require("../components/form/Button"));

var _types = require("./types");

var _value, _value2, _value3, _value4, _value5;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var TODAY = new Date();
var FORMAT = 'YYYY-MM-DD';
var PRESETS = [{
  value: (_value = {}, _defineProperty(_value, _types.Range.FROM, (0, _dateFns.format)(TODAY, FORMAT)), _defineProperty(_value, _types.Range.TO, (0, _dateFns.format)(TODAY, FORMAT)), _value),
  label: 'Today'
}, {
  value: (_value2 = {}, _defineProperty(_value2, _types.Range.FROM, (0, _dateFns.format)((0, _dateFns.subDays)(TODAY, 1), FORMAT)), _defineProperty(_value2, _types.Range.TO, (0, _dateFns.format)((0, _dateFns.subDays)(TODAY, 1), FORMAT)), _value2),
  label: 'Yesterday'
}, {
  value: (_value3 = {}, _defineProperty(_value3, _types.Range.FROM, (0, _dateFns.format)((0, _dateFns.subDays)(TODAY, 7), FORMAT)), _defineProperty(_value3, _types.Range.TO, (0, _dateFns.format)(TODAY, FORMAT)), _value3),
  label: 'Last 7 days'
}, {
  value: (_value4 = {}, _defineProperty(_value4, _types.Range.FROM, (0, _dateFns.format)((0, _dateFns.subDays)(TODAY, 30), FORMAT)), _defineProperty(_value4, _types.Range.TO, (0, _dateFns.format)(TODAY, FORMAT)), _value4),
  label: 'Last 30 days'
}, {
  value: (_value5 = {}, _defineProperty(_value5, _types.Range.FROM, (0, _dateFns.format)((0, _dateFns.startOfMonth)(TODAY), FORMAT)), _defineProperty(_value5, _types.Range.TO, (0, _dateFns.format)(TODAY, FORMAT)), _value5),
  label: 'Last month'
}, {
  value: null,
  label: 'All time'
}];

var isCurrentPreset = function isCurrentPreset(from, to, preset) {
  if (preset.value === null) {
    if (from === null && to === null) {
      return true;
    }

    return false;
  }

  return (0, _dateFns.format)(from, FORMAT) === preset.value[_types.Range.FROM] && (0, _dateFns.format)(to, FORMAT) === preset.value[_types.Range.TO];
};

var getPresetLabel = function getPresetLabel(from, to, userFormat) {
  var foundPreset = PRESETS.find(function (preset) {
    return isCurrentPreset(from, to, preset);
  });

  if (foundPreset !== undefined) {
    return foundPreset.label;
  }

  var result = '';

  if (from) {
    result += (0, _dateFns.format)(from, userFormat);
  }

  result += ' — ';

  if (to) {
    result += (0, _dateFns.format)(to, userFormat);
  }

  return result;
};

exports.getPresetLabel = getPresetLabel;

var DateRangePresets =
/*#__PURE__*/
function (_Component) {
  _inherits(DateRangePresets, _Component);

  function DateRangePresets() {
    _classCallCheck(this, DateRangePresets);

    return _possibleConstructorReturn(this, _getPrototypeOf(DateRangePresets).apply(this, arguments));
  }

  _createClass(DateRangePresets, [{
    key: "render",
    value: function render() {
      var _this = this;

      return _react.default.createElement("div", {
        className: "date-range__presets"
      }, PRESETS.map(function (preset, index) {
        return _react.default.createElement(_Button.default, {
          key: index,
          className: (0, _classnames.default)('button__text date-range__preset', {
            'date-range__preset--active': isCurrentPreset(_this.props.selectedFrom, _this.props.selectedTo, preset)
          }),
          onClick: function onClick() {
            _this.props.onSelect(preset.value);
          }
        }, preset.label);
      }));
    }
  }]);

  return DateRangePresets;
}(_react.Component);

exports.default = DateRangePresets;