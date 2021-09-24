"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.timing = timing;

var _window$performance, _window$performance2;

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

/**
 * Redux middleware that sets performance markers for all actions such that they
 * will appear in performance tooling under the User Timing API
 */
const mark = ((_window$performance = window.performance) === null || _window$performance === void 0 ? void 0 : _window$performance.mark) ? window.performance.mark.bind(window.performance) : a => {};
const measure = ((_window$performance2 = window.performance) === null || _window$performance2 === void 0 ? void 0 : _window$performance2.measure) ? window.performance.measure.bind(window.performance) : (a, b, c) => {};

function timing(store) {
  return next => action => {
    mark(`${action.type}_start`);
    const result = next(action);
    mark(`${action.type}_end`);
    measure(`${action.type}`, `${action.type}_start`, `${action.type}_end`);
    return result;
  };
}