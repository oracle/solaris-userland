"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addTab = addTab;
exports.moveTab = moveTab;
exports.moveTabBySourceId = moveTabBySourceId;
exports.closeTabForSource = closeTabForSource;
exports.closeTabsForSources = closeTabsForSources;
loader.lazyRequireGetter(this, "_index", "devtools/client/debugger/src/actions/sources/index");
loader.lazyRequireGetter(this, "_index2", "devtools/client/debugger/src/selectors/index");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

/**
 * Redux actions for the editor tabs
 */
function addTab(source) {
  return {
    type: "ADD_TAB",
    source
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

function closeTabForSource(source) {
  return ({
    dispatch
  }) => {
    dispatch(closeTabsForSources([source]));
  };
}

function closeTabsForSources(sources) {
  return ({
    dispatch,
    getState
  }) => {
    if (!sources.length) {
      return;
    } // If we are removing the tabs for the selected location,
    // we need to select another source


    const newSourceToSelect = getNewSourceToSelect(getState(), sources);
    dispatch({
      type: "CLOSE_TABS_FOR_SOURCES",
      sources
    });
    dispatch((0, _index.selectSource)(newSourceToSelect));
  };
}
/**
 * Compute the potential new source to select while closing tabs for a given set of sources.
 *
 * @param {object} state
 *        Redux state object.
 * @param {Array<Source>} closedSources
 *        Ordered list of sources which should be closed.
 *        Should be a consecutive list of tabs matching the order of tabs reducer.
 */


function getNewSourceToSelect(state, closedSources) {
  const selectedLocation = (0, _index2.getSelectedLocation)(state); // Do not try to select any source if none was selected before

  if (!selectedLocation) {
    return null;
  }

  let selectedSource = selectedLocation.source; // When a source is pretty printed, the tab always refer to its minimized/generated source

  if (selectedSource.isPrettyPrinted) {
    selectedSource = selectedSource.generatedSource;
  } // Keep selecting the same source if we aren't removing the currently selected source


  if (!closedSources.includes(selectedSource)) {
    return selectedSource;
  }

  const openedSources = (0, _index2.getOpenedSources)(state);
  const selectedSourceIndex = openedSources.indexOf(selectedSource); // Find the first source **after** the currently selected one, which will still be open and select it

  for (let index = selectedSourceIndex + 1; index < openedSources.length; index++) {
    const source = openedSources[index];

    if (!closedSources.includes(source)) {
      return source;
    }
  } // Otherwise find the last source **before** the currently selected one.


  for (let index = selectedSourceIndex - 1; index >= 0; index--) {
    const source = openedSources[index];

    if (!closedSources.includes(source)) {
      return source;
    }
  } // It looks like we removed all the tabs


  return null;
}