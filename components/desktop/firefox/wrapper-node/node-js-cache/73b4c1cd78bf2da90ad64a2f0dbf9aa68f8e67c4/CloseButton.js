"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("devtools/client/shared/vendor/react"));

var _AccessibleImage = _interopRequireDefault(require("../AccessibleImage"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
function CloseButton({
  handleClick,
  buttonClass,
  tooltip
}) {
  return _react.default.createElement("button", {
    className: buttonClass ? `close-btn ${buttonClass}` : "close-btn",
    onClick: handleClick,
    title: tooltip
  }, _react.default.createElement(_AccessibleImage.default, {
    className: "close"
  }));
}

var _default = CloseButton;
exports.default = _default;