"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBreakpointSources = void 0;

var _reselect = require("devtools/client/shared/vendor/reselect");

loader.lazyRequireGetter(this, "_sources", "devtools/client/debugger/src/selectors/sources");
loader.lazyRequireGetter(this, "_breakpoints", "devtools/client/debugger/src/selectors/breakpoints");
loader.lazyRequireGetter(this, "_source", "devtools/client/debugger/src/utils/source");
loader.lazyRequireGetter(this, "_selectedLocation", "devtools/client/debugger/src/utils/selected-location");
loader.lazyRequireGetter(this, "_breakpoint", "devtools/client/debugger/src/utils/breakpoint/index");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
// Returns all the breakpoints for the given selected source
// Depending on the selected source, this will match original or generated
// location of the given selected source.
function _getBreakpointsForSource(visibleBreakpoints, source, selectedSource) {
  return visibleBreakpoints.filter(bp => (0, _selectedLocation.getSelectedLocation)(bp, selectedSource).sourceId == source.id);
} // Returns a sorted list of sources for which we have breakpoints
// We will return generated or original source IDs based on the currently selected source.


const _getSourcesForBreakpoints = (breakpoints, sourcesMap, selectedSource) => {
  const breakpointSourceIds = breakpoints.map(breakpoint => (0, _selectedLocation.getSelectedLocation)(breakpoint, selectedSource).sourceId);
  const sources = []; // We may have more than one breakpoint per sourceId,
  // so use a Set to have a unique list of source IDs.

  for (const sourceId of [...new Set(breakpointSourceIds)]) {
    const source = sourcesMap.get(sourceId); // Ignore any source that is no longer in the sources reducer
    // or blackboxed sources.

    if (!source || source.isBlackBoxed) {
      continue;
    }

    const bps = _getBreakpointsForSource(breakpoints, source, selectedSource); // Ignore sources which have no breakpoints


    if (bps.length === 0) {
      continue;
    }

    sources.push({
      source,
      breakpoints: bps,
      filename: (0, _source.getFilename)(source)
    });
  }

  return sources.sort((a, b) => a.filename.localeCompare(b.filename));
}; // Returns a list of sources with their related breakpoints:
//   [{ source, breakpoints [breakpoint1, ...] }, ...]
//
// This only returns sources for which we have a visible breakpoint.
// This will return either generated or original source based on the currently
// selected source.


const getBreakpointSources = (0, _reselect.createSelector)(_breakpoints.getBreakpointsList, _sources.getSourcesMap, _sources.getSelectedSource, (breakpoints, sourcesMap, selectedSource) => {
  const visibleBreakpoints = breakpoints.filter(bp => !bp.options.hidden && (bp.text || bp.originalText || bp.options.condition || bp.disabled));
  const sortedVisibleBreakpoints = (0, _breakpoint.sortSelectedBreakpoints)(visibleBreakpoints, selectedSource);
  return _getSourcesForBreakpoints(sortedVisibleBreakpoints, sourcesMap, selectedSource);
});
exports.getBreakpointSources = getBreakpointSources;