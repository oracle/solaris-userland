"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSelectedFrame = getSelectedFrame;
exports.getVisibleSelectedFrame = exports.getSelectedFrames = void 0;
loader.lazyRequireGetter(this, "_pause", "devtools/client/debugger/src/reducers/pause");
loader.lazyRequireGetter(this, "_sources", "devtools/client/debugger/src/reducers/sources");
loader.lazyRequireGetter(this, "_selectedLocation", "devtools/client/debugger/src/utils/selected-location");

var _reselect = require("devtools/client/shared/vendor/reselect");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
// eslint-disable-next-line
const getSelectedFrames = (0, _reselect.createSelector)(state => state.pause.threads, threadPauseState => {
  const selectedFrames = {};

  for (const thread in threadPauseState) {
    const pausedThread = threadPauseState[thread];
    const {
      selectedFrameId,
      frames
    } = pausedThread;

    if (frames) {
      selectedFrames[thread] = frames.find(frame => frame.id == selectedFrameId);
    }
  }

  return selectedFrames;
});
exports.getSelectedFrames = getSelectedFrames;

function getSelectedFrame(state, thread) {
  const selectedFrames = getSelectedFrames(state);
  return selectedFrames[thread];
}

const getVisibleSelectedFrame = (0, _reselect.createSelector)(_sources.getSelectedLocation, getSelectedFrames, _pause.getCurrentThread, (selectedLocation, selectedFrames, thread) => {
  const selectedFrame = selectedFrames[thread];

  if (!selectedFrame) {
    return null;
  }

  const {
    id,
    displayName
  } = selectedFrame;
  return {
    id,
    displayName,
    location: (0, _selectedLocation.getSelectedLocation)(selectedFrame, selectedLocation)
  };
});
exports.getVisibleSelectedFrame = getVisibleSelectedFrame;