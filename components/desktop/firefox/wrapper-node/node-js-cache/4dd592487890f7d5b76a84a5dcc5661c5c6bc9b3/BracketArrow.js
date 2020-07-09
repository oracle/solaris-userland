"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("devtools/client/shared/vendor/react"));

var _classnames = _interopRequireDefault(require("devtools/client/debugger/dist/vendors").vendored["classnames"]);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
const BracketArrow = ({
  orientation,
  left,
  top,
  bottom
}) => {
  return _react.default.createElement("div", {
    className: (0, _classnames.default)("bracket-arrow", orientation || "up"),
    style: {
      left,
      top,
      bottom
    }
  });
};

var _default = BracketArrow;
exports.default = _default;