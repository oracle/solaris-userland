"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSourceTextContent = getSourceTextContent;
exports.getSourceContent = getSourceContent;
exports.getSelectedSourceTextContent = getSelectedSourceTextContent;
exports.isSourceLoadingOrLoaded = isSourceLoadingOrLoaded;
exports.getSourcesEpoch = getSourcesEpoch;
loader.lazyRequireGetter(this, "_asyncValue", "devtools/client/debugger/src/utils/async-value");
loader.lazyRequireGetter(this, "_sources", "devtools/client/debugger/src/selectors/sources");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
function getSourceTextContent(state, id) {
  return state.sourcesContent.mutableTextContentMap.get(id);
}

function getSourceContent(state, id) {
  const content = getSourceTextContent(state, id);
  return (0, _asyncValue.asSettled)(content);
}

function getSelectedSourceTextContent(state) {
  const source = (0, _sources.getSelectedSource)(state);
  if (!source) return null;
  return getSourceTextContent(state, source.id);
}

function isSourceLoadingOrLoaded(state, sourceId) {
  const content = getSourceTextContent(state, sourceId);
  return content != null;
}

function getSourcesEpoch(state) {
  return state.sourcesContent.epoch;
}