"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBreakpointSources = undefined;

var _lodash = require("devtools/client/shared/vendor/lodash");

var _reselect = require("devtools/client/debugger/dist/vendors").vendored["reselect"];

var _selectors = require("../selectors/index");

var _source = require("../utils/source");

var _selectedLocation = require("../utils/selected-location");

var _breakpoint = require("../utils/breakpoint/index");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

function getBreakpointsForSource(source, selectedSource, breakpoints) {
  return (0, _breakpoint.sortSelectedBreakpoints)(breakpoints, selectedSource).filter(bp => !bp.options.hidden && (bp.text || bp.originalText || bp.options.condition || bp.disabled)).filter(bp => (0, _selectedLocation.getSelectedLocation)(bp, selectedSource).sourceId == source.id);
}

function findBreakpointSources(sources, breakpoints, selectedSource) {
  const sourceIds = (0, _lodash.uniq)(breakpoints.map(bp => (0, _selectedLocation.getSelectedLocation)(bp, selectedSource).sourceId));

  const breakpointSources = sourceIds.reduce((acc, id) => {
    const source = (0, _selectors.getSourceInSources)(sources, id);
    if (source && !source.isBlackBoxed) {
      acc.push(source);
    }
    return acc;
  }, []);

  return (0, _lodash.sortBy)(breakpointSources, source => (0, _source.getFilename)(source));
}

const getBreakpointSources = exports.getBreakpointSources = (0, _reselect.createSelector)(_selectors.getBreakpointsList, _selectors.getSources, _selectors.getSelectedSource, (breakpoints, sources, selectedSource) => findBreakpointSources(sources, breakpoints, selectedSource).map(source => ({
  source,
  breakpoints: getBreakpointsForSource(source, selectedSource, breakpoints)
})).filter(({ breakpoints: bpSources }) => bpSources.length > 0));