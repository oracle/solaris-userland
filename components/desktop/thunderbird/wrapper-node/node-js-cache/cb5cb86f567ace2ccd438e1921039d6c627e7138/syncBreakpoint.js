"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.syncPendingBreakpoint = syncPendingBreakpoint;
loader.lazyRequireGetter(this, "_breakpointPositions", "devtools/client/debugger/src/actions/breakpoints/breakpointPositions");
loader.lazyRequireGetter(this, "_index", "devtools/client/debugger/src/utils/breakpoint/index");
loader.lazyRequireGetter(this, "_location", "devtools/client/debugger/src/utils/location");

var _index2 = require("devtools/client/shared/source-map-loader/index");

loader.lazyRequireGetter(this, "_index3", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_modify", "devtools/client/debugger/src/actions/breakpoints/modify");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
async function findBreakpointPosition({
  dispatch
}, location) {
  const positions = await dispatch((0, _breakpointPositions.setBreakpointPositions)(location));
  const position = (0, _index.findPosition)(positions, location);
  return position;
} // Breakpoint syncing occurs when a source is found that matches either the
// original or generated URL of a pending breakpoint. A new breakpoint is
// constructed that might have a different original and/or generated location,
// if the original source has changed since the pending breakpoint was created.
// There are a couple subtle aspects to syncing:
//
// - We handle both the original and generated source because there is no
//   guarantee that seeing the generated source means we will also see the
//   original source. When connecting, a breakpoint will be installed in the
//   client for the generated location in the pending breakpoint, and we need
//   to make sure that either a breakpoint is added to the reducer or that this
//   client breakpoint is deleted.
//
// - If we see both the original and generated sources and the source mapping
//   has changed, we need to make sure that only a single breakpoint is added
//   to the reducer for the new location corresponding to the original location
//   in the pending breakpoint.


function syncPendingBreakpoint(source, pendingBreakpoint) {
  return async thunkArgs => {
    const {
      getState,
      client,
      dispatch
    } = thunkArgs;
    const generatedSourceId = source.isOriginal ? (0, _index2.originalToGeneratedId)(source.id) : source.id;
    const generatedSource = (0, _index3.getSource)(getState(), generatedSourceId);

    if (!source || !generatedSource) {
      return null;
    } // /!\ Pending breakpoint locations come only with sourceUrl, line and column attributes.
    // We have to map it to a specific source object and avoid trying to query its non-existent 'source' attribute.


    const {
      location,
      generatedLocation
    } = pendingBreakpoint;
    const isPendingBreakpointWithSourceMap = location.sourceUrl != generatedLocation.sourceUrl;
    const sourceGeneratedLocation = (0, _location.createLocation)({ ...generatedLocation,
      source: generatedSource
    });

    if (source == generatedSource && isPendingBreakpointWithSourceMap) {
      // We are handling the generated source and the pending breakpoint has a
      // source mapping. Supply a cancellation callback that will abort the
      // breakpoint if the original source was synced to a different location,
      // in which case the client breakpoint has been removed.
      const breakpointServerLocation = (0, _index.makeBreakpointServerLocation)(getState(), sourceGeneratedLocation);
      return dispatch((0, _modify.addBreakpoint)(sourceGeneratedLocation, pendingBreakpoint.options, pendingBreakpoint.disabled, () => !client.hasBreakpoint(breakpointServerLocation)));
    }

    const originalLocation = (0, _location.createLocation)({ ...location,
      source
    });
    const newPosition = await findBreakpointPosition(thunkArgs, originalLocation);
    const newGeneratedLocation = newPosition?.generatedLocation;

    if (!newGeneratedLocation) {
      // We couldn't find a new mapping for the breakpoint. If there is a source
      // mapping, remove any breakpoints for the generated location, as if the
      // breakpoint moved. If the old generated location still maps to an
      // original location then we don't want to add a breakpoint for it.
      if (isPendingBreakpointWithSourceMap) {
        dispatch((0, _modify.removeBreakpointAtGeneratedLocation)(sourceGeneratedLocation));
      }

      return null;
    }

    const isSameLocation = (0, _location.comparePosition)(generatedLocation, newGeneratedLocation); // If the new generated location has changed from that in the pending
    // breakpoint, remove any breakpoint associated with the old generated
    // location.

    if (!isSameLocation) {
      dispatch((0, _modify.removeBreakpointAtGeneratedLocation)(sourceGeneratedLocation));
    }

    return dispatch((0, _modify.addBreakpoint)(newGeneratedLocation, pendingBreakpoint.options, pendingBreakpoint.disabled));
  };
}