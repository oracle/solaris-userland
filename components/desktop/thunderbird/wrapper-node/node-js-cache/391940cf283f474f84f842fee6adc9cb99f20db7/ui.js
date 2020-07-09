"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setPrimaryPaneTab = setPrimaryPaneTab;
exports.closeActiveSearch = closeActiveSearch;
exports.setActiveSearch = setActiveSearch;
exports.updateActiveFileSearch = updateActiveFileSearch;
exports.toggleFrameworkGrouping = toggleFrameworkGrouping;
exports.toggleInlinePreview = toggleInlinePreview;
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
exports.copyToClipboard = copyToClipboard;
loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_select", "devtools/client/debugger/src/actions/sources/select");
loader.lazyRequireGetter(this, "_editor", "devtools/client/debugger/src/utils/editor/index");
loader.lazyRequireGetter(this, "_fileSearch", "devtools/client/debugger/src/actions/file-search");
loader.lazyRequireGetter(this, "_clipboard", "devtools/client/debugger/src/utils/clipboard");
loader.lazyRequireGetter(this, "_asyncValue", "devtools/client/debugger/src/utils/async-value");

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
    }

    dispatch({
      type: "TOGGLE_ACTIVE_SEARCH",
      value: activeSearch
    });
  };
}

function updateActiveFileSearch(cx) {
  return ({
    dispatch,
    getState
  }) => {
    const isFileSearchOpen = (0, _selectors.getActiveSearch)(getState()) === "file";
    const fileSearchQuery = (0, _selectors.getFileSearchQuery)(getState());

    if (isFileSearchOpen && fileSearchQuery) {
      const editor = (0, _editor.getEditor)();
      dispatch((0, _fileSearch.searchContents)(cx, fileSearchQuery, editor, false));
    }
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
    dispatch({
      type: "SHOW_SOURCE",
      source: null
    });
    dispatch((0, _select.selectSource)(cx, source.id));
    dispatch({
      type: "SHOW_SOURCE",
      source
    });
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
    }

    dispatch({
      type: "TOGGLE_PANE",
      position,
      paneCollapsed
    });
  };
}
/**
 * @memberof actions/sources
 * @static
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
/**
 * @memberof actions/sources
 * @static
 */


function clearHighlightLineRange() {
  return {
    type: "CLEAR_HIGHLIGHT_LINES"
  };
}

function openConditionalPanel(location, log = false) {
  if (!location) {
    return;
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
    url: ""
  };
}

function setProjectDirectoryRoot(cx, newRoot) {
  return ({
    dispatch,
    getState
  }) => {
    const threadActor = (0, _selectors.startsWithThreadActor)(getState(), newRoot);
    let curRoot = (0, _selectors.getProjectDirectoryRoot)(getState()); // Remove the thread actor ID from the root path

    if (threadActor) {
      newRoot = newRoot.slice(threadActor.length + 1);
      curRoot = curRoot.slice(threadActor.length + 1);
    }

    if (newRoot && curRoot) {
      const newRootArr = newRoot.replace(/\/+/g, "/").split("/");
      const curRootArr = curRoot.replace(/^\//, "").replace(/\/+/g, "/").split("/");

      if (newRootArr[0] !== curRootArr[0]) {
        newRootArr.splice(0, 2);
        newRoot = `${curRoot}/${newRootArr.join("/")}`;
      }
    }

    dispatch({
      type: "SET_PROJECT_DIRECTORY_ROOT",
      cx,
      url: newRoot
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

function copyToClipboard(source) {
  return ({
    dispatch,
    getState
  }) => {
    const content = (0, _selectors.getSourceContent)(getState(), source.id);

    if (content && (0, _asyncValue.isFulfilled)(content) && content.value.type === "text") {
      (0, _clipboard.copyToTheClipboard)(content.value.value);
    }
  };
}