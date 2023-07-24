"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setPrimaryPaneTab = setPrimaryPaneTab;
exports.closeActiveSearch = closeActiveSearch;
exports.setActiveSearch = setActiveSearch;
exports.toggleFrameworkGrouping = toggleFrameworkGrouping;
exports.toggleInlinePreview = toggleInlinePreview;
exports.toggleEditorWrapping = toggleEditorWrapping;
exports.toggleSourceMapsEnabled = toggleSourceMapsEnabled;
exports.showSource = showSource;
exports.togglePaneCollapse = togglePaneCollapse;
exports.highlightLineRange = highlightLineRange;
exports.flashLineRange = flashLineRange;
exports.clearHighlightLineRange = clearHighlightLineRange;
exports.openConditionalPanel = openConditionalPanel;
exports.closeConditionalPanel = closeConditionalPanel;
exports.clearProjectDirectoryRoot = clearProjectDirectoryRoot;
exports.setProjectDirectoryRoot = setProjectDirectoryRoot;
exports.updateViewport = updateViewport;
exports.updateCursorPosition = updateCursorPosition;
exports.setOrientation = setOrientation;
exports.setSearchOptions = setSearchOptions;
exports.copyToClipboard = copyToClipboard;
exports.setJavascriptTracingLogMethod = setJavascriptTracingLogMethod;
exports.setHideOrShowIgnoredSources = setHideOrShowIgnoredSources;
exports.toggleSourceMapIgnoreList = toggleSourceMapIgnoreList;
loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_select", "devtools/client/debugger/src/actions/sources/select");
loader.lazyRequireGetter(this, "_editor", "devtools/client/debugger/src/utils/editor/index");
loader.lazyRequireGetter(this, "_blackbox", "devtools/client/debugger/src/actions/sources/blackbox");
loader.lazyRequireGetter(this, "_breakpoints", "devtools/client/debugger/src/actions/breakpoints/index");
loader.lazyRequireGetter(this, "_clipboard", "devtools/client/debugger/src/utils/clipboard");
loader.lazyRequireGetter(this, "_asyncValue", "devtools/client/debugger/src/utils/async-value");
loader.lazyRequireGetter(this, "_constants", "devtools/client/debugger/src/constants");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
function setPrimaryPaneTab(tabName) {
  return {
    type: "SET_PRIMARY_PANE_TAB",
    tabName
  };
}

function closeActiveSearch() {
  return {
    type: "TOGGLE_ACTIVE_SEARCH",
    value: null
  };
}

function setActiveSearch(activeSearch) {
  return ({
    dispatch,
    getState
  }) => {
    const activeSearchState = (0, _selectors.getActiveSearch)(getState());

    if (activeSearchState === activeSearch) {
      return;
    }

    if ((0, _selectors.getQuickOpenEnabled)(getState())) {
      dispatch({
        type: "CLOSE_QUICK_OPEN"
      });
    } // Open start panel if it was collapsed so the project search UI is visible


    if (activeSearch === _constants.primaryPaneTabs.PROJECT_SEARCH && (0, _selectors.getPaneCollapse)(getState(), "start")) {
      dispatch({
        type: "TOGGLE_PANE",
        position: "start",
        paneCollapsed: false
      });
    }

    dispatch({
      type: "TOGGLE_ACTIVE_SEARCH",
      value: activeSearch
    });
  };
}

function toggleFrameworkGrouping(toggleValue) {
  return ({
    dispatch,
    getState
  }) => {
    dispatch({
      type: "TOGGLE_FRAMEWORK_GROUPING",
      value: toggleValue
    });
  };
}

function toggleInlinePreview(toggleValue) {
  return ({
    dispatch,
    getState
  }) => {
    dispatch({
      type: "TOGGLE_INLINE_PREVIEW",
      value: toggleValue
    });
  };
}

function toggleEditorWrapping(toggleValue) {
  return ({
    dispatch,
    getState
  }) => {
    (0, _editor.updateDocuments)(doc => doc.cm.setOption("lineWrapping", toggleValue));
    dispatch({
      type: "TOGGLE_EDITOR_WRAPPING",
      value: toggleValue
    });
  };
}

function toggleSourceMapsEnabled(toggleValue) {
  return ({
    dispatch,
    getState
  }) => {
    dispatch({
      type: "TOGGLE_SOURCE_MAPS_ENABLED",
      value: toggleValue
    });
  };
}

function showSource(cx, sourceId) {
  return ({
    dispatch,
    getState
  }) => {
    const source = (0, _selectors.getSource)(getState(), sourceId);

    if (!source) {
      return;
    }

    if ((0, _selectors.getPaneCollapse)(getState(), "start")) {
      dispatch({
        type: "TOGGLE_PANE",
        position: "start",
        paneCollapsed: false
      });
    }

    dispatch(setPrimaryPaneTab("sources"));
    dispatch((0, _select.selectSource)(cx, source));
  };
}

