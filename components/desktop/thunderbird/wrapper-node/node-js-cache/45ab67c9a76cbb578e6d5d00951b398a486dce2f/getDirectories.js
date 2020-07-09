"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findSourceTreeNodes = findSourceTreeNodes;
exports.getDirectories = getDirectories;
loader.lazyRequireGetter(this, "_utils", "devtools/client/debugger/src/utils/sources-tree/utils");

var _flattenDeep = _interopRequireDefault(require("devtools/client/shared/vendor/lodash").flattenDeep);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
function findSourceItem(sourceTree, source) {
  function _traverse(subtree) {
    if (subtree.type === "source") {
      if (subtree.contents.id === source.id) {
        return subtree;
      }

      return null;
    }

    const matches = subtree.contents.map(child => _traverse(child));
    return matches && matches.filter(Boolean)[0];
  }

  return _traverse(sourceTree);
}

function findSourceTreeNodes(sourceTree, path) {
  function _traverse(subtree) {
    if (subtree.path.endsWith(path)) {
      return subtree;
    }

    if (subtree.type === "directory") {
      const matches = subtree.contents.map(child => _traverse(child));
      return matches && matches.filter(Boolean);
    }
  }

  const result = _traverse(sourceTree); // $FlowIgnore


  return Array.isArray(result) ? (0, _flattenDeep.default)(result) : result;
}

function getAncestors(sourceTree, item) {
  if (!item) {
    return null;
  }

  const parentMap = (0, _utils.createParentMap)(sourceTree);
  const directories = [];
  directories.push(item);

  while (true) {
    item = parentMap.get(item);

    if (!item) {
      return directories;
    }

    directories.push(item);
  }
}

function getDirectories(source, sourceTree) {
  const item = findSourceItem(sourceTree, source);
  const ancestors = getAncestors(sourceTree, item);
  return ancestors || [sourceTree];
}