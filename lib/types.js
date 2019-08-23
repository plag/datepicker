"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Range = exports.Modificator = exports.Granularity = void 0;
var Granularity;
exports.Granularity = Granularity;

(function (Granularity) {
  Granularity["DAY"] = "day";
  Granularity["MONTH"] = "month";
  Granularity["YEAR"] = "year";
})(Granularity || (exports.Granularity = Granularity = {}));

var Modificator;
exports.Modificator = Modificator;

(function (Modificator) {
  Modificator[Modificator["ADD"] = 1] = "ADD";
  Modificator[Modificator["SUB"] = -1] = "SUB";
})(Modificator || (exports.Modificator = Modificator = {}));

var Range;
exports.Range = Range;

(function (Range) {
  Range["FROM"] = "from";
  Range["TO"] = "to";
})(Range || (exports.Range = Range = {}));

;