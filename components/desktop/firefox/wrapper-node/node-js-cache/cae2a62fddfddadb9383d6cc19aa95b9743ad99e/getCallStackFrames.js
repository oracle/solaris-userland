"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatCallStackFrames = formatCallStackFrames;
exports.getCallStackFrames = void 0;
loader.lazyRequireGetter(this, "_sources", "devtools/client/debugger/src/reducers/sources");
loader.lazyRequireGetter(this, "_pause", "devtools/client/debugger/src/reducers/pause");
loader.lazyRequireGetter(this, "_frames", "devtools/client/debugger/src/utils/pause/frames/index");
loader.lazyRequireGetter(this, "_source", "devtools/client/debugger/src/utils/source");

var _reselect = require("devtools/client/shared/vendor/reselect");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
function getLocation(frame, isGeneratedSource) {
  return isGeneratedSource ? frame.generatedLocation || frame.location : frame.location;
}

function getSourceForFrame(sources, frame, isGeneratedSource) {
  const sourceId = getLocation(frame, isGeneratedSource).sourceId;
  return (0, _sources.getSourceInSources)(sources, sourceId);
}

function appendSource(sources, frame, selectedSource) {
  const isGeneratedSource = selectedSource && !(0, _source.isOriginal)(selectedSource);
  return { ...frame,
    location: getLocation(frame, isGeneratedSource),
    source: getSourceForFrame(sources, frame, isGeneratedSource)
  };
}

function formatCallStackFrames(frames, sources, selectedSource) {
  if (!frames) {
    return null;
  }

  const formattedFrames = frames.filter(frame => getSourceForFrame(sources, frame)).map(frame => appendSource(sources, frame, selectedSource)).filter(frame => {
    var _frame$source;

    return !(frame === null || frame === void 0 ? void 0 : (_frame$source = frame.source) === null || _frame$source === void 0 ? void 0 : _frame$source.isBlackBoxed);
  });
  return (0, _frames.annotateFrames)(formattedFrames);
} // eslint-disable-next-line


const getCallStackFrames = (0, _reselect.createSelector)(_pause.getCurrentThreadFrames, _sources.getSources, _sources.getSelectedSource, formatCallStackFrames);
exports.getCallStackFrames = getCallStackFrames;