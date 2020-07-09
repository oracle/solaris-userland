"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shouldBlackbox = shouldBlackbox;
exports.isJavaScript = isJavaScript;
exports.isPretty = isPretty;
exports.isPrettyURL = isPrettyURL;
exports.isThirdParty = isThirdParty;
exports.getPrettySourceURL = getPrettySourceURL;
exports.getRawSourceURL = getRawSourceURL;
exports.getFormattedSourceId = getFormattedSourceId;
exports.getFilename = getFilename;
exports.getTruncatedFileName = getTruncatedFileName;
exports.getDisplayPath = getDisplayPath;
exports.getFileURL = getFileURL;
exports.getSourcePath = getSourcePath;
exports.getSourceLineCount = getSourceLineCount;
exports.getMode = getMode;
exports.isInlineScript = isInlineScript;
exports.getTextAtPosition = getTextAtPosition;
exports.getSourceClassnames = getSourceClassnames;
exports.getRelativeUrl = getRelativeUrl;
exports.underRoot = underRoot;
exports.isOriginal = isOriginal;
exports.isGenerated = isGenerated;
exports.getSourceQueryString = getSourceQueryString;
exports.isUrlExtension = isUrlExtension;
exports.isExtensionDirectoryPath = isExtensionDirectoryPath;
exports.getPlainUrl = getPlainUrl;
Object.defineProperty(exports, "isMinified", {
  enumerable: true,
  get: function () {
    return _isMinified.isMinified;
  }
});
exports.getLineText = exports.sourceTypes = void 0;

var _devtoolsModules = require("devtools/client/debugger/dist/vendors").vendored["devtools-modules"];

loader.lazyRequireGetter(this, "_sourceMaps", "devtools/client/debugger/src/utils/source-maps");
loader.lazyRequireGetter(this, "_utils", "devtools/client/debugger/src/utils/utils");
loader.lazyRequireGetter(this, "_text", "devtools/client/debugger/src/utils/text");
loader.lazyRequireGetter(this, "_url", "devtools/client/debugger/src/utils/url");
loader.lazyRequireGetter(this, "_memoizeLast", "devtools/client/debugger/src/utils/memoizeLast");
loader.lazyRequireGetter(this, "_wasm", "devtools/client/debugger/src/utils/wasm");
loader.lazyRequireGetter(this, "_editor", "devtools/client/debugger/src/utils/editor/index");
loader.lazyRequireGetter(this, "_isMinified", "devtools/client/debugger/src/utils/isMinified");
loader.lazyRequireGetter(this, "_sourcesTree", "devtools/client/debugger/src/utils/sources-tree/index");
loader.lazyRequireGetter(this, "_prefs", "devtools/client/debugger/src/utils/prefs");
loader.lazyRequireGetter(this, "_asyncValue", "devtools/client/debugger/src/utils/async-value");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

/**
 * Utils for working with Source URLs
 * @module utils/source
 */
const sourceTypes = {
  coffee: "coffeescript",
  js: "javascript",
  jsx: "react",
  ts: "typescript",
  vue: "vue"
};
exports.sourceTypes = sourceTypes;
const javascriptLikeExtensions = ["marko", "es6", "vue", "jsm"];

function getPath(source) {
  const {
    path
  } = (0, _sourcesTree.getURL)(source);
  let lastIndex = path.lastIndexOf("/");
  let nextToLastIndex = path.lastIndexOf("/", lastIndex - 1);
  const result = [];

  do {
    result.push(path.slice(nextToLastIndex + 1, lastIndex));
    lastIndex = nextToLastIndex;
    nextToLastIndex = path.lastIndexOf("/", lastIndex - 1);
  } while (lastIndex !== nextToLastIndex);

  result.push("");
  return result;
}

function shouldBlackbox(source) {
  if (!source) {
    return false;
  }

  if (!source.url) {
    return false;
  }

  if (!_prefs.features.originalBlackbox && (0, _sourceMaps.isOriginalSource)(source)) {
    return false;
  }

  return true;
}
/**
 * Returns true if the specified url and/or content type are specific to
 * javascript files.
 *
 * @return boolean
 *         True if the source is likely javascript.
 *
 * @memberof utils/source
 * @static
 */


