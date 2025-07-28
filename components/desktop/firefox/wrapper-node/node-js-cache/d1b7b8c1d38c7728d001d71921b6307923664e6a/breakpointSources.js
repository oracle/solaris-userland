"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBreakpointSources = void 0;

var _reselect = require("devtools/client/shared/vendor/reselect");

loader.lazyRequireGetter(this, "_sources", "devtools/client/debugger/src/selectors/sources");
loader.lazyRequireGetter(this, "_breakpoints", "devtools/client/debugger/src/selectors/breakpoints");
loader.lazyRequireGetter(this, "_selectedLocation", "devtools/client/debugger/src/utils/selected-location");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
// Returns a list of sources with their related breakpoints:
//   [{ source, breakpoints: [breakpoint1, ...] }, ...]
//
// This only returns sources for which we have a visible breakpoint.
// This will return either generated or original source based on the currently
// selected source.
const getBreakpointSources = (0, _reselect.createSelector)(_breakpoints.getBreakpointsList, _sources.getSelectedSource, (breakpoints, selectedSource) => {
  const visibleBreakpoints = breakpoints.filter(bp => !bp.options.hidden && (bp.text || bp.originalText || bp.options.condition || bp.disabled));
  const sources = new Map();

  for (const breakpoint of visibleBreakpoints) {
    // Depending on the selected source, this will match the original or generated
    // location of the given selected source.
    const location = (0, _selectedLocation.getSelectedLocation)(breakpoint, selectedSource);
    const {
      source
    } = location; // We may have more than one breakpoint per source,
    // so use the map to have a unique entry per source.

    if (!sources.has(source)) {
      sources.set(source, {
        source,
        breakpoints: [breakpoint]
      });
    } else {
      sources.get(source).breakpoints.push(breakpoint);
    }
  } // Returns an array of breakpoints info per source, sorted by source's displayed name


  return [...sources.values()].sort((a, b) => a.source.shortName.localeCompare(b.source.shortName));
});
exports.getBreakpointSources = getBreakpointSources;