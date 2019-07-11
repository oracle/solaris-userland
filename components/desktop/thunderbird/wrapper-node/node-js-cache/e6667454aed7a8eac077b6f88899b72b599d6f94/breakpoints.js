"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBreakpointsList = exports.shouldPauseOnAnyXHR = undefined;
exports.getXHRBreakpoints = getXHRBreakpoints;

var _reselect = require("devtools/client/debugger/dist/vendors").vendored["reselect"];

function getXHRBreakpoints(state) {
  return state.breakpoints.xhrBreakpoints;
} /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

const shouldPauseOnAnyXHR = exports.shouldPauseOnAnyXHR = (0, _reselect.createSelector)(getXHRBreakpoints, xhrBreakpoints => {
  const emptyBp = xhrBreakpoints.find(({ path }) => path.length === 0);
  if (!emptyBp) {
    return false;
  }

  return !emptyBp.disabled;
});

const getBreakpointsList = exports.getBreakpointsList = (0, _reselect.createSelector)(state => state.breakpoints.breakpoints, breakpoints => Object.values(breakpoints));