function isJavaScript(source, content) {
  const extension = (0, _sourcesTree.getFileExtension)(source).toLowerCase();
  const contentType = content.type === "wasm" ? null : content.contentType;
  return javascriptLikeExtensions.includes(extension) || !!(contentType && contentType.includes("javascript"));
}
/**
 * @memberof utils/source
 * @static
 */


function isPretty(source) {
  return isPrettyURL(source.url);
}

function isPrettyURL(url) {
  return url ? url.endsWith(":formatted") : false;
}

function isThirdParty(source) {
  const {
    url
  } = source;

  if (!source || !url) {
    return false;
  }

  return url.includes("node_modules") || url.includes("bower_components");
}
/**
 * @memberof utils/source
 * @static
 */


function getPrettySourceURL(url) {
  if (!url) {
    url = "";
  }

  return `${url}:formatted`;
}
/**
 * @memberof utils/source
 * @static
 */


function getRawSourceURL(url) {
  return url && url.endsWith(":formatted") ? url.slice(0, -":formatted".length) : url;
}

function resolveFileURL(url, transformUrl = initialUrl => initialUrl, truncate = true) {
  url = getRawSourceURL(url || "");
  const name = transformUrl(url);

  if (!truncate) {
    return name;
  }

  return (0, _utils.endTruncateStr)(name, 50);
}

function getFormattedSourceId(id) {
  const firstIndex = id.indexOf("/");
  const secondIndex = id.indexOf("/", firstIndex);
  return `SOURCE${id.slice(firstIndex, secondIndex)}`;
}
/**
 * Gets a readable filename from a source URL for display purposes.
 * If the source does not have a URL, the source ID will be returned instead.
 *
 * @memberof utils/source
 * @static
 */


function getFilename(source, rawSourceURL = getRawSourceURL(source.url)) {
  const {
    id
  } = source;

  if (!rawSourceURL) {
    return getFormattedSourceId(id);
  }

  const {
    filename
  } = (0, _sourcesTree.getURL)(source);
  return getRawSourceURL(filename);
}
/**
 * Provides a middle-trunated filename
 *
 * @memberof utils/source
 * @static
 */


function getTruncatedFileName(source, querystring = "", length = 30) {
  return (0, _text.truncateMiddleText)(`${getFilename(source)}${querystring}`, length);
}
/* Gets path for files with same filename for editor tabs, breakpoints, etc.
 * Pass the source, and list of other sources
 *
 * @memberof utils/source
 * @static
 */


function getDisplayPath(mySource, sources) {
  const rawSourceURL = getRawSourceURL(mySource.url);
  const filename = getFilename(mySource, rawSourceURL); // Find sources that have the same filename, but different paths
  // as the original source

  const similarSources = sources.filter(source => {
    const rawSource = getRawSourceURL(source.url);
    return rawSourceURL != rawSource && filename == getFilename(source, rawSource);
  });

  if (similarSources.length == 0) {
    return undefined;
  } // get an array of source path directories e.g. ['a/b/c.html'] => [['b', 'a']]


  const paths = new Array(similarSources.length + 1);
  paths[0] = getPath(mySource);

  for (let i = 0; i < similarSources.length; ++i) {
    paths[i + 1] = getPath(similarSources[i]);
  } // create an array of similar path directories and one dis-similar directory
  // for example [`a/b/c.html`, `a1/b/c.html`] => ['b', 'a']
  // where 'b' is the similar directory and 'a' is the dis-similar directory.


  let displayPath = "";

  for (let i = 0; i < paths[0].length; i++) {
    let similar = false;

    for (let k = 1; k < paths.length; ++k) {
      if (paths[k][i] === paths[0][i]) {
        similar = true;
        break;
      }
    }

    displayPath = paths[0][i] + (i !== 0 ? "/" : "") + displayPath;

    if (!similar) {
      break;
    }
  }

  return displayPath;
}
/**
 * Gets a readable source URL for display purposes.
 * If the source does not have a URL, the source ID will be returned instead.
 *
 * @memberof utils/source
 * @static
 */


