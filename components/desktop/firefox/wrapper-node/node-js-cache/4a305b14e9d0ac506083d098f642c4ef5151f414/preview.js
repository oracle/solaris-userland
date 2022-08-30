"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isConsole = isConsole;

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
function isConsole(expression) {
  return /^console/.test(expression);
}