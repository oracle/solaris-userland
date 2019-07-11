"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFirstVisibleBreakpoints = exports.getVisibleBreakpoints = undefined;

var _reselect = require("devtools/client/debugger/dist/vendors").vendored["reselect"];

var _lodash = require("devtools/client/shared/vendor/lodash");

var _breakpoints = require("../reducers/breakpoints");

var _sources = require("../reducers/sources");

var _breakpoint = require("../utils/breakpoint/index");

var _selectedLocation = require("../utils/selected-location");

/*
 * Finds the breakpoints, which appear in the selected source.
 */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

const getVisibleBreakpoints = exports.getVisibleBreakpoints = (0, _reselect.createSelector)(_sources.getSelectedSource, _breakpoints.getBreakpointsList, (selectedSource, breakpoints) => {
  if (!selectedSource) {
    return null;
  }

  return breakpoints.filter(bp => selectedSource && (0, _selectedLocation.getSelectedLocation)(bp, selectedSource).sourceId === selectedSource.id);
});

/*
 * Finds the first breakpoint per line, which appear in the selected source.
 */
const getFirstVisibleBreakpoints = exports.getFirstVisibleBreakpoints = (0, _reselect.createSelector)(getVisibleBreakpoints, _sources.getSelectedSource, (breakpoints, selectedSource) => {
  if (!breakpoints || !selectedSource) {
    return [];
  }

  return (0, _lodash.uniqBy)((0, _breakpoint.sortSelectedBreakpoints)(breakpoints, selectedSource), bp => (0, _selectedLocation.getSelectedLocation)(bp, selectedSource).line);
});