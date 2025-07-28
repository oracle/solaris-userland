"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.showSourceTreeItemContextMenu = showSourceTreeItemContextMenu;
loader.lazyRequireGetter(this, "_menu", "devtools/client/debugger/src/context-menu/menu");
loader.lazyRequireGetter(this, "_index", "devtools/client/debugger/src/selectors/index");

var _index2 = require("devtools/client/framework/actions/index");

loader.lazyRequireGetter(this, "_loadSourceText", "devtools/client/debugger/src/actions/sources/loadSourceText");
loader.lazyRequireGetter(this, "_blackbox", "devtools/client/debugger/src/actions/sources/blackbox");
loader.lazyRequireGetter(this, "_sourcesTree", "devtools/client/debugger/src/actions/sources-tree");
loader.lazyRequireGetter(this, "_source", "devtools/client/debugger/src/utils/source");
loader.lazyRequireGetter(this, "_clipboard", "devtools/client/debugger/src/utils/clipboard");
loader.lazyRequireGetter(this, "_utils", "devtools/client/debugger/src/utils/utils");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

/**
 * Show the context menu of SourceTreeItem.
 *
 * @param {object} event
 *        The context-menu DOM event.
 * @param {object} item
 *        Source Tree Item object.
 */
function showSourceTreeItemContextMenu(event, item, depth, setExpanded, itemName, isOverridden) {
  return async ({
    dispatch,
    getState,
    panel
  }) => {
    const copySourceUri2Label = L10N.getStr("copySourceUri2");
    const copySourceUri2Key = L10N.getStr("copySourceUri2.accesskey");
    const setDirectoryRootLabel = L10N.getStr("setDirectoryRoot.label");
    const setDirectoryRootKey = L10N.getStr("setDirectoryRoot.accesskey");
    const removeDirectoryRootLabel = L10N.getStr("removeDirectoryRoot.label");
    const menuOptions = [];
    const state = getState();
    const isSourceOnIgnoreList = (0, _index.isSourceMapIgnoreListEnabled)(state) && (0, _index.isSourceOnSourceMapIgnoreList)(state, item.source);
    const projectRoot = (0, _index.getProjectDirectoryRoot)(state);

    if (item.type == "source") {
      const {
        source
      } = item;
      const copySourceUri2 = {
        id: "node-menu-copy-source",
        label: copySourceUri2Label,
        accesskey: copySourceUri2Key,
        disabled: false,
        click: () => (0, _clipboard.copyToTheClipboard)(source.url)
      };
      const ignoreStr = item.isBlackBoxed ? "unignore" : "ignore";
      const blackBoxMenuItem = {
        id: "node-menu-blackbox",
        label: L10N.getStr(`ignoreContextItem.${ignoreStr}`),
        accesskey: L10N.getStr(`ignoreContextItem.${ignoreStr}.accesskey`),
        disabled: isSourceOnIgnoreList || !(0, _source.shouldBlackbox)(source),
        click: () => dispatch((0, _blackbox.toggleBlackBox)(source))
      };
      const downloadFileItem = {
        id: "node-menu-download-file",
        label: L10N.getStr("downloadFile.label"),
        accesskey: L10N.getStr("downloadFile.accesskey"),
        disabled: false,
        click: () => saveLocalFile(dispatch, source)
      };
      const overrideStr = !isOverridden ? "override" : "removeOverride";
      const overridesItem = {
        id: "node-menu-overrides",
        label: L10N.getStr(`overridesContextItem.${overrideStr}`),
        accesskey: L10N.getStr(`overridesContextItem.${overrideStr}.accesskey`),
        // Network overrides are disabled for original files.
        disabled: source.isOriginal,
        // Network overrides are disabled for remote debugging (bug 1881441).
        visible: panel.toolbox.commands.descriptorFront.isLocalTab,
        click: () => handleLocalOverride(dispatch, panel.toolbox, source, isOverridden)
      };
      menuOptions.push(copySourceUri2, blackBoxMenuItem, downloadFileItem, overridesItem);
    } // All other types other than source are folder-like


    if (item.type != "source") {
      addCollapseExpandAllOptions(menuOptions, item, setExpanded);

      if (projectRoot == item.uniquePath) {
        menuOptions.push({
          id: "node-remove-directory-root",
          label: removeDirectoryRootLabel,
          disabled: false,
          click: () => dispatch((0, _sourcesTree.clearProjectDirectoryRoot)())
        });
      } else {
        const itemFullName = item.thread ? item.thread.name : `${item.url} on ${getThreadName(item)}`;
        menuOptions.push({
          id: "node-set-directory-root",
          label: setDirectoryRootLabel,
          accesskey: setDirectoryRootKey,
          disabled: false,
          click: () => dispatch((0, _sourcesTree.setProjectDirectoryRoot)(item.uniquePath, itemName, itemFullName))
        });
      }

      addBlackboxAllOption(dispatch, state, menuOptions, item, depth);
    }

    (0, _menu.showMenu)(event, menuOptions);
  };
}

function getThreadName(item) {
  return item.thread ? item.thread.name : getThreadName(item.parent);
}

