"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _astBreakpointLocation = require("./astBreakpointLocation");

Object.keys(_astBreakpointLocation).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _astBreakpointLocation[key];
    }
  });
});

var _breakpointPositions = require("./breakpointPositions");

Object.keys(_breakpointPositions).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _breakpointPositions[key];
    }
  });
});
exports.firstString = firstString;
exports.makeBreakpointId = makeBreakpointId;
exports.getLocationWithoutColumn = getLocationWithoutColumn;
exports.makePendingLocationId = makePendingLocationId;
exports.makeBreakpointLocation = makeBreakpointLocation;
exports.makeSourceActorLocation = makeSourceActorLocation;
exports.makeBreakpointActorId = makeBreakpointActorId;
exports.assertBreakpoint = assertBreakpoint;
exports.assertPendingBreakpoint = assertPendingBreakpoint;
exports.assertLocation = assertLocation;
exports.assertPendingLocation = assertPendingLocation;
exports.breakpointAtLocation = breakpointAtLocation;
exports.breakpointExists = breakpointExists;
exports.createXHRBreakpoint = createXHRBreakpoint;
exports.createPendingBreakpoint = createPendingBreakpoint;
exports.getSelectedText = getSelectedText;
exports.sortSelectedBreakpoints = sortSelectedBreakpoints;

var _selectors = require("../../selectors/index");

var _source = require("../source");

var _location = require("../location");

var _assert = require("../assert");

var _assert2 = _interopRequireDefault(_assert);

var _prefs = require("../prefs");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Return the first argument that is a string, or null if nothing is a
// string.
function firstString(...args) {
  for (const arg of args) {
    if (typeof arg === "string") {
      return arg;
    }
  }
  return null;
}

// The ID for a Breakpoint is derived from its location in its Source.
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

function makeBreakpointId(location) {
  const { sourceId, line, column } = location;
  const columnString = column || "";
  return `${sourceId}:${line}:${columnString}`;
}

function getLocationWithoutColumn(location) {
  const { sourceId, line } = location;
  return `${sourceId}:${line}`;
}

function makePendingLocationId(location) {
  assertPendingLocation(location);
  const { sourceUrl, line, column } = location;
  const sourceUrlString = sourceUrl || "";
  const columnString = column || "";

  return `${sourceUrlString}:${line}:${columnString}`;
}

function makeBreakpointLocation(state, location) {
  const source = (0, _selectors.getSource)(state, location.sourceId);
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

function makeSourceActorLocation(sourceActor, location) {
  return {
    sourceActor,
    line: location.line,
    column: location.column
  };
}

// The ID for a BreakpointActor is derived from its location in its SourceActor.
function makeBreakpointActorId(location) {
  const { sourceActor, line, column } = location;
  const columnString = column || "";
  return `${sourceActor}:${line}:${columnString}`;
}

function assertBreakpoint(breakpoint) {
  assertLocation(breakpoint.location);
  assertLocation(breakpoint.generatedLocation);
}

function assertPendingBreakpoint(pendingBreakpoint) {
  assertPendingLocation(pendingBreakpoint.location);
  assertPendingLocation(pendingBreakpoint.generatedLocation);
}

function assertLocation(location) {
  assertPendingLocation(location);
  const { sourceId } = location;
  (0, _assert2.default)(!!sourceId, "location must have a source id");
}

function assertPendingLocation(location) {
  (0, _assert2.default)(!!location, "location must exist");

  const { sourceUrl } = location;

  // sourceUrl is null when the source does not have a url
  (0, _assert2.default)(sourceUrl !== undefined, "location must have a source url");
  (0, _assert2.default)(location.hasOwnProperty("line"), "location must have a line");
  (0, _assert2.default)(location.hasOwnProperty("column") != null, "location must have a column");
}

// syncing
function breakpointAtLocation(breakpoints, { line, column }) {
  return breakpoints.find(breakpoint => {
    const sameLine = breakpoint.location.line === line;
    if (!sameLine) {
      return false;
    }

    // NOTE: when column breakpoints are disabled we want to find
    // the first breakpoint
    if (!_prefs.features.columnBreakpoints) {
      return true;
    }

    return breakpoint.location.column === column;
  });
}

function breakpointExists(state, location) {
  const currentBp = (0, _selectors.getBreakpoint)(state, location);
  return currentBp && !currentBp.disabled;
}

function createXHRBreakpoint(path, method, overrides = {}) {
  const properties = {
    path,
    method,
    disabled: false,
    loading: false,
    text: L10N.getFormatStr("xhrBreakpoints.item.label", path)
  };

  return { ...properties, ...overrides };
}

function createPendingLocation(location) {
  const { sourceUrl, line, column } = location;
  return { sourceUrl, line, column };
}

function createPendingBreakpoint(bp) {
  const pendingLocation = createPendingLocation(bp.location);
  const pendingGeneratedLocation = createPendingLocation(bp.generatedLocation);

  assertPendingLocation(pendingLocation);

  return {
    options: bp.options,
    disabled: bp.disabled,
    location: pendingLocation,
    astLocation: bp.astLocation,
    generatedLocation: pendingGeneratedLocation
  };
}

function getSelectedText(breakpoint, selectedSource) {
  return selectedSource && (0, _source.isGenerated)(selectedSource) ? breakpoint.text : breakpoint.originalText;
}

function sortSelectedBreakpoints(breakpoints, selectedSource) {
  return (0, _location.sortSelectedLocations)(breakpoints, selectedSource);
}