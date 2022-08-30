"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  makeBreakpointId: true,
  getLocationWithoutColumn: true,
  makePendingLocationId: true,
  makeBreakpointLocation: true,
  assertPendingBreakpoint: true,
  assertPendingLocation: true,
  createXHRBreakpoint: true,
  createPendingBreakpoint: true,
  getSelectedText: true,
  sortSelectedBreakpoints: true
};
exports.makeBreakpointId = makeBreakpointId;
exports.getLocationWithoutColumn = getLocationWithoutColumn;
exports.makePendingLocationId = makePendingLocationId;
exports.makeBreakpointLocation = makeBreakpointLocation;
exports.assertPendingBreakpoint = assertPendingBreakpoint;
exports.assertPendingLocation = assertPendingLocation;
exports.createXHRBreakpoint = createXHRBreakpoint;
exports.createPendingBreakpoint = createPendingBreakpoint;
exports.getSelectedText = getSelectedText;
exports.sortSelectedBreakpoints = sortSelectedBreakpoints;
loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_source", "devtools/client/debugger/src/utils/source");
loader.lazyRequireGetter(this, "_location", "devtools/client/debugger/src/utils/location");

var _assert = _interopRequireDefault(require("../assert"));

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
// The ID for a Breakpoint is derived from its location in its Source.
function makeBreakpointId(location) {
  const {
    sourceId,
    line,
    column
  } = location;
  const columnString = column || "";
  return `${sourceId}:${line}:${columnString}`;
}

function getLocationWithoutColumn(location) {
  const {
    sourceId,
    line
  } = location;
  return `${sourceId}:${line}`;
}

function makePendingLocationId(location) {
  assertPendingLocation(location);
  const {
    sourceUrl,
    line,
    column
  } = location;
  const sourceUrlString = sourceUrl || "";
  const columnString = column || "";
  return `${sourceUrlString}:${line}:${columnString}`;
}

function makeBreakpointLocation(state, location) {
  const source = (0, _selectors.getLocationSource)(state, location);

  if (!source) {
    throw new Error("no source");
  }

  const breakpointLocation = {
    line: location.line,
    column: location.column
  };

  if (source.url) {
    breakpointLocation.sourceUrl = source.url;
  } else {
    breakpointLocation.sourceId = (0, _selectors.getSourceActorsForSource)(state, source.id)[0].id;
  }

  return breakpointLocation;
}

function assertPendingBreakpoint(pendingBreakpoint) {
  assertPendingLocation(pendingBreakpoint.location);
  assertPendingLocation(pendingBreakpoint.generatedLocation);
}

function assertPendingLocation(location) {
  (0, _assert.default)(!!location, "location must exist");
  const {
    sourceUrl
  } = location; // sourceUrl is null when the source does not have a url

  (0, _assert.default)(sourceUrl !== undefined, "location must have a source url");
  (0, _assert.default)(location.hasOwnProperty("line"), "location must have a line");
  (0, _assert.default)(location.hasOwnProperty("column") != null, "location must have a column");
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

function createPendingLocation(location) {
  const {
    sourceUrl,
    line,
    column
  } = location;
  return {
    sourceUrl,
    line,
    column
  };
}

function createPendingBreakpoint(bp) {
  const pendingLocation = createPendingLocation(bp.location);
  const pendingGeneratedLocation = createPendingLocation(bp.generatedLocation);
  assertPendingLocation(pendingLocation);
  return {
    options: bp.options,
    disabled: bp.disabled,
    location: pendingLocation,
    generatedLocation: pendingGeneratedLocation
  };
}

function getSelectedText(breakpoint, selectedSource) {
  return !!selectedSource && (0, _source.isGenerated)(selectedSource) ? breakpoint.text : breakpoint.originalText;
}

function sortSelectedBreakpoints(breakpoints, selectedSource) {
  return (0, _location.sortSelectedLocations)(breakpoints, selectedSource);
}