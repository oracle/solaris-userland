"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mapDisplayNames = mapDisplayNames;
loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_ast", "devtools/client/debugger/src/utils/ast");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
function mapDisplayName(frame, {
  getState
}) {
  if (frame.isOriginal) {
    return frame;
  }

  const source = (0, _selectors.getSource)(getState(), frame.location.sourceId);

  if (!source) {
    return frame;
  }

  const symbols = (0, _selectors.getSymbols)(getState(), source);

  if (!symbols || !symbols.functions) {
    return frame;
  }

  const originalFunction = (0, _ast.findClosestFunction)(symbols, frame.location);

  if (!originalFunction) {
    return frame;
  }

  const originalDisplayName = originalFunction.name;
  return { ...frame,
    originalDisplayName
  };
}

function mapDisplayNames(cx) {
  return function ({
    dispatch,
    getState
  }) {
    const frames = (0, _selectors.getFrames)(getState(), cx.thread);

    if (!frames) {
      return;
    }

    const mappedFrames = frames.map(frame => mapDisplayName(frame, {
      getState
    }));
    dispatch({
      type: "MAP_FRAME_DISPLAY_NAMES",
      cx,
      thread: cx.thread,
      frames: mappedFrames
    });
  };
}