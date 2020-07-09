"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addToTree = addToTree;
loader.lazyRequireGetter(this, "_utils", "devtools/client/debugger/src/utils/sources-tree/utils");
loader.lazyRequireGetter(this, "_treeOrder", "devtools/client/debugger/src/utils/sources-tree/treeOrder");
loader.lazyRequireGetter(this, "_getURL", "devtools/client/debugger/src/utils/sources-tree/getURL");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
function createNodeInTree(part, path, tree, index) {
  const node = (0, _utils.createDirectoryNode)(part, path, []); // we are modifying the tree

  const contents = tree.contents.slice(0);
  contents.splice(index, 0, node);
  tree.contents = contents;
  return node;
}
/*
 * Look for the child node
 * 1. if it exists return it
 * 2. if it does not exist create it
 */


function findOrCreateNode(parts, subTree, path, part, index, url, debuggeeHost, source) {
  const addedPartIsFile = (0, _utils.partIsFile)(index, parts, url);
  const {
    found: childFound,
    index: childIndex
  } = (0, _treeOrder.findNodeInContents)(subTree, (0, _treeOrder.createTreeNodeMatcher)(part, !addedPartIsFile, debuggeeHost)); // we create and enter the new node

  if (!childFound) {
    return createNodeInTree(part, path, subTree, childIndex);
  } // we found a path with the same name as the part. We need to determine
  // if this is the correct child, or if we have a naming conflict


  const child = subTree.contents[childIndex];
  const childIsFile = !(0, _utils.nodeHasChildren)(child); // if we have a naming conflict, we'll create a new node

  if (childIsFile != addedPartIsFile) {
    // pass true to findNodeInContents to sort node by url
    const {
      index: insertIndex
    } = (0, _treeOrder.findNodeInContents)(subTree, (0, _treeOrder.createTreeNodeMatcher)(part, !addedPartIsFile, debuggeeHost, source, true));
    return createNodeInTree(part, path, subTree, insertIndex);
  } // if there is no naming conflict, we can traverse into the child


  return child;
}
/*
 * walk the source tree to the final node for a given url,
 * adding new nodes along the way
 */


function traverseTree(url, tree, debuggeeHost, source, thread) {
  const parts = url.path.replace(/\/$/, "").split("/");
  parts[0] = url.group;

  if (thread) {
    parts.unshift(thread);
  }

  let path = "";
  return parts.reduce((subTree, part, index) => {
    if (index == 0 && thread) {
      path = thread;
    } else {
      path = `${path}/${part}`;
    }

    const debuggeeHostIfRoot = index === 1 ? debuggeeHost : null;
    return findOrCreateNode(parts, subTree, path, part, index, url, debuggeeHostIfRoot, source);
  }, tree);
}
/*
 * Add a source file to a directory node in the tree
 */


function addSourceToNode(node, url, source) {
  const isFile = !(0, _utils.isPathDirectory)(url.path);

  if (node.type == "source" && !isFile) {
    throw new Error(`Unexpected type "source" at: ${node.name}`);
  } // if we have a file, and the subtree has no elements, overwrite the
  // subtree contents with the source


  if (isFile) {
    // $FlowIgnore
    node.type = "source";
    return source;
  }

  const {
    filename
  } = url;
  const {
    found: childFound,
    index: childIndex
  } = (0, _treeOrder.findNodeInContents)(node, (0, _treeOrder.createTreeNodeMatcher)(filename, false, null)); // if we are readding an existing file in the node, overwrite the existing
  // file and return the node's contents

  if (childFound) {
    const existingNode = node.contents[childIndex];

    if (existingNode.type === "source") {
      existingNode.contents = source;
    }

    return node.contents;
  } // if this is a new file, add the new file;


  const newNode = (0, _utils.createSourceNode)(filename, source.url, source);
  const contents = node.contents.slice(0);
  contents.splice(childIndex, 0, newNode);
  return contents;
}
/**
 * @memberof utils/sources-tree
 * @static
 */


function addToTree(tree, source, debuggeeHost, thread) {
  const url = (0, _getURL.getURL)(source, debuggeeHost);

  if ((0, _utils.isInvalidUrl)(url, source)) {
    return;
  }

  const finalNode = traverseTree(url, tree, debuggeeHost, source, thread); // $FlowIgnore

  finalNode.contents = addSourceToNode(finalNode, url, source);
}