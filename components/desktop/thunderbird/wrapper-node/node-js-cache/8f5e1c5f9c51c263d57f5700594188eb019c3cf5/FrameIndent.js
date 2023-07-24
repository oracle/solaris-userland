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
function FrameIndent() {
  return _react.default.createElement("span", {
    className: "frame-indent clipboard-only"
  }, "\xA0\xA0\xA0\xA0");
}