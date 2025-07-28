"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getGeneratedLocation = getGeneratedLocation;
exports.getOriginalLocation = getOriginalLocation;
exports.getMappedLocation = getMappedLocation;
exports.getRelatedMapLocation = getRelatedMapLocation;
loader.lazyRequireGetter(this, "_location", "devtools/client/debugger/src/utils/location");
loader.lazyRequireGetter(this, "_create", "devtools/client/debugger/src/client/firefox/create");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

/**
 * For any location, return the matching generated location.
 * If this is already a generated location, returns the same location.
 *
 * In additional to `SourceMapLoader.getGeneratedLocation`,
 * this asserts that the related source is still registered in the reducer current state.
 *
 * @param {Object} location
 * @param {Object} thunkArgs
 *        Redux action thunk arguments
 * @param {Object}
 *        The matching generated location.
 */
async function getGeneratedLocation(location, thunkArgs) {
  if (!location.source.isOriginal) {
    return location;
  }

  const {
    sourceMapLoader,
    getState
  } = thunkArgs;
  const generatedLocation = await sourceMapLoader.getGeneratedLocation((0, _location.debuggerToSourceMapLocation)(location));

  if (!generatedLocation) {
    return location;
  }

  return (0, _location.sourceMapToDebuggerLocation)(getState(), generatedLocation);
}
/**
 * For any location, return the matching original location.
 * If this is already an original location, returns the same location.
 *
 * In additional to `SourceMapLoader.getOriginalLocation`,
 * this automatically fetches the original source object in order to build
 * the original location object.
 *
 * @param {Object} location
 * @param {Object} thunkArgs
 *        Redux action thunk arguments
 * @param {Object} options
 * @param {boolean} options.waitForSource
 *        Default to false. If true is passed, this function will
 *        ensure waiting, possibly asynchronously for the related original source
 *        to be registered in the redux store.
 * @param {boolean} options.looseSearch
 *        Default to false. If true, this won't query an exact mapping,
 *        but will also lookup for a loose match at the first column and next lines.
 *
 * @param {Object}
 *        The matching original location.
 */


async function getOriginalLocation(location, thunkArgs, {
  waitForSource = false,
  looseSearch = false
} = {}) {
  if (location.source.isOriginal) {
    return location;
  }

  const {
    getState,
    sourceMapLoader
  } = thunkArgs;
  const originalLocation = await sourceMapLoader.getOriginalLocation((0, _location.debuggerToSourceMapLocation)(location), {
    looseSearch
  });

  if (!originalLocation) {
    return location;
  } // When we are mapping frames while being paused,
  // the original source may not be registered yet in the reducer.


  if (waitForSource) {
    await (0, _create.waitForSourceToBeRegisteredInStore)(originalLocation.sourceId);
  }

  return (0, _location.sourceMapToDebuggerLocation)(getState(), originalLocation);
}

async function getMappedLocation(location, thunkArgs) {
  if (location.source.isOriginal) {
    const generatedLocation = await getGeneratedLocation(location, thunkArgs);
    return {
      location,
      generatedLocation
    };
  }

  const generatedLocation = location;
  const originalLocation = await getOriginalLocation(generatedLocation, thunkArgs);
  return {
    location: originalLocation,
    generatedLocation
  };
}
/**
 * Gets the "mapped location".
 *
 * If the passed location is on a generated source, it gets the
 * related location in the original source.
 * If the passed location is on an original source, it gets the
 * related location in the generated source.
 */


async function getRelatedMapLocation(location, thunkArgs) {
  if (!location.source) {
    return location;
  }

  if (location.source.isOriginal) {
    return getGeneratedLocation(location, thunkArgs);
  }

  return getOriginalLocation(location, thunkArgs);
}