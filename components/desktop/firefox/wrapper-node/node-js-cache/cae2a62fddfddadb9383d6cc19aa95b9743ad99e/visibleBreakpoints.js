"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFirstVisibleBreakpoints = exports.getVisibleBreakpoints = void 0;

var _reselect = require("devtools/client/shared/vendor/reselect");

var _lodash = require("devtools/client/shared/vendor/lodash");

loader.lazyRequireGetter(this, "_breakpoints", "devtools/client/debugger/src/reducers/breakpoints");
loader.lazyRequireGetter(this, "_sources", "devtools/client/debugger/src/reducers/sources");
loader.lazyRequireGetter(this, "_breakpoint", "devtools/client/debugger/src/utils/breakpoint/index");
loader.lazyRequireGetter(this, "_selectedLocation", "devtools/client/debugger/src/utils/selected-location");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

/*
 * Finds the breakpoints, which appear in the selected source.
 */
const getVisibleBreakpoints = (0, _reselect.createSelector)(_sources.getSelectedSource, _breakpoints.getBreakpointsList, (selectedSource, breakpoints) => {
  if (!selectedSource) {
    return null;
  }

  return breakpoints.filter(bp => selectedSource && (0, _selectedLocation.getSelectedLocation)(bp, selectedSource).sourceId === selectedSource.id);
});
/*
 * Finds the first breakpoint per line, which appear in the selected source.
 */

exports.getVisibleBreakpoints = getVisibleBreakpoints;
const getFirstVisibleBreakpoints = (0, _reselect.createSelector)(getVisibleBreakpoints, _sources.getSelectedSource, (breakpoints, selectedSource) => {
  if (!breakpoints || !selectedSource) {
    return [];
  }

  return (0, _lodash.uniqBy)((0, _breakpoint.sortSelectedBreakpoints)(breakpoints, selectedSource), bp => (0, _selectedLocation.getSelectedLocation)(bp, selectedSource).line);
});
exports.getFirstVisibleBreakpoints = getFirstVisibleBreakpoints;