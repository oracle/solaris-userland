"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBreakpointSources = exports.findBreakpointSources = void 0;

var _lodash = require("devtools/client/shared/vendor/lodash");

var _reselect = require("devtools/client/shared/vendor/reselect");

loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_source", "devtools/client/debugger/src/utils/source");
loader.lazyRequireGetter(this, "_selectedLocation", "devtools/client/debugger/src/utils/selected-location");
loader.lazyRequireGetter(this, "_resource", "devtools/client/debugger/src/utils/resource/index");
loader.lazyRequireGetter(this, "_breakpoint", "devtools/client/debugger/src/utils/breakpoint/index");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
function getBreakpointsForSource(source, selectedSource, breakpoints) {
  return (0, _breakpoint.sortSelectedBreakpoints)(breakpoints, selectedSource).filter(bp => !bp.options.hidden && (bp.text || bp.originalText || bp.options.condition || bp.disabled)).filter(bp => (0, _selectedLocation.getSelectedLocation)(bp, selectedSource).sourceId == source.id);
}

const findBreakpointSources = state => {
  const breakpoints = (0, _selectors.getBreakpointsList)(state);
  const sources = (0, _selectors.getSources)(state);
  const selectedSource = (0, _selectors.getSelectedSource)(state);
  return queryBreakpointSources(sources, {
    breakpoints,
    selectedSource
  });
};

exports.findBreakpointSources = findBreakpointSources;
const queryBreakpointSources = (0, _resource.makeShallowQuery)({
  filter: (_, {
    breakpoints,
    selectedSource
  }) => (0, _lodash.uniq)(breakpoints.map(bp => (0, _selectedLocation.getSelectedLocation)(bp, selectedSource).sourceId)),
  map: _selectors.resourceAsSourceBase,
  reduce: sources => {
    const filtered = sources.filter(source => source && !source.isBlackBoxed);
    return (0, _lodash.sortBy)(filtered, source => (0, _source.getFilename)(source));
  }
});
const getBreakpointSources = (0, _reselect.createSelector)(_selectors.getBreakpointsList, findBreakpointSources, _selectors.getSelectedSource, (breakpoints, sources, selectedSource) => {
  return sources.map(source => ({
    source,
    breakpoints: getBreakpointsForSource(source, selectedSource, breakpoints)
  })).filter(({
    breakpoints: bpSources
  }) => bpSources.length > 0);
});
exports.getBreakpointSources = getBreakpointSources;