"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSourceTextContentForLocation = getSourceTextContentForLocation;
exports.getSourceTextContentForSource = getSourceTextContentForSource;
exports.getSettledSourceTextContent = getSettledSourceTextContent;
exports.getSelectedSourceTextContent = getSelectedSourceTextContent;
exports.getSourcesEpoch = getSourcesEpoch;
loader.lazyRequireGetter(this, "_asyncValue", "devtools/client/debugger/src/utils/async-value");
loader.lazyRequireGetter(this, "_sources", "devtools/client/debugger/src/selectors/sources");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
function getSourceTextContentForLocation(state, location) {
  return getSourceTextContentForSource(state, location.source, location.sourceActor);
}

function getSourceTextContentForSource(state, source, sourceActor = null) {
  if (source.isOriginal) {
    return state.sourcesContent.mutableOriginalSourceTextContentMapBySourceId.get(source.id);
  }

  if (!sourceActor) {
    sourceActor = (0, _sources.getFirstSourceActorForGeneratedSource)(state, source.id);
  }

  return state.sourcesContent.mutableGeneratedSourceTextContentMapBySourceActorId.get(sourceActor.id);
}

function getSettledSourceTextContent(state, location) {
  const content = getSourceTextContentForLocation(state, location);
  return (0, _asyncValue.asSettled)(content);
}

function getSelectedSourceTextContent(state) {
  const location = (0, _sources.getSelectedLocation)(state);

  if (!location) {
    return null;
  }

  return getSourceTextContentForLocation(state, location);
}

function getSourcesEpoch(state) {
  return state.sourcesContent.epoch;
}