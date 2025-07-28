"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tabExists = tabExists;
exports.hasPrettyTab = hasPrettyTab;
exports.getNewSelectedSource = getNewSelectedSource;
exports.getSourcesForTabs = exports.getSourceTabs = exports.getTabs = void 0;

var _reselect = require("devtools/client/shared/vendor/reselect");

loader.lazyRequireGetter(this, "_source", "devtools/client/debugger/src/utils/source");
loader.lazyRequireGetter(this, "_sources", "devtools/client/debugger/src/selectors/sources");
loader.lazyRequireGetter(this, "_tabs", "devtools/client/debugger/src/utils/tabs");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
const getTabs = state => state.tabs.tabs; // Return the list of tabs which relates to an active source


exports.getTabs = getTabs;
const getSourceTabs = (0, _reselect.createSelector)(getTabs, tabs => tabs.filter(tab => tab.source));
exports.getSourceTabs = getSourceTabs;
const getSourcesForTabs = (0, _reselect.createSelector)(getSourceTabs, sourceTabs => {
  return sourceTabs.map(tab => tab.source);
});
exports.getSourcesForTabs = getSourcesForTabs;

function tabExists(state, sourceId) {
  return !!getSourceTabs(state).find(tab => tab.source.id == sourceId);
}

function hasPrettyTab(state, source) {
  const prettyUrl = (0, _source.getPrettySourceURL)(source.url);
  return getTabs(state).some(tab => tab.url === prettyUrl);
}
/**
 * Gets the next tab to select when a tab closes. Heuristics:
 * 1. if the selected tab is available, it remains selected
 * 2. if it is gone, the next available tab to the left should be active
 * 3. if the first tab is active and closed, select the second tab
 */


function getNewSelectedSource(state, tabList) {
  const {
    selectedLocation
  } = state.sources;
  const availableTabs = getTabs(state);

  if (!selectedLocation) {
    return null;
  }

  const selectedSource = selectedLocation.source;

  if (!selectedSource) {
    return null;
  }

  const matchingTab = availableTabs.find(tab => (0, _tabs.isSimilarTab)(tab, selectedSource.url, selectedSource.isOriginal));

  if (matchingTab) {
    const specificSelectedSource = (0, _sources.getSpecificSourceByURL)(state, selectedSource.url, selectedSource.isOriginal);

    if (specificSelectedSource) {
      return specificSelectedSource;
    }

    return null;
  }

  const tabUrls = tabList.map(tab => tab.url);
  const leftNeighborIndex = Math.max(tabUrls.indexOf(selectedSource.url) - 1, 0);
  const lastAvailbleTabIndex = availableTabs.length - 1;
  const newSelectedTabIndex = Math.min(leftNeighborIndex, lastAvailbleTabIndex);
  const availableTab = availableTabs[newSelectedTabIndex];

  if (availableTab) {
    const tabSource = (0, _sources.getSpecificSourceByURL)(state, availableTab.url, availableTab.isOriginal);

    if (tabSource) {
      return tabSource;
    }
  }

  return null;
}