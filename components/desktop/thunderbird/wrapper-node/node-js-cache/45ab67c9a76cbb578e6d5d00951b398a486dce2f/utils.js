"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nodeHasChildren = nodeHasChildren;
exports.isExactUrlMatch = isExactUrlMatch;
exports.isPathDirectory = isPathDirectory;
exports.isDirectory = isDirectory;
exports.getSourceFromNode = getSourceFromNode;
exports.isSource = isSource;
exports.getFileExtension = getFileExtension;
exports.isNotJavaScript = isNotJavaScript;
exports.isInvalidUrl = isInvalidUrl;
exports.partIsFile = partIsFile;
exports.createDirectoryNode = createDirectoryNode;
exports.createSourceNode = createSourceNode;
exports.createParentMap = createParentMap;
exports.getRelativePath = getRelativePath;
exports.getPathWithoutThread = getPathWithoutThread;
exports.findSource = findSource;
exports.getSource = getSource;
exports.getChildren = getChildren;
exports.getAllSources = getAllSources;
exports.getSourcesInsideGroup = getSourcesInsideGroup;
loader.lazyRequireGetter(this, "_url", "devtools/client/debugger/src/utils/url");
loader.lazyRequireGetter(this, "_source", "devtools/client/debugger/src/utils/source");
loader.lazyRequireGetter(this, "_getURL", "devtools/client/debugger/src/utils/sources-tree/getURL");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
const IGNORED_URLS = ["debugger eval code", "XStringBundle"];

function nodeHasChildren(item) {
  return item.type == "directory" && Array.isArray(item.contents);
}

function isExactUrlMatch(pathPart, debuggeeUrl) {
  // compare to hostname with an optional 'www.' prefix
  const {
    host
  } = (0, _url.parse)(debuggeeUrl);

  if (!host) {
    return false;
  }

  return host === pathPart || host.replace(/^www\./, "") === pathPart.replace(/^www\./, "");
}

function isPathDirectory(path) {
  // Assume that all urls point to files except when they end with '/'
  // Or directory node has children
  if (path.endsWith("/")) {
    return true;
  }

  let separators = 0;

  for (let i = 0; i < path.length - 1; ++i) {
    if (path[i] === "/") {
      if (path[i + i] !== "/") {
        return false;
      }

      ++separators;
    }
  }

  switch (separators) {
    case 0:
      {
        return false;
      }

    case 1:
      {
        return !path.startsWith("/");
      }

    default:
      {
        return true;
      }
  }
}

function isDirectory(item) {
  return (item.type === "directory" || isPathDirectory(item.path)) && item.name != "(index)";
}

function getSourceFromNode(item) {
  const {
    contents
  } = item;

  if (!isDirectory(item) && !Array.isArray(contents)) {
    return contents;
  }
}

function isSource(item) {
  return item.type === "source";
}

function getFileExtension(source) {
  const {
    path
  } = (0, _getURL.getURL)(source);

  if (!path) {
    return "";
  }

  const lastIndex = path.lastIndexOf(".");
  return lastIndex !== -1 ? path.slice(lastIndex + 1) : "";
}

function isNotJavaScript(source) {
  return ["css", "svg", "png"].includes(getFileExtension(source));
}

function isInvalidUrl(url, source) {
  return !source.url || !url.group || isNotJavaScript(source) || IGNORED_URLS.includes(url) || (0, _source.isPretty)(source);
}

function partIsFile(index, parts, url) {
  const isLastPart = index === parts.length - 1;
  return isLastPart && !isDirectory(url);
}

function createDirectoryNode(name, path, contents) {
  return {
    type: "directory",
    name,
    path,
    contents
  };
}

function createSourceNode(name, path, contents) {
  return {
    type: "source",
    name,
    path,
    contents
  };
}

function createParentMap(tree) {
  const map = new WeakMap();

  function _traverse(subtree) {
    if (subtree.type === "directory") {
      for (const child of subtree.contents) {
        map.set(child, subtree);

        _traverse(child);
      }
    }
  }

  if (tree.type === "directory") {
    // Don't link each top-level path to the "root" node because the
    // user never sees the root
    tree.contents.forEach(_traverse);
  }

  return map;
}

function getRelativePath(url) {
  const {
    pathname
  } = (0, _url.parse)(url);

  if (!pathname) {
    return url;
  }

  const index = pathname.indexOf("/");
  return index !== -1 ? pathname.slice(index + 1) : "";
}

function getPathWithoutThread(path) {
  const pathParts = path.split(/(context\d+?\/)/).splice(2);

  if (pathParts && pathParts.length > 0) {
    return pathParts.join("");
  }

  return "";
}

function findSource({
  threads,
  sources
}, itemPath, source) {
  const targetThread = threads.find(thread => itemPath.includes(thread.actor));

  if (targetThread && source) {
    const {
      actor
    } = targetThread;

    if (sources[actor]) {
      return sources[actor][source.id];
    }
  }

  return source;
} // NOTE: we get the source from sources because item.contents is cached


function getSource(item, {
  threads,
  sources
}) {
  const source = getSourceFromNode(item);
  return findSource({
    threads,
    sources
  }, item.path, source);
}

function getChildren(item) {
  return nodeHasChildren(item) ? item.contents : [];
}

function getAllSources({
  threads,
  sources
}) {
  const sourcesAll = [];
  threads.forEach(thread => {
    const {
      actor
    } = thread;

    for (const source in sources[actor]) {
      sourcesAll.push(sources[actor][source]);
    }
  });
  return sourcesAll;
}

function getSourcesInsideGroup(item, {
  threads,
  sources
}) {
  const sourcesInsideDirectory = [];

  const findAllSourcesInsideDirectory = directoryToSearch => {
    const childrenItems = getChildren(directoryToSearch);
    childrenItems.forEach(itemChild => {
      if (itemChild.type === "directory") {
        findAllSourcesInsideDirectory(itemChild);
      } else {
        const source = getSource(itemChild, {
          threads,
          sources
        });

        if (source) {
          sourcesInsideDirectory.push(source);
        }
      }
    });
  };

  if (item.type === "directory") {
    findAllSourcesInsideDirectory(item);
  }

  return sourcesInsideDirectory;
}