"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addTab = addTab;
exports.moveTab = moveTab;
exports.moveTabBySourceId = moveTabBySourceId;
exports.closeTab = closeTab;
exports.closeTabs = closeTabs;
loader.lazyRequireGetter(this, "_editor", "devtools/client/debugger/src/utils/editor/index");
loader.lazyRequireGetter(this, "_sources", "devtools/client/debugger/src/actions/sources/index");
loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

/**
 * Redux actions for the editor tabs
 * @module actions/tabs
 */
function addTab(source, sourceActor) {
  return {
    type: "ADD_TAB",
    source,
    sourceActor
  };
}

function moveTab(url, tabIndex) {
  return {
    type: "MOVE_TAB",
    url,
    tabIndex
  };
}

function moveTabBySourceId(sourceId, tabIndex) {
  return {
    type: "MOVE_TAB_BY_SOURCE_ID",
    sourceId,
    tabIndex
  };
}
/**
 * @memberof actions/tabs
 * @static
 */


function closeTab(cx, source, reason = "click") {
  return ({
    dispatch,
    getState,
    client
  }) => {
    (0, _editor.removeDocument)(source.id);
    const tabs = (0, _selectors.getSourceTabs)(getState());
    dispatch({
      type: "CLOSE_TAB",
      source
    });
    const newSource = (0, _selectors.getNewSelectedSource)(getState(), tabs);
    dispatch((0, _sources.selectSource)(cx, newSource));
  };
}
/**
 * @memberof actions/tabs
 * @static
 */


function closeTabs(cx, urls) {
  return ({
    dispatch,
    getState,
    client
  }) => {
    const sources = urls.map(url => (0, _selectors.getSourceByURL)(getState(), url)).filter(Boolean);
    const tabs = (0, _selectors.getSourceTabs)(getState());
    sources.map(source => (0, _editor.removeDocument)(source.id));
    dispatch({
      type: "CLOSE_TABS",
      sources
    });
    const source = (0, _selectors.getNewSelectedSource)(getState(), tabs);
    dispatch((0, _sources.selectSource)(cx, source));
  };
}