function getFileURL(source, truncate = true) {
  const {
    url,
    id
  } = source;

  if (!url) {
    return getFormattedSourceId(id);
  }

  return resolveFileURL(url, _devtoolsModules.getUnicodeUrl, truncate);
}

const contentTypeModeMap = {
  "text/javascript": {
    name: "javascript"
  },
  "text/typescript": {
    name: "javascript",
    typescript: true
  },
  "text/coffeescript": {
    name: "coffeescript"
  },
  "text/typescript-jsx": {
    name: "jsx",
    base: {
      name: "javascript",
      typescript: true
    }
  },
  "text/jsx": {
    name: "jsx"
  },
  "text/x-elm": {
    name: "elm"
  },
  "text/x-clojure": {
    name: "clojure"
  },
  "text/x-clojurescript": {
    name: "clojure"
  },
  "text/wasm": {
    name: "text"
  },
  "text/html": {
    name: "htmlmixed"
  }
};

function getSourcePath(url) {
  if (!url) {
    return "";
  }

  const {
    path,
    href
  } = (0, _url.parse)(url); // for URLs like "about:home" the path is null so we pass the full href

  return path || href;
}
/**
 * Returns amount of lines in the source. If source is a WebAssembly binary,
 * the function returns amount of bytes.
 */


function getSourceLineCount(content) {
  if (content.type === "wasm") {
    const {
      binary
    } = content.value;
    return binary.length;
  }

  let count = 0;

  for (let i = 0; i < content.value.length; ++i) {
    if (content.value[i] === "\n") {
      ++count;
    }
  }

  return count + 1;
}
/**
 *
 * Checks if a source is minified based on some heuristics
 * @param key
 * @param text
 * @return boolean
 * @memberof utils/source
 * @static
 */

/**
 *
 * Returns Code Mirror mode for source content type
 * @param contentType
 * @return String
 * @memberof utils/source
 * @static
 */
// eslint-disable-next-line complexity


function getMode(source, content, symbols) {
  const extension = (0, _sourcesTree.getFileExtension)(source);

  if (content.type !== "text") {
    return {
      name: "text"
    };
  }

  const {
    contentType,
    value: text
  } = content;

  if (extension === "jsx" || symbols && symbols.hasJsx) {
    if (symbols && symbols.hasTypes) {
      return {
        name: "text/typescript-jsx"
      };
    }

    return {
      name: "jsx"
    };
  }

  if (symbols && symbols.hasTypes) {
    if (symbols.hasJsx) {
      return {
        name: "text/typescript-jsx"
      };
    }

    return {
      name: "text/typescript"
    };
  }

  const languageMimeMap = [{
    ext: "c",
    mode: "text/x-csrc"
  }, {
    ext: "kt",
    mode: "text/x-kotlin"
  }, {
    ext: "cpp",
    mode: "text/x-c++src"
  }, {
    ext: "m",
    mode: "text/x-objectivec"
  }, {
    ext: "rs",
    mode: "text/x-rustsrc"
  }, {
    ext: "hx",
    mode: "text/x-haxe"
  }]; // check for C and other non JS languages

  const result = languageMimeMap.find(({
    ext
  }) => extension === ext);

  if (result !== undefined) {
    return {
      name: result.mode
    };
  } // if the url ends with a known Javascript-like URL, provide JavaScript mode.
  // uses the first part of the URL to ignore query string


  if (javascriptLikeExtensions.find(ext => ext === extension)) {
    return {
      name: "javascript"
    };
  } // Use HTML mode for files in which the first non whitespace
  // character is `<` regardless of extension.


  const isHTMLLike = text.match(/^\s*</);

  if (!contentType) {
    if (isHTMLLike) {
      return {
        name: "htmlmixed"
      };
    }

    return {
      name: "text"
    };
  } // //  or /* @flow */


  if (text.match(/^\s*(\/\/ @flow|\/\* @flow \*\/)/)) {
    return contentTypeModeMap["text/typescript"];
  }

  if (/script|elm|jsx|clojure|wasm|html/.test(contentType)) {
    if (contentType in contentTypeModeMap) {
      return contentTypeModeMap[contentType];
    }

    return contentTypeModeMap["text/javascript"];
  }

  if (isHTMLLike) {
    return {
      name: "htmlmixed"
    };
  }

  return {
    name: "text"
  };
}

