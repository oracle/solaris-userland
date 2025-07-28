"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shouldBlackbox = shouldBlackbox;
exports.isFrameBlackBoxed = isFrameBlackBoxed;
exports.findBlackBoxRange = findBlackBoxRange;
exports.isLineBlackboxed = isLineBlackboxed;
exports.isJavaScript = isJavaScript;
exports.isPretty = isPretty;
exports.isPrettyURL = isPrettyURL;
exports.getPrettySourceURL = getPrettySourceURL;
exports.getRawSourceURL = getRawSourceURL;
exports.getFormattedSourceId = getFormattedSourceId;
exports.getTruncatedFileName = getTruncatedFileName;
exports.getDisplayPath = getDisplayPath;
exports.getFileURL = getFileURL;
exports.getTextAtPosition = getTextAtPosition;
exports.getSourceClassnames = getSourceClassnames;
exports.getRelativeUrl = getRelativeUrl;
exports.isUrlExtension = isUrlExtension;
exports.matchesGlobPatterns = matchesGlobPatterns;
Object.defineProperty(exports, "isMinified", {
  enumerable: true,
  get: function () {
    return _isMinified.isMinified;
  }
});
exports.getLineText = exports.javascriptLikeExtensions = exports.sourceTypes = void 0;
loader.lazyRequireGetter(this, "_utils", "devtools/client/debugger/src/utils/sources-tree/utils");
loader.lazyRequireGetter(this, "_utils2", "devtools/client/debugger/src/utils/utils");
loader.lazyRequireGetter(this, "_text", "devtools/client/debugger/src/utils/text");
loader.lazyRequireGetter(this, "_memoizeLast", "devtools/client/debugger/src/utils/memoizeLast");
loader.lazyRequireGetter(this, "_index", "devtools/client/debugger/src/utils/editor/index");
loader.lazyRequireGetter(this, "_isMinified", "devtools/client/debugger/src/utils/isMinified");
loader.lazyRequireGetter(this, "_asyncValue", "devtools/client/debugger/src/utils/async-value");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

/**
 * Utils for working with Source URLs
 * @module utils/source
 */
const {
  getUnicodeUrl
} = require("resource://devtools/client/shared/unicode-url.js");

const {
  micromatch
} = require("resource://devtools/client/shared/vendor/micromatch/micromatch.js");

const sourceTypes = {
  coffee: "coffeescript",
  js: "javascript",
  jsx: "react",
  ts: "typescript",
  tsx: "typescript",
  vue: "vue"
};
exports.sourceTypes = sourceTypes;
const javascriptLikeExtensions = new Set(["marko", "es6", "vue", "jsm"]);
exports.javascriptLikeExtensions = javascriptLikeExtensions;

function getPath(source) {
  const {
    path
  } = source.displayURL;
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

  return true;
}
/**
 * Checks if the frame is within a line ranges which are blackboxed
 * in the source.
 *
 * @param {Object}  frame
 *                  The current frame
 * @param {Object}  blackboxedRanges
 *                  The currently blackboxedRanges for all the sources.
 * @param {Boolean} isFrameBlackBoxed
 *                  If the frame is within the blackboxed range
 *                  or not.
 */


function isFrameBlackBoxed(frame, blackboxedRanges) {
  const {
    source
  } = frame.location;
  return !!blackboxedRanges[source.url] && (!blackboxedRanges[source.url].length || !!findBlackBoxRange(source, blackboxedRanges, {
    start: frame.location.line,
    end: frame.location.line
  }));
}
/**
 * Checks if a blackbox range exist for the line range.
 * That is if any start and end lines overlap any of the
 * blackbox ranges
 *
 * @param {Object}  source
 *                  The current selected source
 * @param {Object}  blackboxedRanges
 *                  The store of blackboxedRanges
 * @param {Object}  lineRange
 *                  The start/end line range `{ start: <Number>, end: <Number> }`
 * @return {Object} blackboxRange
 *                  The first matching blackbox range that all or part of the
 *                  specified lineRange sits within.
 */


function findBlackBoxRange(source, blackboxedRanges, lineRange) {
  const ranges = blackboxedRanges[source.url];

  if (!ranges || !ranges.length) {
    return null;
  }

  return ranges.find(range => lineRange.start >= range.start.line && lineRange.start <= range.end.line || lineRange.end >= range.start.line && lineRange.end <= range.end.line);
}
/**
 * Checks if a source line is blackboxed
 * @param {Array} ranges - Line ranges that are blackboxed
 * @param {Number} line
 * @param {Boolean} isSourceOnIgnoreList - is the line in a source that is on
 *                                         the sourcemap ignore lists then the line is blackboxed.
 * @returns boolean
 */


