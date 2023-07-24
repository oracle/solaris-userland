"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatCallStackFrames = formatCallStackFrames;
exports.getCallStackFrames = void 0;
loader.lazyRequireGetter(this, "_sources", "devtools/client/debugger/src/selectors/sources");
loader.lazyRequireGetter(this, "_sourceBlackbox", "devtools/client/debugger/src/selectors/source-blackbox");
loader.lazyRequireGetter(this, "_pause", "devtools/client/debugger/src/selectors/pause");
loader.lazyRequireGetter(this, "_frames", "devtools/client/debugger/src/utils/pause/frames/index");
loader.lazyRequireGetter(this, "_source", "devtools/client/debugger/src/utils/source");

var _reselect = require("devtools/client/shared/vendor/reselect");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
function getLocation(frame, isGeneratedSource) {
  return isGeneratedSource ? frame.generatedLocation || frame.location : frame.location;
}

function getSourceForFrame(frame, isGeneratedSource) {
  return getLocation(frame, isGeneratedSource).source;
}

function appendSource(frame, selectedSource) {
  const isGeneratedSource = selectedSource && !selectedSource.isOriginal;
  return { ...frame,
    location: getLocation(frame, isGeneratedSource),
    source: getSourceForFrame(frame, isGeneratedSource)
  };
}

function formatCallStackFrames(frames, selectedSource, blackboxedRanges) {
  if (!frames) {
    return null;
  }

  const formattedFrames = frames.filter(frame => getSourceForFrame(frame)).map(frame => appendSource(frame, selectedSource)).filter(frame => !(0, _source.isFrameBlackBoxed)(frame, blackboxedRanges));
  return (0, _frames.annotateFrames)(formattedFrames);
}

const getCallStackFrames = (0, _reselect.createSelector)(_pause.getCurrentThreadFrames, _sources.getSelectedSource, _sourceBlackbox.getBlackBoxRanges, formatCallStackFrames);
exports.getCallStackFrames = getCallStackFrames;