function isInlineScript(source) {
  return source.introductionType === "scriptElement";
}

const getLineText = (0, _memoizeLast.memoizeLast)((sourceId, asyncContent, line) => {
  if (!asyncContent || !(0, _asyncValue.isFulfilled)(asyncContent)) {
    return "";
  }

  const content = asyncContent.value;

  if (content.type === "wasm") {
    const editorLine = (0, _editor.toEditorLine)(sourceId, line);
    const lines = (0, _wasm.renderWasmText)(sourceId, content);
    return lines[editorLine] || "";
  }

  const lineText = content.value.split("\n")[line - 1];
  return lineText || "";
});
exports.getLineText = getLineText;

function getTextAtPosition(sourceId, asyncContent, location) {
  const {
    column,
    line = 0
  } = location;
  const lineText = getLineText(sourceId, asyncContent, line);
  return lineText.slice(column, column + 100).trim();
}

function getSourceClassnames(source, symbols) {
  // Conditionals should be ordered by priority of icon!
  const defaultClassName = "file";

  if (!source || !source.url) {
    return defaultClassName;
  }

  if (isPretty(source)) {
    return "prettyPrint";
  }

  if (source.isBlackBoxed) {
    return "blackBox";
  }

  if (symbols && !symbols.loading && symbols.framework) {
    return symbols.framework.toLowerCase();
  }

  if (isUrlExtension(source.url)) {
    return "extension";
  }

  return sourceTypes[(0, _sourcesTree.getFileExtension)(source)] || defaultClassName;
}

function getRelativeUrl(source, root) {
  const {
    group,
    path
  } = (0, _sourcesTree.getURL)(source);

  if (!root) {
    return path;
  } // + 1 removes the leading "/"


  const url = group + path;
  return url.slice(url.indexOf(root) + root.length + 1);
}

function underRoot(source, root, threadActors) {
  // source.url doesn't include thread actor ID, so remove the thread actor ID from the root
  threadActors.forEach(threadActor => {
    if (root.includes(threadActor)) {
      root = root.slice(threadActor.length + 1);
    }
  });

  if (source.url && source.url.includes("chrome://")) {
    const {
      group,
      path
    } = (0, _sourcesTree.getURL)(source);
    return (group + path).includes(root);
  }

  return !!source.url && source.url.includes(root);
}

function isOriginal(source) {
  // Pretty-printed sources are given original IDs, so no need
  // for any additional check
  return (0, _sourceMaps.isOriginalSource)(source);
}

function isGenerated(source) {
  return !isOriginal(source);
}

function getSourceQueryString(source) {
  if (!source) {
    return;
  }

  return (0, _url.parse)(getRawSourceURL(source.url)).search;
}

function isUrlExtension(url) {
  return url.includes("moz-extension:") || url.includes("chrome-extension");
}

function isExtensionDirectoryPath(url) {
  if (isUrlExtension(url)) {
    const urlArr = url.replace(/\/+/g, "/").split("/");
    let extensionIndex = urlArr.indexOf("moz-extension:");

    if (extensionIndex === -1) {
      extensionIndex = urlArr.indexOf("chrome-extension:");
    }

    return !urlArr[extensionIndex + 2];
  }
}

function getPlainUrl(url) {
  const queryStart = url.indexOf("?");
  return queryStart !== -1 ? url.slice(0, queryStart) : url;
}