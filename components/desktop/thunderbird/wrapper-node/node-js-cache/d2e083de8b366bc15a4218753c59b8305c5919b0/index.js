"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  makeBreakpointId: true,
  makeBreakpointServerLocationId: true,
  makeBreakpointServerLocation: true,
  createXHRBreakpoint: true,
  getSelectedText: true,
  sortSelectedBreakpoints: true
};
exports.makeBreakpointId = makeBreakpointId;
exports.makeBreakpointServerLocationId = makeBreakpointServerLocationId;
exports.makeBreakpointServerLocation = makeBreakpointServerLocation;
exports.createXHRBreakpoint = createXHRBreakpoint;
exports.getSelectedText = getSelectedText;
exports.sortSelectedBreakpoints = sortSelectedBreakpoints;
loader.lazyRequireGetter(this, "_index", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_location", "devtools/client/debugger/src/utils/location");
loader.lazyRequireGetter(this, "_breakpointPositions", "devtools/client/debugger/src/utils/breakpoint/breakpointPositions");
Object.keys(_breakpointPositions).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _breakpointPositions[key];
    }
  });
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
// The ID for a Breakpoint is derived from its location in its Source.
function makeBreakpointId(location) {
  const {
    source,
    line,
    column
  } = location;
  const columnString = column || "";
  return `${source.id}:${line}:${columnString}`;
}

function makeBreakpointServerLocationId(breakpointServerLocation) {
  const {
    sourceUrl,
    sourceId,
    line,
    column
  } = breakpointServerLocation;
  const sourceUrlOrId = sourceUrl || sourceId;
  const columnString = column || "";
  return `${sourceUrlOrId}:${line}:${columnString}`;
}
/**
 * Create a location object to set a breakpoint on the server.
 *
 * Debugger location objects includes a source and sourceActor attributes
 * whereas the server don't need them and instead only need either
 * the source URL -or- a precise source actor ID.
 */


function makeBreakpointServerLocation(state, location) {
  const source = location.source;

  if (!source) {
    throw new Error("Missing 'source' attribute on location object");
  }

  const breakpointLocation = {
    line: location.line,
    column: location.column
  };

  if (source.url) {
    breakpointLocation.sourceUrl = source.url;
  } else {
    breakpointLocation.sourceId = (0, _index.getSourceActorsForSource)(state, source.id)[0].id;
  }

  return breakpointLocation;
}

function createXHRBreakpoint(path, method, overrides = {}) {
  const properties = {
    path,
    method,
    disabled: false,
    loading: false,
    text: L10N.getFormatStr("xhrBreakpoints.item.label", path)
  };
  return { ...properties,
    ...overrides
  };
}

function getSelectedText(breakpoint, selectedSource) {
  return !!selectedSource && !selectedSource.isOriginal ? breakpoint.text : breakpoint.originalText;
}

function sortSelectedBreakpoints(breakpoints, selectedSource) {
  return (0, _location.sortSelectedLocations)(breakpoints, selectedSource);
}