"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseQuickOpenQuery = parseQuickOpenQuery;
exports.parseLineColumn = parseLineColumn;
exports.formatSourceForList = formatSourceForList;
exports.formatSymbol = formatSymbol;
exports.formatShortcutResults = formatShortcutResults;
exports.MODIFIERS = void 0;
loader.lazyRequireGetter(this, "_utils", "devtools/client/debugger/src/utils/utils");
loader.lazyRequireGetter(this, "_source", "devtools/client/debugger/src/utils/source");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
const MODIFIERS = {
  "@": "functions",
  "#": "variables",
  ":": "goto",
  "?": "shortcuts"
};
exports.MODIFIERS = MODIFIERS;

function parseQuickOpenQuery(query) {
  const startsWithModifier = query[0] === "@" || query[0] === "#" || query[0] === ":" || query[0] === "?";

  if (startsWithModifier) {
    const modifier = query[0];
    return MODIFIERS[modifier];
  }

  const isGotoSource = query.includes(":", 1);

  if (isGotoSource) {
    return "gotoSource";
  }

  return "sources";
}

function parseLineColumn(query) {
  const [, line, column] = query.split(":");
  const lineNumber = parseInt(line, 10);
  const columnNumber = parseInt(column, 10);

  if (isNaN(lineNumber)) {
    return null;
  }

  if (isNaN(columnNumber)) {
    return {
      line: lineNumber
    };
  } // columnNumber here is the user input value which is 1-based.
  // Whereas in location objects, line is 1-based, and column is 0-based.


  return {
    line: lineNumber,
    column: columnNumber - 1
  };
}

function formatSourceForList(source, hasTabOpened, isBlackBoxed, projectDirectoryRoot) {
  const relativeUrlWithQuery = `${(0, _source.getRelativeUrl)(source, projectDirectoryRoot)}${source.displayURL.search || ""}`;
  const subtitle = (0, _utils.endTruncateStr)(relativeUrlWithQuery, 100);
  const value = relativeUrlWithQuery;
  return {
    value,
    title: source.shortName,
    subtitle,
    icon: hasTabOpened ? "tab result-item-icon" : `result-item-icon ${(0, _source.getSourceClassnames)(source, isBlackBoxed)}`,
    id: source.id,
    url: source.url,
    source
  };
}

function formatSymbol(symbol) {
  return {
    id: `${symbol.name}:${symbol.location.start.line}`,
    title: symbol.name,
    subtitle: `${symbol.location.start.line}`,
    value: symbol.name,
    location: symbol.location
  };
}

function formatShortcutResults() {
  return [{
    value: L10N.getStr("symbolSearch.search.functionsPlaceholder.title"),
    title: `@ ${L10N.getStr("symbolSearch.search.functionsPlaceholder")}`,
    id: "@"
  }, {
    value: L10N.getStr("symbolSearch.search.variablesPlaceholder.title"),
    title: `# ${L10N.getStr("symbolSearch.search.variablesPlaceholder")}`,
    id: "#"
  }, {
    value: L10N.getStr("gotoLineModal.title"),
    title: `: ${L10N.getStr("gotoLineModal.placeholder")}`,
    id: ":"
  }];
}