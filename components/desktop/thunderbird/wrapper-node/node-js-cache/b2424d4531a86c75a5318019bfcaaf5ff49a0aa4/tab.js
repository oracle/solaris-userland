"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.showTabContextMenu = showTabContextMenu;
loader.lazyRequireGetter(this, "_menu", "devtools/client/debugger/src/context-menu/menu");
loader.lazyRequireGetter(this, "_tabs", "devtools/client/debugger/src/utils/tabs");
loader.lazyRequireGetter(this, "_index", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_blackbox", "devtools/client/debugger/src/actions/sources/blackbox");
loader.lazyRequireGetter(this, "_prettyPrint", "devtools/client/debugger/src/actions/sources/prettyPrint");
loader.lazyRequireGetter(this, "_ui", "devtools/client/debugger/src/actions/ui");
loader.lazyRequireGetter(this, "_tabs2", "devtools/client/debugger/src/actions/tabs");
loader.lazyRequireGetter(this, "_source", "devtools/client/debugger/src/utils/source");
loader.lazyRequireGetter(this, "_clipboard", "devtools/client/debugger/src/utils/clipboard");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

/**
 * Show the context menu of Tab.
 *
 * @param {object} event
 *        The context-menu DOM event.
 * @param {object} source
 *        Source object of the related Tab.
 */
function showTabContextMenu(event, source) {
  return async ({
    dispatch,
    getState
  }) => {
    const state = getState();
    const selectedLocation = (0, _index.getSelectedLocation)(state);
    const isBlackBoxed = (0, _index.isSourceBlackBoxed)(state, source);
    const isSourceOnIgnoreList = (0, _index.isSourceMapIgnoreListEnabled)(state) && (0, _index.isSourceOnSourceMapIgnoreList)(state, source);
    const tabsSources = (0, _index.getSourcesForTabs)(state);
    const otherTabsSources = tabsSources.filter(s => s !== source);
    const tabIndex = tabsSources.findIndex(s => s === source);
    const followingTabsSources = tabsSources.slice(tabIndex + 1);
    const tabMenuItems = (0, _tabs.getTabMenuItems)();
    const items = [{
      item: { ...tabMenuItems.closeTab,
        click: () => dispatch((0, _tabs2.closeTab)(source))
      }
    }, {
      item: { ...tabMenuItems.closeOtherTabs,
        disabled: otherTabsSources.length === 0,
        click: () => dispatch((0, _tabs2.closeTabs)(otherTabsSources))
      }
    }, {
      item: { ...tabMenuItems.closeTabsToEnd,
        disabled: followingTabsSources.length === 0,
        click: () => {
          dispatch((0, _tabs2.closeTabs)(followingTabsSources));
        }
      }
    }, {
      item: { ...tabMenuItems.closeAllTabs,
        click: () => dispatch((0, _tabs2.closeTabs)(tabsSources))
      }
    }, {
      item: {
        type: "separator"
      }
    }, {
      item: { ...tabMenuItems.copySource,
        // Only enable when this is the selected source as this requires the source to be loaded,
        // which may not be the case if the tab wasn't ever selected.
        //
        // Note that when opening the debugger, you may have tabs opened from a previous session,
        // but no selected location.
        disabled: selectedLocation?.source.id !== source.id,
        click: () => {
          dispatch((0, _ui.copyToClipboard)(selectedLocation));
        }
      }
    }, {
      item: { ...tabMenuItems.copySourceUri2,
        disabled: !source.url,
        click: () => (0, _clipboard.copyToTheClipboard)((0, _source.getRawSourceURL)(source.url))
      }
    }, {
      item: { ...tabMenuItems.showSource,
        // Source Tree only shows sources with URL
        disabled: !source.url,
        click: () => dispatch((0, _ui.showSource)(source.id))
      }
    }, {
      item: { ...tabMenuItems.toggleBlackBox,
        label: isBlackBoxed ? L10N.getStr("ignoreContextItem.unignore") : L10N.getStr("ignoreContextItem.ignore"),
        disabled: isSourceOnIgnoreList || !(0, _source.shouldBlackbox)(source),
        click: () => dispatch((0, _blackbox.toggleBlackBox)(source))
      }
    }, {
      item: { ...tabMenuItems.prettyPrint,
        disabled: (0, _source.isPretty)(source),
        click: () => dispatch((0, _prettyPrint.prettyPrintAndSelectSource)(source))
      }
    }];
    (0, _menu.showMenu)(event, (0, _menu.buildMenu)(items));
  };
}