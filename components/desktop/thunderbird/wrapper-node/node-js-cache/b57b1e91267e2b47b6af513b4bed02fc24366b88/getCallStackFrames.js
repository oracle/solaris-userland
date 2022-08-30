"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatCallStackFrames = formatCallStackFrames;
exports.getCallStackFrames = void 0;
loader.lazyRequireGetter(this, "_sources", "devtools/client/debugger/src/selectors/sources");
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

function getSourceForFrame(sourcesMap, frame, isGeneratedSource) {
  const sourceId = getLocation(frame, isGeneratedSource).sourceId;
  return sourcesMap.get(sourceId);
}

function appendSource(sourcesMap, frame, selectedSource) {
  const isGeneratedSource = selectedSource && !selectedSource.isOriginal;
  return { ...frame,
    location: getLocation(frame, isGeneratedSource),
    source: getSourceForFrame(sourcesMap, frame, isGeneratedSource)
  };
}

function formatCallStackFrames(frames, sourcesMap, selectedSource, blackboxedRanges) {
  if (!frames) {
    return null;
  }

  const formattedFrames = frames.filter(frame => getSourceForFrame(sourcesMap, frame)).map(frame => appendSource(sourcesMap, frame, selectedSource)).filter(frame => !(0, _source.isFrameBlackBoxed)(frame, frame.source, blackboxedRanges));
  return (0, _frames.annotateFrames)(formattedFrames);
} // eslint-disable-next-line


const getCallStackFrames = (0, _reselect.createSelector)(_pause.getCurrentThreadFrames, _sources.getSourcesMap, _sources.getSelectedSource, _sources.getBlackBoxRanges, formatCallStackFrames);
exports.getCallStackFrames = getCallStackFrames;