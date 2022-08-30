"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tabExists = tabExists;
exports.hasPrettyTab = hasPrettyTab;
exports.getNewSelectedSourceId = getNewSelectedSourceId;
exports.getSourcesForTabs = exports.getSourceTabs = exports.getTabs = void 0;

var _reselect = require("devtools/client/shared/vendor/reselect");

loader.lazyRequireGetter(this, "_shallowEqual", "devtools/client/debugger/src/utils/shallow-equal");
loader.lazyRequireGetter(this, "_source", "devtools/client/debugger/src/utils/source");
loader.lazyRequireGetter(this, "_sources", "devtools/client/debugger/src/selectors/sources");

var _devtoolsSourceMap = require("devtools/client/shared/source-map/index.js");

loader.lazyRequireGetter(this, "_tabs", "devtools/client/debugger/src/utils/tabs");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
const getTabs = state => state.tabs.tabs;

exports.getTabs = getTabs;
const getSourceTabs = (0, _reselect.createSelector)(state => state.tabs, ({
  tabs
}) => tabs.filter(tab => tab.sourceId));
exports.getSourceTabs = getSourceTabs;
const getSourcesForTabs = (0, _reselect.createSelector)(_sources.getSourcesMap, getSourceTabs, (sourcesMap, sourceTabs) => {
  return sourceTabs.map(tab => sourcesMap.get(tab.sourceId));
}, {
  equalityCheck: _shallowEqual.shallowEqual,
  resultEqualityCheck: _shallowEqual.shallowEqual
});
exports.getSourcesForTabs = getSourcesForTabs;

function tabExists(state, sourceId) {
  return !!getSourceTabs(state).find(tab => tab.sourceId == sourceId);
}

function hasPrettyTab(state, sourceUrl) {
  const prettyUrl = (0, _source.getPrettySourceURL)(sourceUrl);
  return !!getSourceTabs(state).find(tab => tab.url === prettyUrl);
}
/**
 * Gets the next tab to select when a tab closes. Heuristics:
 * 1. if the selected tab is available, it remains selected
 * 2. if it is gone, the next available tab to the left should be active
 * 3. if the first tab is active and closed, select the second tab
 */


function getNewSelectedSourceId(state, tabList) {
  const {
    selectedLocation
  } = state.sources;
  const availableTabs = state.tabs.tabs;

  if (!selectedLocation) {
    return "";
  }

  const selectedTab = (0, _sources.getLocationSource)(state, selectedLocation);

  if (!selectedTab) {
    return "";
  }

  const matchingTab = availableTabs.find(tab => (0, _tabs.isSimilarTab)(tab, selectedTab.url, (0, _devtoolsSourceMap.isOriginalId)(selectedLocation.sourceId)));

  if (matchingTab) {
    const {
      sources
    } = state.sources;

    if (!sources) {
      return "";
    }

    const selectedSource = (0, _sources.getSpecificSourceByURL)(state, selectedTab.url, selectedTab.isOriginal);

    if (selectedSource) {
      return selectedSource.id;
    }

    return "";
  }

  const tabUrls = tabList.map(tab => tab.url);
  const leftNeighborIndex = Math.max(tabUrls.indexOf(selectedTab.url) - 1, 0);
  const lastAvailbleTabIndex = availableTabs.length - 1;
  const newSelectedTabIndex = Math.min(leftNeighborIndex, lastAvailbleTabIndex);
  const availableTab = availableTabs[newSelectedTabIndex];

  if (availableTab) {
    const tabSource = (0, _sources.getSpecificSourceByURL)(state, availableTab.url, availableTab.isOriginal);

    if (tabSource) {
      return tabSource.id;
    }
  }

  return "";
}