"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSelectedPrimaryPaneTab = getSelectedPrimaryPaneTab;
exports.getActiveSearch = getActiveSearch;
exports.getFrameworkGroupingState = getFrameworkGroupingState;
exports.getShownSource = getShownSource;
exports.getPaneCollapse = getPaneCollapse;
exports.getHighlightedLineRange = getHighlightedLineRange;
exports.getConditionalPanelLocation = getConditionalPanelLocation;
exports.getLogPointStatus = getLogPointStatus;
exports.getOrientation = getOrientation;
exports.getViewport = getViewport;
exports.getCursorPosition = getCursorPosition;
exports.getInlinePreview = getInlinePreview;
exports.getEditorWrapping = getEditorWrapping;

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

function getShownSource(state) {
  return state.ui.shownSource;
}

function getPaneCollapse(state, position) {
  if (position == "start") {
    return state.ui.startPanelCollapsed;
  }

  return state.ui.endPanelCollapsed;
}

function getHighlightedLineRange(state) {
  return state.ui.highlightedLineRange;
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