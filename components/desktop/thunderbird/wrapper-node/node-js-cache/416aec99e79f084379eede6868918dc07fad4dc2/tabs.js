"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initialTabState = initialTabState;
exports.default = void 0;
loader.lazyRequireGetter(this, "_prefs", "devtools/client/debugger/src/utils/prefs");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

/**
 * Tabs reducer
 */
function initialTabState({
  urls = [],
  prettyPrintedURLs = new Set()
} = {}) {
  return {
    // List of source URL's which should be automatically opened in a tab.
    // This array will be stored as-is in the persisted async storage.
    // The order of URLs in this list is important and will be used to restore
    // tabs in the same order.
    //
    // Array<String>
    urls,
    // List of sources which are pretty printed.
    //
    // Set<String>
    // (converted into Array in the asyncStorage)
    prettyPrintedURLs,
    // Similar but opposite of prettyPrintedURLs.
    // List of sources which pretty printing has been manually disabled
    // or are not considered minified when auto-pretty printing is enabled
    // Set<String>
    prettyPrintedDisabledURLs: new Set(),
    // List of sources for which tabs should be currently displayed.
    // This is transient data, specific to the current document and at this precise time.
    //
    // Array<Source objects>
    openedSources: []
  };
}

function update(state = initialTabState(), action) {
  switch (action.type) {
    case "ADD_TAB":
      return updateTabsWithNewActiveSource(state, [action.source], true);

    case "MOVE_TAB":
      return moveTabInList(state, action.url, action.tabIndex);

    case "MOVE_TAB_BY_SOURCE_ID":
      return moveTabInListBySourceId(state, action.sourceId, action.tabIndex);

    case "CLOSE_TABS_FOR_SOURCES":
      return closeTabsForSources(state, action.sources, true);

    case "ADD_ORIGINAL_SOURCES":
      {
        return updateTabsWithNewActiveSource(state, action.originalSources, false);
      }

    case "INSERT_SOURCE_ACTORS":
      {
        const sources = action.sourceActors.map(sourceActor => sourceActor.sourceObject);
        return updateTabsWithNewActiveSource(state, sources, false);
      }

    case "REMOVE_SOURCES":
      {
        return closeTabsForSources(state, action.sources, false);
      }

    case "REMOVE_PRETTY_PRINTED_SOURCE":
      {
        return removePrettyPrintedSource(state, action.source);
      }

    default:
      return state;
  }
}
/**
 * Allow unregistering pretty printed source earlier than source unregistering.
 */


function removePrettyPrintedSource(state, source) {
  const generatedSourceURL = source.isPrettyPrinted ? source.generatedSource.url : source.url;
  const prettyPrintedURLs = new Set(state.prettyPrintedURLs);
  prettyPrintedURLs.delete(generatedSourceURL);
  let prettyPrintedDisabledURLs = state.prettyPrintedDisabledURLs; // When auto-pretty printing is enabled, record sources which have been manually disabled

  if (_prefs.prefs.autoPrettyPrint) {
    prettyPrintedDisabledURLs = new Set(prettyPrintedDisabledURLs);
    prettyPrintedDisabledURLs.add(generatedSourceURL);
  }

  return { ...state,
    prettyPrintedURLs,
    prettyPrintedDisabledURLs
  };
}
/**
 * Update the tab list for a given set of sources.
 * Either when the user adds a tab (forceAdding will be true),
 * or when sources are registered (forceAdding will be false).
 *
 * @param {object} state
 * @param {Array<Source>} sources
 * @param {boolean} forceAdding
 *        If true, a tab should be opened for all the passed sources,
 *        even if the source has no url.
 *        If false, only sources matching a previously opened URL
 *        will be restored.
 * @return {object} Modified state object
 */