async function saveLocalFile(dispatch, source) {
  if (!source) {
    return null;
  }

  const data = await dispatch((0, _loadSourceText.loadSourceText)(source));

  if (!data) {
    return null;
  }

  return (0, _utils.saveAsLocalFile)(data.value, source.displayURL.filename);
}

async function handleLocalOverride(dispatch, toolbox, source, isOverridden) {
  if (!source || !source.url) {
    return;
  }

  const toolboxStore = toolbox.store;

  if (!isOverridden) {
    const data = await dispatch((0, _loadSourceText.loadSourceText)(source));

    if (data?.value && data.value.type == "text") {
      toolboxStore.dispatch((0, _index2.setNetworkOverride)(toolbox.commands, source.url, data.value.value, window));
    }
  } else {
    toolboxStore.dispatch((0, _index2.removeNetworkOverride)(toolbox.commands, source.url));
  }
}

function addBlackboxAllOption(dispatch, state, menuOptions, item, depth) {
  const {
    sourcesInside,
    sourcesOutside,
    allInsideBlackBoxed,
    allOutsideBlackBoxed
  } = getBlackBoxSourcesGroups(state, item);
  const projectRoot = (0, _index.getProjectDirectoryRoot)(state);
  let blackBoxInsideMenuItemLabel;
  let blackBoxOutsideMenuItemLabel;

  if (depth === 0 || depth === 1 && projectRoot === "") {
    blackBoxInsideMenuItemLabel = allInsideBlackBoxed ? L10N.getStr("unignoreAllInGroup.label") : L10N.getStr("ignoreAllInGroup.label");

    if (sourcesOutside.length) {
      blackBoxOutsideMenuItemLabel = allOutsideBlackBoxed ? L10N.getStr("unignoreAllOutsideGroup.label") : L10N.getStr("ignoreAllOutsideGroup.label");
    }
  } else {
    blackBoxInsideMenuItemLabel = allInsideBlackBoxed ? L10N.getStr("unignoreAllInDir.label") : L10N.getStr("ignoreAllInDir.label");

    if (sourcesOutside.length) {
      blackBoxOutsideMenuItemLabel = allOutsideBlackBoxed ? L10N.getStr("unignoreAllOutsideDir.label") : L10N.getStr("ignoreAllOutsideDir.label");
    }
  }

  const blackBoxInsideMenuItem = {
    id: allInsideBlackBoxed ? "node-unblackbox-all-inside" : "node-blackbox-all-inside",
    label: blackBoxInsideMenuItemLabel,
    disabled: false,
    click: () => dispatch((0, _blackbox.blackBoxSources)(sourcesInside, !allInsideBlackBoxed))
  };

  if (sourcesOutside.length) {
    menuOptions.push({
      id: "node-blackbox-all",
      label: L10N.getStr("ignoreAll.label"),
      submenu: [blackBoxInsideMenuItem, {
        id: allOutsideBlackBoxed ? "node-unblackbox-all-outside" : "node-blackbox-all-outside",
        label: blackBoxOutsideMenuItemLabel,
        disabled: false,
        click: () => dispatch((0, _blackbox.blackBoxSources)(sourcesOutside, !allOutsideBlackBoxed))
      }]
    });
  } else {
    menuOptions.push(blackBoxInsideMenuItem);
  }
}

function addCollapseExpandAllOptions(menuOptions, item, setExpanded) {
  menuOptions.push({
    id: "node-menu-collapse-all",
    label: L10N.getStr("collapseAll.label"),
    disabled: false,
    click: () => setExpanded(item, false, true)
  });
  menuOptions.push({
    id: "node-menu-expand-all",
    label: L10N.getStr("expandAll.label"),
    disabled: false,
    click: () => setExpanded(item, true, true)
  });
}
/**
 * Computes 4 lists:
 *  - `sourcesInside`: the list of all Source Items that are
 *    children of the current item (can be thread/group/directory).
 *    This include any nested level of children.
 *  - `sourcesOutside`: all other Source Items.
 *    i.e. all sources that are in any other folder of any group/thread.
 *  - `allInsideBlackBoxed`, all sources of `sourcesInside` which are currently
 *    blackboxed.
 *  - `allOutsideBlackBoxed`, all sources of `sourcesOutside` which are currently
 *    blackboxed.
 */


function getBlackBoxSourcesGroups(state, item) {
  const allSources = [];

  function collectAllSources(list, _item) {
    if (_item.children) {
      _item.children.forEach(i => collectAllSources(list, i));
    }

    if (_item.type == "source") {
      list.push(_item.source);
    }
  }

  const rootItems = (0, _index.getSourcesTreeSources)(state);
  const blackBoxRanges = (0, _index.getBlackBoxRanges)(state);

  for (const rootItem of rootItems) {
    collectAllSources(allSources, rootItem);
  }

  const sourcesInside = [];
  collectAllSources(sourcesInside, item);
  const sourcesOutside = allSources.filter(source => !sourcesInside.includes(source));
  const allInsideBlackBoxed = sourcesInside.every(source => blackBoxRanges[source.url]);
  const allOutsideBlackBoxed = sourcesOutside.every(source => blackBoxRanges[source.url]);
  return {
    sourcesInside,
    sourcesOutside,
    allInsideBlackBoxed,
    allOutsideBlackBoxed
  };
}