function isLineBlackboxed(ranges, line, isSourceOnIgnoreList) {
  if (isSourceOnIgnoreList) {
    return true;
  }

  if (!ranges) {
    return false;
  } // If the whole source is ignored , then the line is
  // ignored.


  if (!ranges.length) {
    return true;
  }

  return !!ranges.find(range => line >= range.start.line && line <= range.end.line);
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
  const extension = source.displayURL.fileExtension;
  const contentType = content.type === "wasm" ? null : content.contentType;
  return javascriptLikeExtensions.has(extension) || !!(contentType && contentType.includes("javascript"));
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

  return (0, _utils2.endTruncateStr)(name, 50);
}

function getFormattedSourceId(id) {
  if (typeof id != "string") {
    console.error("Expected source id to be a string, got", typeof id, " | id:", id);
    return "";
  }

  return id.substring(id.lastIndexOf("/") + 1);
}
/**
 * Provides a middle-truncated filename displayed in Tab titles
 */


function getTruncatedFileName(source) {
  return (0, _text.truncateMiddleText)(source.longName, 30);
}
/* Gets path for files with same filename for editor tabs, breakpoints, etc.
 * Pass the source, and list of other sources
 *
 * @memberof utils/source
 * @static
 */


function getDisplayPath(mySource, sources) {
  const rawSourceURL = getRawSourceURL(mySource.url);
  const filename = mySource.shortName; // Find sources that have the same filename, but different paths
  // as the original source

  const similarSources = sources.filter(source => {
    const rawSource = getRawSourceURL(source.url);
    return rawSourceURL != rawSource && filename == source.shortName;
  });

  if (!similarSources.length) {
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

  return resolveFileURL(url, getUnicodeUrl, truncate);
}

function getNthLine(str, lineNum) {
  let startIndex = -1;
  let newLinesFound = 0;

  while (newLinesFound < lineNum) {
    const nextIndex = str.indexOf("\n", startIndex + 1);

    if (nextIndex === -1) {
      return null;
    }

    startIndex = nextIndex;
    newLinesFound++;
  }

  const endIndex = str.indexOf("\n", startIndex + 1);

  if (endIndex === -1) {
    return str.slice(startIndex + 1);
  }

  return str.slice(startIndex + 1, endIndex);
}

const getLineText = (0, _memoizeLast.memoizeLast)((sourceId, asyncContent, line) => {
  if (!asyncContent || !(0, _asyncValue.isFulfilled)(asyncContent)) {
    return "";
  }

  const content = asyncContent.value;

  if (content.type === "wasm") {
    const editor = (0, _index.getEditor)();
    const lines = editor.renderWasmText(content);
    return lines[(0, _index.toWasmSourceLine)(line)] || "";
  }

  const lineText = getNthLine(content.value, line - 1);
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
/**
 * Compute the CSS classname string to use for the icon of a given source.
 *
 * @param {Object} source
 *        The reducer source object.
 * @param {Boolean} isBlackBoxed
 *        To be set to true, when the given source is blackboxed.
 * @param {Boolean} hasPrettyTab
 *        To be set to true, if the given source isn't the pretty printed one,
 *        but another tab for that source is opened pretty printed.
 * @return String
 *        The classname to use.
 */


function getSourceClassnames(source, isBlackBoxed, hasPrettyTab = false) {
  // Conditionals should be ordered by priority of icon!
  const defaultClassName = "file";

  if (!source || !source.url) {
    return defaultClassName;
  } // In the SourceTree, we don't show the pretty printed sources,
  // but still want to show the pretty print icon when a pretty printed tab
  // for the current source is opened.


  if (isPretty(source) || hasPrettyTab) {
    return "prettyPrint";
  }

  if (isBlackBoxed) {
    return "blackBox";
  }

  if (isUrlExtension(source.url)) {
    return "extension";
  }

  return sourceTypes[source.displayURL.fileExtension] || defaultClassName;
}

function getRelativeUrl(source, root) {
  const {
    group,
    path
  } = source.displayURL;

  if (!root) {
    return path;
  } // + 1 removes the leading "/"


  const url = group + path;
  return url.slice(url.indexOf(root) + root.length + 1);
}

function isUrlExtension(url) {
  return url.includes("moz-extension:") || url.includes("chrome-extension");
}
/**
* Checks that source url matches one of the glob patterns
*
* @param {Object} source
* @param {String} excludePatterns
                  String of comma-seperated glob patterns
* @return {return} Boolean value specifies if the string matches any
                 of the patterns.
*/


function matchesGlobPatterns(source, excludePatterns) {
  if (!excludePatterns) {
    return false;
  }

  const patterns = excludePatterns.split(",").map(pattern => pattern.trim()).filter(pattern => pattern !== "");

  if (!patterns.length) {
    return false;
  }

  return micromatch.contains( // Makes sure we format the url or id exactly the way its displayed in the search ui,
  // as user wil usually create glob patterns based on what is seen in the ui.
  source.url ? (0, _utils.getRelativePath)(source.url) : getFormattedSourceId(source.id), patterns);
}