function updateTabsWithNewActiveSource(state, sources, forceAdding = false) {
  let {
    urls,
    openedSources,
    prettyPrintedURLs,
    prettyPrintedDisabledURLs
  } = state;

  for (let source of sources) {
    // When we are adding a pretty printed source, we don't add a new tab.
    // We  only ensure the tab for the minimized/generated source is opened.
    //
    // We then rely on `prettyPrintedURLs` to pick the right source in the editor.
    if (source.isPrettyPrinted) {
      source = source.generatedSource; // Also ensure bookeeping that the source has been pretty printed.

      if (state.prettyPrintedURLs == prettyPrintedURLs) {
        prettyPrintedURLs = new Set(prettyPrintedURLs);
      }

      prettyPrintedURLs.add(source.url);
      prettyPrintedDisabledURLs.delete(source.url);
    }

    const {
      url
    } = source; // Ignore the source if it is already opened.
    // Also, when we are adding the tab (forceAdding=true), we want to add the tab for source,
    // even if they don't have a URL.
    // Otherwise, when we are simply registering a new active source (forceAdding=false),
    // we only want to show a tab if the source is in the persisted state.urls list.

    if (openedSources.includes(source) || !forceAdding && (!url || !urls.includes(url))) {
      continue;
    } // If we are pass that point in the for loop, we are opening a tab for the current source


    if (openedSources === state.openedSources) {
      openedSources = [...openedSources];
    }

    let index = -1;

    if (url) {
      if (!urls.includes(url)) {
        // Ensure adding the url to the persisted list
        if (urls === state.urls) {
          urls = [...state.urls];
        } // Newly opened tabs are always added first.


        urls.unshift(url);
      } else {
        // In this branch, we are restoring a previously opened tab.
        // We lookup for the position of this source in the persisted list (state.urls),
        // then find the index for the first persisted source which has an opened tab before it.
        const indexInUrls = urls.indexOf(url);

        for (let i = indexInUrls - 1; i >= 0; i--) {
          const previousSourceUrl = urls[i];
          index = openedSources.findIndex(s => s.url === previousSourceUrl);

          if (index != -1) {
            break;
          }
        }
      }
    }

    if (index == -1) {
      // Newly opened tabs are always added first.
      openedSources.unshift(source);
    } else {
      // Otherwise add the source at the expected location.
      // i.e. right after the source already opened which is before the currently added source in the persistent list of URLs (state.urls)
      openedSources.splice(index + 1, 0, source);
    }
  }

  if (openedSources != state.openedSources || urls != state.urls || prettyPrintedURLs != state.prettyPrintedURLs || prettyPrintedDisabledURLs != state.prettyPrintedDisabledURLs) {
    return { ...state,
      urls,
      openedSources,
      prettyPrintedURLs,
      prettyPrintedDisabledURLs
    };
  }

  return state;
}

function closeTabsForSources(state, sources, permanent = false) {
  if (!sources.length) {
    return state;
  } // Pretty printed source have their tab refering to the minimized source


  const tabSources = sources.map(s => s.isPrettyPrinted ? s.generatedSource : s);
  const newOpenedSources = state.openedSources.filter(source => {
    return !tabSources.includes(source);
  }); // Bails out if no tab has changed

  if (newOpenedSources.length == state.openedSources.length) {
    return state;
  } // Also remove from the url list, if the tab closing is permanent.
  // i.e. when the user requested to close the tab, and not when a source is simply unregistered from the store.


  let {
    urls,
    prettyPrintedURLs
  } = state;

  if (permanent) {
    const sourceURLs = tabSources.map(source => source.url);
    urls = state.urls.filter(url => !sourceURLs.includes(url)); // In case of pretty printing, tab's always refer to the minimized source.
    // So it is fair to unregister the tab's source's URL from `prettyPrintedURLs`
    // which contains the urls of the minmized source.

    prettyPrintedURLs = new Set(state.prettyPrintedURLs);

    for (const url of sourceURLs) {
      prettyPrintedURLs.delete(url);
    }
  }

  return { ...state,
    urls,
    prettyPrintedURLs,
    openedSources: newOpenedSources
  };
}

function moveTabInList(state, url, newIndex) {
  const currentIndex = state.openedSources.findIndex(source => source.url == url);
  return moveTab(state, currentIndex, newIndex);
}

function moveTabInListBySourceId(state, sourceId, newIndex) {
  const currentIndex = state.openedSources.findIndex(source => source.id == sourceId);
  return moveTab(state, currentIndex, newIndex);
}

function moveTab(state, currentIndex, newIndex) {
  // Avoid any state change if we are on the same position or the new is invalid
  if (currentIndex == newIndex || isNaN(newIndex)) {
    return state;
  }

  const {
    openedSources
  } = state;
  const source = openedSources[currentIndex];
  const newOpenedSources = Array.from(openedSources); // Remove the tab from its current location

  newOpenedSources.splice(currentIndex, 1); // And add it to the new one

  newOpenedSources.splice(newIndex, 0, source); // If the tabs relates to a source with a URL, also move it in the list of URLs

  let newUrls = state.urls;
  const {
    url
  } = source;

  if (url) {
    const urlIndex = state.urls.indexOf(url);
    let newUrlIndex = 0; // Lookup for the previous tab with a URL in order to move the tab
    // just after that one in the list of all URLs.

    for (let i = newIndex; i >= 0; i--) {
      const previousTabUrl = newOpenedSources[i].url;

      if (previousTabUrl) {
        newUrlIndex = state.urls.indexOf(previousTabUrl);
        break;
      }
    }

    if (urlIndex != -1 && newUrlIndex != -1) {
      newUrls = Array.from(state.urls); // Remove the tab from its current location

      newUrls.splice(urlIndex, 1); // And add it to the new one

      newUrls.splice(newUrlIndex, 0, url);
    }
  }

  return { ...state,
    urls: newUrls,
    openedSources: newOpenedSources
  };
}

var _default = update;
exports.default = _default;