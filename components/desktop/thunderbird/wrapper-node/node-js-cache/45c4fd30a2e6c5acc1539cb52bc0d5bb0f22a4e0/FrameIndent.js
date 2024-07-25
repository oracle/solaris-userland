"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = FrameIndent;

var _react = _interopRequireDefault(require("devtools/client/shared/vendor/react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
function FrameIndent({
  indentLevel = 1
} = {}) {
  // \xA0 represents the non breakable space &nbsp;
  const indentWidth = 4 * indentLevel;
  const nonBreakableSpaces = "\xA0".repeat(indentWidth);
  return _react.default.createElement("span", {
    className: "frame-indent clipboard-only"
  }, nonBreakableSpaces);
}