"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFrameUrl = getFrameUrl;

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
function getFrameUrl(frame) {
  var _frame$source;

  return (frame === null || frame === void 0 ? void 0 : (_frame$source = frame.source) === null || _frame$source === void 0 ? void 0 : _frame$source.url) ?? "";
}