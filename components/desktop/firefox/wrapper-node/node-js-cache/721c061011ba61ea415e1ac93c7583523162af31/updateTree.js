"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createTree = createTree;
exports.updateTree = updateTree;
loader.lazyRequireGetter(this, "_addToTree", "devtools/client/debugger/src/utils/sources-tree/addToTree");
loader.lazyRequireGetter(this, "_collapseTree", "devtools/client/debugger/src/utils/sources-tree/collapseTree");
loader.lazyRequireGetter(this, "_utils", "devtools/client/debugger/src/utils/sources-tree/utils");
loader.lazyRequireGetter(this, "_treeOrder", "devtools/client/debugger/src/utils/sources-tree/treeOrder");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
function getSourcesToAdd(newSources, prevSources) {
  const sourcesToAdd = [];

  for (const sourceId in newSources) {
    const newSource = newSources[sourceId];
    const prevSource = prevSources ? prevSources[sourceId] : null;

    if (!prevSource) {
      sourcesToAdd.push(newSource);
    }
  }

  return sourcesToAdd;
}

function createTree({
  debuggeeUrl,
  sources,
  threads
}) {
  const uncollapsedTree = (0, _utils.createDirectoryNode)("root", "", []);
  const result = updateTree({
    debuggeeUrl,
    newSources: sources,
    prevSources: {},
    threads,
    uncollapsedTree
  });

  if (!result) {
    throw new Error("Tree must exist");
  }

  return result;
}

function updateTree({
  newSources,
  prevSources,
  debuggeeUrl,
  uncollapsedTree,
  threads,
  create,
  sourceTree
}) {
  const debuggeeHost = (0, _treeOrder.getDomain)(debuggeeUrl);
  const contexts = Object.keys(newSources);
  let shouldUpdate = !sourceTree;

  for (const context of contexts) {
    const thread = threads.find(t => t.actor === context);

    if (!thread) {
      return;
    }

    const sourcesToAdd = getSourcesToAdd(Object.values(newSources[context]), prevSources[context] ? Object.values(prevSources[context]) : null);

    for (const source of sourcesToAdd) {
      shouldUpdate = true;
      (0, _addToTree.addToTree)(uncollapsedTree, source, debuggeeHost, thread.actor);
    }
  }

  if (!shouldUpdate) {
    return false;
  }

  const newSourceTree = (0, _collapseTree.collapseTree)(uncollapsedTree);
  return {
    uncollapsedTree,
    sourceTree: newSourceTree,
    parentMap: (0, _utils.createParentMap)(newSourceTree)
  };
}