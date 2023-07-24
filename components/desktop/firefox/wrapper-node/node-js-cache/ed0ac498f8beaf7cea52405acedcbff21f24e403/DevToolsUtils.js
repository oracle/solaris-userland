"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reportException = reportException;
exports.executeSoon = executeSoon;
exports.default = void 0;

var _assert = _interopRequireDefault(require("./assert"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
function reportException(who, exception) {
  const msg = `${who} threw an exception: `;
  console.error(msg, exception);
}

function executeSoon(fn) {
  setTimeout(fn, 0);
}

var _default = _assert.default;
exports.default = _default;