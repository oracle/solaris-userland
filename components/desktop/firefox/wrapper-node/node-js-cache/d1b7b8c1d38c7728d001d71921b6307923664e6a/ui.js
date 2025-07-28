"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSelectedPrimaryPaneTab = getSelectedPrimaryPaneTab;
exports.getActiveSearch = getActiveSearch;
exports.getFrameworkGroupingState = getFrameworkGroupingState;
exports.getPaneCollapse = getPaneCollapse;
exports.getHighlightedLineRangeForSelectedSource = getHighlightedLineRangeForSelectedSource;
exports.getConditionalPanelLocation = getConditionalPanelLocation;
exports.getLogPointStatus = getLogPointStatus;
exports.getOrientation = getOrientation;
exports.getViewport = getViewport;
exports.getCursorPosition = getCursorPosition;
exports.getInlinePreview = getInlinePreview;
exports.getEditorWrapping = getEditorWrapping;
exports.getJavascriptTracingLogMethod = getJavascriptTracingLogMethod;
exports.getJavascriptTracingValues = getJavascriptTracingValues;
exports.getJavascriptTracingOnNextInteraction = getJavascriptTracingOnNextInteraction;
exports.getJavascriptTracingOnNextLoad = getJavascriptTracingOnNextLoad;
exports.getJavascriptTracingFunctionReturn = getJavascriptTracingFunctionReturn;
exports.getSearchOptions = getSearchOptions;
exports.getProjectSearchQuery = getProjectSearchQuery;
exports.getHideIgnoredSources = getHideIgnoredSources;
exports.isSourceMapIgnoreListEnabled = isSourceMapIgnoreListEnabled;
exports.areSourceMapsEnabled = areSourceMapsEnabled;
loader.lazyRequireGetter(this, "_sources", "devtools/client/debugger/src/selectors/sources");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
function getSelectedPrimaryPaneTab(state) {
  return state.ui.selectedPrimaryPaneTab;
}

function getActiveSearch(state) {
  return state.ui.activeSearch;
}

function getFrameworkGroupingState(state) {
  return state.ui.frameworkGroupingOn;
}

function getPaneCollapse(state, position) {
  if (position == "start") {
    return state.ui.startPanelCollapsed;
  }

  return state.ui.endPanelCollapsed;
}

function getHighlightedLineRangeForSelectedSource(state) {
  const selectedSource = (0, _sources.getSelectedSource)(state);

  if (!selectedSource) {
    return null;
  } // Only return the highlighted line range if it matches the selected source


  const highlightedLineRange = state.ui.highlightedLineRange;

  if (highlightedLineRange && selectedSource.id == highlightedLineRange.sourceId) {
    return highlightedLineRange;
  }

  return null;
}

function getConditionalPanelLocation(state) {
  return state.ui.conditionalPanelLocation;
}

function getLogPointStatus(state) {
  return state.ui.isLogPoint;
}

function getOrientation(state) {
  return state.ui.orientation;
}

function getViewport(state) {
  return state.ui.viewport;
}

function getCursorPosition(state) {
  return state.ui.cursorPosition;
}

function getInlinePreview(state) {
  return state.ui.inlinePreviewEnabled;
}

function getEditorWrapping(state) {
  return state.ui.editorWrappingEnabled;
}

function getJavascriptTracingLogMethod(state) {
  return state.ui.javascriptTracingLogMethod;
}

function getJavascriptTracingValues(state) {
  return state.ui.javascriptTracingValues;
}

function getJavascriptTracingOnNextInteraction(state) {
  return state.ui.javascriptTracingOnNextInteraction;
}

function getJavascriptTracingOnNextLoad(state) {
  return state.ui.javascriptTracingOnNextLoad;
}

function getJavascriptTracingFunctionReturn(state) {
  return state.ui.javascriptTracingFunctionReturn;
}

function getSearchOptions(state, searchKey) {
  return state.ui.mutableSearchOptions[searchKey];
}

function getProjectSearchQuery(state) {
  return state.ui.projectSearchQuery;
}

function getHideIgnoredSources(state) {
  return state.ui.hideIgnoredSources;
}

function isSourceMapIgnoreListEnabled(state) {
  return state.ui.sourceMapIgnoreListEnabled;
}

function areSourceMapsEnabled(state) {
  return state.ui.sourceMapsEnabled;
}