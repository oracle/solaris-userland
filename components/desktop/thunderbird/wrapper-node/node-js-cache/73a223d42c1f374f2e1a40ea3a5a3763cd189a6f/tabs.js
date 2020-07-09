"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getNewSelectedSourceId = getNewSelectedSourceId;
exports.tabExists = tabExists;
exports.hasPrettyTab = hasPrettyTab;
exports.default = exports.getSourcesForTabs = exports.getSourceTabs = exports.getTabs = void 0;

var _reselect = require("devtools/client/shared/vendor/reselect");

var _devtoolsSourceMap = require("devtools/client/shared/source-map/index.js");

var _lodashMove = _interopRequireDefault(require("devtools/client/debugger/dist/vendors").vendored["lodash-move"]);

loader.lazyRequireGetter(this, "_tabs", "devtools/client/debugger/src/utils/tabs");
loader.lazyRequireGetter(this, "_resource", "devtools/client/debugger/src/utils/resource/index");
loader.lazyRequireGetter(this, "_source", "devtools/client/debugger/src/utils/source");
loader.lazyRequireGetter(this, "_sources", "devtools/client/debugger/src/reducers/sources");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

/**
 * Tabs reducer
 * @module reducers/tabs
 */
function initialTabState() {
  return {
    tabs: []
  };
}

function resetTabState(state) {
  const tabs = (0, _tabs.persistTabs)(state.tabs);
  return {
    tabs
  };
}

function update(state = initialTabState(), action) {
  switch (action.type) {
    case "ADD_TAB":
    case "UPDATE_TAB":
      return updateTabList(state, action);

    case "MOVE_TAB":
      return moveTabInList(state, action);

    case "MOVE_TAB_BY_SOURCE_ID":
      return moveTabInListBySourceId(state, action);

    case "CLOSE_TAB":
      return removeSourceFromTabList(state, action);

    case "CLOSE_TABS":
      return removeSourcesFromTabList(state, action);

    case "ADD_SOURCE":
      return addVisibleTabs(state, [action.source]);

    case "ADD_SOURCES":
      return addVisibleTabs(state, action.sources);

    case "SET_SELECTED_LOCATION":
      {
        return addSelectedSource(state, action.source);
      }

    case "NAVIGATE":
      {
        return resetTabState(state);
      }

    default:
      return state;
  }
}
/**
 * Gets the next tab to select when a tab closes. Heuristics:
 * 1. if the selected tab is available, it remains selected
 * 2. if it is gone, the next available tab to the left should be active
 * 3. if the first tab is active and closed, select the second tab
 *
 * @memberof reducers/tabs
 * @static
 */


function getNewSelectedSourceId(state, tabList) {
  const {
    selectedLocation
  } = state.sources;
  const availableTabs = state.tabs.tabs;

  if (!selectedLocation) {
    return "";
  }

  const selectedTab = (0, _sources.getSource)(state, selectedLocation.sourceId);

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

function matchesSource(tab, source) {
  return tab.sourceId === source.id || matchesUrl(tab, source);
}

function matchesUrl(tab, source) {
  return tab.url === source.url && tab.isOriginal == (0, _devtoolsSourceMap.isOriginalId)(source.id);
}

function addSelectedSource(state, source) {
  if (state.tabs.filter(({
    sourceId
  }) => sourceId).map(({
    sourceId
  }) => sourceId).includes(source.id)) {
    return state;
  }

  const isOriginal = (0, _devtoolsSourceMap.isOriginalId)(source.id);
  return updateTabList(state, {
    url: source.url,
    isOriginal,
    framework: null,
    sourceId: source.id
  });
}

function addVisibleTabs(state, sources) {
  const tabCount = state.tabs.filter(({
    sourceId
  }) => sourceId).length;
  const tabs = state.tabs.map(tab => {
    const source = sources.find(src => matchesUrl(tab, src));

    if (!source) {
      return tab;
    }

    return { ...tab,
      sourceId: source.id
    };
  }).filter(tab => tab.sourceId);

  if (tabs.length == tabCount) {
    return state;
  }

  return {
    tabs
  };
}

function removeSourceFromTabList(state, {
  source
}) {
  const {
    tabs
  } = state;
  const newTabs = tabs.filter(tab => !matchesSource(tab, source));
  return {
    tabs: newTabs
  };
}

function removeSourcesFromTabList(state, {
  sources
}) {
  const {
    tabs
  } = state;
  const newTabs = sources.reduce((tabList, source) => tabList.filter(tab => !matchesSource(tab, source)), tabs);
  return {
    tabs: newTabs
  };
}
/**
 * Adds the new source to the tab list if it is not already there
 * @memberof reducers/tabs
 * @static
 */


function updateTabList(state, {
  url,
  framework = null,
  sourceId,
  isOriginal = false
}) {
  let {
    tabs
  } = state; // Set currentIndex to -1 for URL-less tabs so that they aren't
  // filtered by isSimilarTab

  const currentIndex = url ? tabs.findIndex(tab => (0, _tabs.isSimilarTab)(tab, url, isOriginal)) : -1;

  if (currentIndex === -1) {
    const newTab = {
      url,
      framework,
      sourceId,
      isOriginal
    };
    tabs = [newTab, ...tabs];
  } else if (framework) {
    tabs[currentIndex].framework = framework;
  }

  return { ...state,
    tabs
  };
}

function moveTabInList(state, {
  url,
  tabIndex: newIndex
}) {
  let {
    tabs
  } = state;
  const currentIndex = tabs.findIndex(tab => tab.url == url);
  tabs = (0, _lodashMove.default)(tabs, currentIndex, newIndex);
  return {
    tabs
  };
}

function moveTabInListBySourceId(state, {
  sourceId,
  tabIndex: newIndex
}) {
  let {
    tabs
  } = state;
  const currentIndex = tabs.findIndex(tab => tab.sourceId == sourceId);
  tabs = (0, _lodashMove.default)(tabs, currentIndex, newIndex);
  return {
    tabs
  };
} // Selectors


const getTabs = state => state.tabs.tabs;

exports.getTabs = getTabs;
const getSourceTabs = (0, _reselect.createSelector)(state => state.tabs, ({
  tabs
}) => tabs.filter(tab => tab.sourceId));
exports.getSourceTabs = getSourceTabs;

const getSourcesForTabs = state => {
  const tabs = getSourceTabs(state);
  const sources = (0, _sources.getSources)(state);
  return querySourcesForTabs(sources, tabs);
};

exports.getSourcesForTabs = getSourcesForTabs;
const querySourcesForTabs = (0, _resource.makeShallowQuery)({
  filter: (_, tabs) => tabs.map(({
    sourceId
  }) => sourceId),
  map: _sources.resourceAsSourceBase,
  reduce: items => items
});

function tabExists(state, sourceId) {
  return !!getSourceTabs(state).find(tab => tab.sourceId == sourceId);
}

function hasPrettyTab(state, sourceUrl) {
  const prettyUrl = (0, _source.getPrettySourceURL)(sourceUrl);
  return !!getSourceTabs(state).find(tab => tab.url === prettyUrl);
}

var _default = update;
exports.default = _default;