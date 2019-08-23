"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Arrow = function Arrow() {
  return _react.default.createElement("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 20 20"
  }, _react.default.createElement("path", {
    d: "M14.586 9.007l-3.293-3.293L12.707 4.3l5.707 5.707-5.707 5.707-1.414-1.414 3.293-3.293H2v-2h12.586z"
  }));
};

var _default = Arrow;
exports.default = _default;