function togglePaneCollapse(position, paneCollapsed) {
  return ({
    dispatch,
    getState
  }) => {
    const prevPaneCollapse = (0, _selectors.getPaneCollapse)(getState(), position);

    if (prevPaneCollapse === paneCollapsed) {
      return;
    } // Set active search to null when closing start panel if project search was active


    if (position === "start" && paneCollapsed && (0, _selectors.getActiveSearch)(getState()) === _constants.primaryPaneTabs.PROJECT_SEARCH) {
      dispatch(closeActiveSearch());
    }

    dispatch({
      type: "TOGGLE_PANE",
      position,
      paneCollapsed
    });
  };
}
/**
 * Highlight one or many lines in CodeMirror for a given source.
 *
 * @param {Object} location
 * @param {String} location.sourceId
 *        The precise source to highlight.
 * @param {Number} location.start
 *        The 1-based index of first line to highlight.
 * @param {Number} location.end
 *        The 1-based index of last line to highlight.
 */


function highlightLineRange(location) {
  return {
    type: "HIGHLIGHT_LINES",
    location
  };
}

function flashLineRange(location) {
  return ({
    dispatch
  }) => {
    dispatch(highlightLineRange(location));
    setTimeout(() => dispatch(clearHighlightLineRange()), 200);
  };
}

function clearHighlightLineRange() {
  return {
    type: "CLEAR_HIGHLIGHT_LINES"
  };
}

function openConditionalPanel(location, log = false) {
  if (!location) {
    return null;
  }

  return {
    type: "OPEN_CONDITIONAL_PANEL",
    location,
    log
  };
}

function closeConditionalPanel() {
  return {
    type: "CLOSE_CONDITIONAL_PANEL"
  };
}

function clearProjectDirectoryRoot(cx) {
  return {
    type: "SET_PROJECT_DIRECTORY_ROOT",
    cx,
    url: "",
    name: ""
  };
}

function setProjectDirectoryRoot(cx, newRoot, newName) {
  return ({
    dispatch,
    getState
  }) => {
    // If the new project root is against the top level thread,
    // replace its thread ID with "top-level", so that later,
    // getDirectoryForUniquePath could match the project root,
    // even after a page reload where the new top level thread actor ID
    // will be different.
    const mainThread = (0, _selectors.getMainThread)(getState());

    if (mainThread && newRoot.startsWith(mainThread.actor)) {
      newRoot = newRoot.replace(mainThread.actor, "top-level");
    }

    dispatch({
      type: "SET_PROJECT_DIRECTORY_ROOT",
      cx,
      url: newRoot,
      name: newName
    });
  };
}

function updateViewport() {
  return {
    type: "SET_VIEWPORT",
    viewport: (0, _editor.getLocationsInViewport)((0, _editor.getEditor)())
  };
}

function updateCursorPosition(cursorPosition) {
  return {
    type: "SET_CURSOR_POSITION",
    cursorPosition
  };
}

function setOrientation(orientation) {
  return {
    type: "SET_ORIENTATION",
    orientation
  };
}

function setSearchOptions(searchKey, searchOptions) {
  return {
    type: "SET_SEARCH_OPTIONS",
    searchKey,
    searchOptions
  };
}

function copyToClipboard(location) {
  return ({
    dispatch,
    getState
  }) => {
    const content = (0, _selectors.getSourceContent)(getState(), location);

    if (content && (0, _asyncValue.isFulfilled)(content) && content.value.type === "text") {
      (0, _clipboard.copyToTheClipboard)(content.value.value);
    }
  };
}

function setJavascriptTracingLogMethod(value) {
  return ({
    dispatch,
    getState
  }) => {
    dispatch({
      type: "SET_JAVASCRIPT_TRACING_LOG_METHOD",
      value
    });
  };
}

function setHideOrShowIgnoredSources(shouldHide) {
  return ({
    dispatch,
    getState
  }) => {
    dispatch({
      type: "HIDE_IGNORED_SOURCES",
      shouldHide
    });
  };
}

function toggleSourceMapIgnoreList(cx, shouldEnable) {
  return async thunkArgs => {
    const {
      dispatch,
      getState
    } = thunkArgs;
    const ignoreListSourceUrls = (0, _selectors.getIgnoreListSourceUrls)(getState()); // Blackbox the source actors on the server

    for (const url of ignoreListSourceUrls) {
      const source = (0, _selectors.getSourceByURL)(getState(), url);
      await (0, _blackbox.blackboxSourceActorsForSource)(thunkArgs, source, shouldEnable); // Disable breakpoints in sources on the ignore list

      const breakpoints = (0, _selectors.getBreakpointsForSource)(getState(), source.id);
      await dispatch((0, _breakpoints.toggleBreakpoints)(cx, shouldEnable, breakpoints));
    }

    await dispatch({
      type: "ENABLE_SOURCEMAP_IGNORELIST",
      shouldEnable
    });
  };
}