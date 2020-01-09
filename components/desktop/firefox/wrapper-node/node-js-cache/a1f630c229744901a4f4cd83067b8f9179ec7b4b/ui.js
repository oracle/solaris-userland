"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createUIState = undefined;
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

var _makeRecord = require("../utils/makeRecord");

var _makeRecord2 = _interopRequireDefault(_makeRecord);

var _prefs = require("../utils/prefs");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

/**
 * UI reducer
 * @module reducers/ui
 */

const createUIState = exports.createUIState = (0, _makeRecord2.default)({
  selectedPrimaryPaneTab: "sources",
  activeSearch: null,
  shownSource: null,
  startPanelCollapsed: _prefs.prefs.startPanelCollapsed,
  endPanelCollapsed: _prefs.prefs.endPanelCollapsed,
  frameworkGroupingOn: _prefs.prefs.frameworkGroupingOn,
  highlightedLineRange: undefined,
  conditionalPanelLocation: null,
  isLogPoint: false,
  orientation: "horizontal",
  viewport: null
});

function update(state = createUIState(), action) {
  switch (action.type) {
    case "TOGGLE_ACTIVE_SEARCH":
      {
        return state.set("activeSearch", action.value);
      }

    case "TOGGLE_FRAMEWORK_GROUPING":
      {
        _prefs.prefs.frameworkGroupingOn = action.value;
        return state.set("frameworkGroupingOn", action.value);
      }

    case "SET_ORIENTATION":
      {
        return state.set("orientation", action.orientation);
      }

    case "SHOW_SOURCE":
      {
        return state.set("shownSource", action.source);
      }

    case "TOGGLE_PANE":
      {
        if (action.position == "start") {
          _prefs.prefs.startPanelCollapsed = action.paneCollapsed;
          return state.set("startPanelCollapsed", action.paneCollapsed);
        }

        _prefs.prefs.endPanelCollapsed = action.paneCollapsed;
        return state.set("endPanelCollapsed", action.paneCollapsed);
      }

    case "HIGHLIGHT_LINES":
      const { start, end, sourceId } = action.location;
      let lineRange = {};

      if (start && end && sourceId) {
        lineRange = { start, end, sourceId };
      }

      return state.set("highlightedLineRange", lineRange);

    case "CLOSE_QUICK_OPEN":
    case "CLEAR_HIGHLIGHT_LINES":
      return state.set("highlightedLineRange", {});

    case "OPEN_CONDITIONAL_PANEL":
      return state.set("conditionalPanelLocation", action.location).set("isLogPoint", action.log);

    case "CLOSE_CONDITIONAL_PANEL":
      return state.set("conditionalPanelLocation", null);

    case "SET_PRIMARY_PANE_TAB":
      return state.set("selectedPrimaryPaneTab", action.tabName);

    case "CLOSE_PROJECT_SEARCH":
      {
        if (state.get("activeSearch") === "project") {
          return state.set("activeSearch", null);
        }
        return state;
      }

    case "SET_VIEWPORT":
      {
        return state.set("viewport", action.viewport);
      }

    case "NAVIGATE":
      {
        return state.set("activeSearch", null).set("highlightedLineRange", {});
      }

    default:
      {
        return state;
      }
  }
}

// NOTE: we'd like to have the app state fully typed
// https://github.com/firefox-devtools/debugger/blob/master/src/reducers/sources.js#L179-L185
function getSelectedPrimaryPaneTab(state) {
  return state.ui.get("selectedPrimaryPaneTab");
}

function getActiveSearch(state) {
  return state.ui.get("activeSearch");
}

function getFrameworkGroupingState(state) {
  return state.ui.get("frameworkGroupingOn");
}

function getShownSource(state) {
  return state.ui.get("shownSource");
}

function getPaneCollapse(state, position) {
  if (position == "start") {
    return state.ui.get("startPanelCollapsed");
  }

  return state.ui.get("endPanelCollapsed");
}

function getHighlightedLineRange(state) {
  return state.ui.get("highlightedLineRange");
}

function getConditionalPanelLocation(state) {
  return state.ui.get("conditionalPanelLocation");
}

function getLogPointStatus(state) {
  return state.ui.get("isLogPoint");
}

function getOrientation(state) {
  return state.ui.get("orientation");
}

function getViewport(state) {
  return state.ui.get("viewport");
}

exports.default = update;