"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createTree = createTree;
exports.updateTree = updateTree;

var _addToTree = require("./addToTree");

var _collapseTree = require("./collapseTree");

var _utils = require("./utils");

var _treeOrder = require("./treeOrder");

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

  return updateTree({
    debuggeeUrl,
    newSources: sources,
    prevSources: {},
    threads,
    uncollapsedTree
  });
}

function updateTree({
  newSources,
  prevSources,
  debuggeeUrl,
  uncollapsedTree,
  threads
}) {
  const debuggeeHost = (0, _treeOrder.getDomain)(debuggeeUrl);
  const contexts = Object.keys(newSources);

  contexts.forEach(context => {
    const thread = threads.find(t => t.actor === context);
    if (!thread) {
      return;
    }

    const sourcesToAdd = getSourcesToAdd(Object.values(newSources[context]), prevSources[context] ? Object.values(prevSources[context]) : null);

    for (const source of sourcesToAdd) {
      (0, _addToTree.addToTree)(uncollapsedTree, source, debuggeeHost, thread.actor);
    }
  });

  const newSourceTree = (0, _collapseTree.collapseTree)(uncollapsedTree);

  return {
    uncollapsedTree,
    sourceTree: newSourceTree,
    parentMap: (0, _utils.createParentMap)(newSourceTree)
  };
}