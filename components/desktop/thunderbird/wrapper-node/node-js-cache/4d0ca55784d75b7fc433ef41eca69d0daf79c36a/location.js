"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.comparePosition = comparePosition;
exports.createLocation = createLocation;
exports.debuggerToSourceMapLocation = debuggerToSourceMapLocation;
exports.createPendingSelectedLocation = createPendingSelectedLocation;
exports.sortSelectedLocations = sortSelectedLocations;
exports.sourceMapToDebuggerLocation = sourceMapToDebuggerLocation;
loader.lazyRequireGetter(this, "_selectedLocation", "devtools/client/debugger/src/utils/selected-location");
loader.lazyRequireGetter(this, "_index", "devtools/client/debugger/src/selectors/index");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

/**
 * Note that arguments can be created via `createLocation`.
 * But they can also be created via `createPendingLocation` in reducer/pending-breakpoints.js.
 * Both will have similar line and column attributes.
 */
function comparePosition(a, b) {
  return a && b && a.line == b.line && a.column == b.column;
}

function createLocation({
  source,
  sourceActor = null,
  // Line 0 represents no specific line chosen for action
  line = 0,
  column
}) {
  return {
    source,
    sourceActor,
    sourceActorId: sourceActor?.id,
    // # Quick overview of 1-based versus 0-based lines and columns #
    //
    // Everything assumes a 1-based line, but columns can be 0 or 1 based.
    // Note that while lines are 1-based some RDP packet may refer to line 0 which should be considered as "no precise location".
    //
    // Columns are 0-based in:
    //  - overall all debugger frontend
    //  - anything around source maps (SourceMapLoader, SourceMapURLService, SourceMap library)
    //  - most RDP packets, especially around the thread actor:
    //    - breakpoints
    //    - breakpoint positions
    //    - pause location
    //    - paused frames
    //
    // Columns are 1-based in:
    //  - the UI displayed to the user (console messages, frames, stacktraces,...)
    //  - asserted locations in tests (to match displayed numbers)
    //  - Spidermonkey:
    //    This data is mostly coming from and driven by
    //    JSScript::lineno and JSScript::column
    //    https://searchfox.org/mozilla-central/rev/4c065f1df299065c305fb48b36cdae571a43d97c/js/src/vm/JSScript.h#1567-1570
    //  - some RDP packets outside of the thread actor:
    //    - CONSOLE_MESSAGE, CSS_MESSAGE, PAGE_ERROR resources for lineNumber, columnNumber and stacktrace attributes
    //    - Error objects's Object Actor's grip's "preview" attribute will expose its stacktraces with 1-based columns
    //  - SmartTrace is dealing with these RDP packets and consumes 1-based columns,
    //    but has to map to 0-based columns as it depends on debugger frontend Frames components.
    //
    // The RDP server, especially in the thread actor ecosystem has to map from spidermonkey 1-based to historical 0-based columns.
    line,
    column
  };
}
/**
 * Convert location objects created via `createLocation` into
 * the format used by the Source Map Loader/Worker.
 * It only needs sourceId, line and column attributes.
 */


function debuggerToSourceMapLocation(location) {
  return {
    sourceId: location.source.id,
    // In case of errors loading the source, we might not have a precise location.
    // Defaults to first line and column.
    line: location.line || 1,
    column: location.column || 0
  };
}
/**
 * Pending location only need these three attributes,
 * and especially doesn't need the large source and sourceActor objects of the regular location objects.
 *
 * @param {object} location
 */


function createPendingSelectedLocation(location) {
  return {
    url: location.source.url,
    line: location.line,
    column: location.column
  };
}

function sortSelectedLocations(locations, selectedSource) {
  return Array.from(locations).sort((locationA, locationB) => {
    const aSelected = (0, _selectedLocation.getSelectedLocation)(locationA, selectedSource);
    const bSelected = (0, _selectedLocation.getSelectedLocation)(locationB, selectedSource); // Order the locations by line number…

    if (aSelected.line < bSelected.line) {
      return -1;
    }

    if (aSelected.line > bSelected.line) {
      return 1;
    } // … and if we have the same line, we want to return location with undefined columns
    // first, and then order them by column


    if (aSelected.column == bSelected.column) {
      return 0;
    }

    if (aSelected.column === undefined) {
      return -1;
    }

    if (bSelected.column === undefined) {
      return 1;
    }

    return aSelected.column < bSelected.column ? -1 : 1;
  });
}
/**
 * Source map Loader/Worker and debugger frontend don't use the same objects for locations.
 * Worker uses 'sourceId' attributes whereas the frontend has 'source' attribute.
 */


function sourceMapToDebuggerLocation(state, location) {
  // From MapScopes modules, we might re-process the exact same location objects
  // for which we would already have computed the source object,
  // and which would lack sourceId attribute.
  if (location.source) {
    return location;
  } // SourceMapLoader doesn't known about debugger's source objects
  // so that we have to fetch it from here


  const source = (0, _index.getSource)(state, location.sourceId);

  if (!source) {
    throw new Error(`Could not find source-map source ${location.sourceId}`);
  }

  return createLocation({ ...location,
    source
  });
}