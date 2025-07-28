"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateAllFrameDisplayNames = updateAllFrameDisplayNames;
exports.mapFrames = mapFrames;
loader.lazyRequireGetter(this, "_index", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_source", "devtools/client/debugger/src/utils/source");

var _assert = _interopRequireDefault(require("../../utils/assert"));

loader.lazyRequireGetter(this, "_sourceMaps", "devtools/client/debugger/src/utils/source-maps");
loader.lazyRequireGetter(this, "_location", "devtools/client/debugger/src/utils/location");
loader.lazyRequireGetter(this, "_annotateFrames", "devtools/client/debugger/src/utils/pause/frames/annotateFrames");
loader.lazyRequireGetter(this, "_create", "devtools/client/debugger/src/client/firefox/create");
loader.lazyRequireGetter(this, "_index2", "devtools/client/debugger/src/actions/sources/index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
function getSelectedFrameId(state, thread, frames) {
  let selectedFrame = (0, _index.getSelectedFrame)(state, thread);
  const blackboxedRanges = (0, _index.getBlackBoxRanges)(state);

  if (selectedFrame && !(0, _source.isFrameBlackBoxed)(selectedFrame, blackboxedRanges)) {
    return selectedFrame.id;
  }

  selectedFrame = frames.find(frame => {
    return !(0, _source.isFrameBlackBoxed)(frame, blackboxedRanges);
  });
  return selectedFrame?.id;
}

async function updateFrameLocation(frame, thunkArgs) {
  // Ignore WASM original sources
  if (isWasmOriginalSourceFrame(frame)) {
    return frame;
  }

  const location = await (0, _sourceMaps.getOriginalLocation)(frame.location, thunkArgs, {
    waitForSource: true
  }); // Avoid instantiating new frame objects if the frame location isn't mapped

  if (location == frame.location) {
    return frame;
  } // As we modify frame object, fork it to force causing re-renders


  return { ...frame,
    location,
    generatedLocation: frame.generatedLocation || frame.location
  };
}

function isWasmOriginalSourceFrame(frame) {
  if (!frame.location.source.isOriginal) {
    return false;
  }

  return Boolean(frame.generatedLocation?.source.isWasm);
}
/**
 * Wasm Source Maps can come with an non-standard "xScopes" attribute
 * which allows mapping the scope of a given location.
 */


async function expandWasmFrames(frames, {
  getState,
  sourceMapLoader
}) {
  const result = [];

  for (let i = 0; i < frames.length; ++i) {
    const frame = frames[i];

    if (frame.isOriginal || !isWasmOriginalSourceFrame(frame)) {
      result.push(frame);
      continue;
    }

    const originalFrames = await sourceMapLoader.getOriginalStackFrames((0, _location.debuggerToSourceMapLocation)(frame.generatedLocation));

    if (!originalFrames) {
      result.push(frame);
      continue;
    }

    (0, _assert.default)(!!originalFrames.length, "Expected at least one original frame"); // First entry has no specific location -- use one from the generated frame.

    originalFrames[0].location = frame.location;
    originalFrames.forEach((originalFrame, j) => {
      if (!originalFrame.location) {
        return;
      } // Keep outer most frame with true actor ID, and generate unique
      // one for the nested frames.


      const id = j == 0 ? frame.id : `${frame.id}-originalFrame${j}`;
      const originalFrameLocation = (0, _location.sourceMapToDebuggerLocation)(getState(), originalFrame.location);
      result.push((0, _create.createWasmOriginalFrame)(frame, id, originalFrame, originalFrameLocation));
    });
  }

  return result;
}

async function updateFrameDisplayName(frame, thunkArgs) {
  const location = frame.location; // Ignore WASM original, generated and pretty printed sources

  if (location.source.isWasm || !location.source.isOriginal || location.source.isPrettyPrinted) {
    return frame;
  } // As we now know that this frame relates to an original source...
  // Compute the frame's originalDisplayName.


  const originalDisplayName = location.source.isPrettyPrinted ? frame.displayName : await thunkArgs.dispatch((0, _index2.getOriginalFunctionDisplayName)(location)); // As we modify frame object, fork it to force causing re-renders

  return { ...frame,
    originalDisplayName
  };
}
/**
 * Update the display names of the mapped original frames
 *
 * @param {Object} thread
 * @returns
 */


function updateAllFrameDisplayNames(thread) {
  return async function (thunkArgs) {
    const {
      dispatch,
      getState
    } = thunkArgs;
    const frames = (0, _index.getFrames)(getState(), thread);

    if (!frames || !frames.length) {
      return;
    } // Update frame's originalDisplayNames in case it relates to an original source


    const updatedFrames = await Promise.all(frames.map(frame => updateFrameDisplayName(frame, thunkArgs)));
    dispatch({
      type: "UPDATE_FRAMES",
      frames: updatedFrames,
      thread
    });
  };
}
/**
 * Map call stack frame locations and display names to originals.
 * e.g.
 * 1. When the debuggee pauses
 * 2. When a source is pretty printed
 * @memberof actions/pause
 * @static
 */


function mapFrames(thread) {
  return async function (thunkArgs) {
    const {
      dispatch,
      getState
    } = thunkArgs;
    const frames = (0, _index.getFrames)(getState(), thread);

    if (!frames || !frames.length) {
      return;
    } // Update frame's location/generatedLocation in case it relates to an original source


    let mappedFrames = await Promise.all(frames.map(frame => updateFrameLocation(frame, thunkArgs)));
    mappedFrames = await expandWasmFrames(mappedFrames, thunkArgs); // Add the "library" attribute on all frame objects (if relevant)

    (0, _annotateFrames.annotateFramesWithLibrary)(mappedFrames); // After having mapped the frames, we should update the selected frame
    // just in case the selected frame is now set on a blackboxed original source

    const selectedFrameId = getSelectedFrameId(getState(), thread, mappedFrames);
    dispatch({
      type: "MAP_FRAMES",
      thread,
      frames: mappedFrames,
      selectedFrameId
    });
  };
}