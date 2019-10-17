"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.doSearch = doSearch;
exports.doSearchForHighlight = doSearchForHighlight;
exports.setFileSearchQuery = setFileSearchQuery;
exports.toggleFileSearchModifier = toggleFileSearchModifier;
exports.updateSearchResults = updateSearchResults;
exports.searchContents = searchContents;
exports.searchContentsForHighlight = searchContentsForHighlight;
exports.traverseResults = traverseResults;
exports.closeFileSearch = closeFileSearch;

var _editor = require("../utils/editor/index");

var _wasm = require("../utils/wasm");

var _search = require("../workers/search/index");

var _selectors = require("../selectors/index");

var _ui = require("./ui");

var _asyncValue = require("../utils/async-value");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

function doSearch(cx, query, editor) {
  return ({ getState, dispatch }) => {
    const selectedSourceWithContent = (0, _selectors.getSelectedSourceWithContent)(getState());
    if (!selectedSourceWithContent || !selectedSourceWithContent.content) {
      return;
    }

    dispatch(setFileSearchQuery(cx, query));
    dispatch(searchContents(cx, query, editor));
  };
}

function doSearchForHighlight(query, editor, line, ch) {
  return async ({ getState, dispatch }) => {
    const selectedSourceWithContent = (0, _selectors.getSelectedSourceWithContent)(getState());
    if (!selectedSourceWithContent || !selectedSourceWithContent.content) {
      return;
    }
    dispatch(searchContentsForHighlight(query, editor, line, ch));
  };
}

function setFileSearchQuery(cx, query) {
  return {
    type: "UPDATE_FILE_SEARCH_QUERY",
    cx,
    query
  };
}

function toggleFileSearchModifier(cx, modifier) {
  return { type: "TOGGLE_FILE_SEARCH_MODIFIER", cx, modifier };
}

function updateSearchResults(cx, characterIndex, line, matches) {
  const matchIndex = matches.findIndex(elm => elm.line === line && elm.ch === characterIndex);

  return {
    type: "UPDATE_SEARCH_RESULTS",
    cx,
    results: {
      matches,
      matchIndex,
      count: matches.length,
      index: characterIndex
    }
  };
}

function searchContents(cx, query, editor, focusFirstResult = true) {
  return async ({ getState, dispatch }) => {
    const modifiers = (0, _selectors.getFileSearchModifiers)(getState());
    const selectedSourceWithContent = (0, _selectors.getSelectedSourceWithContent)(getState());

    if (!editor || !selectedSourceWithContent || !selectedSourceWithContent.content || !(0, _asyncValue.isFulfilled)(selectedSourceWithContent.content) || !modifiers) {
      return;
    }
    const selectedSource = selectedSourceWithContent.source;
    const selectedContent = selectedSourceWithContent.content.value;

    const ctx = { ed: editor, cm: editor.codeMirror };

    if (!query) {
      (0, _editor.clearSearch)(ctx.cm, query);
      return;
    }

    const _modifiers = modifiers.toJS();
    let text;
    if (selectedContent.type === "wasm") {
      text = (0, _wasm.renderWasmText)(selectedSource.id, selectedContent).join("\n");
    } else {
      text = selectedContent.value;
    }

    const matches = await (0, _search.getMatches)(query, text, _modifiers);

    const res = (0, _editor.find)(ctx, query, true, _modifiers, focusFirstResult);
    if (!res) {
      return;
    }

    const { ch, line } = res;

    dispatch(updateSearchResults(cx, ch, line, matches));
  };
}

function searchContentsForHighlight(query, editor, line, ch) {
  return async ({ getState, dispatch }) => {
    const modifiers = (0, _selectors.getFileSearchModifiers)(getState());
    const selectedSource = (0, _selectors.getSelectedSourceWithContent)(getState());

    if (!query || !editor || !selectedSource || !selectedSource.content || !modifiers) {
      return;
    }

    const ctx = { ed: editor, cm: editor.codeMirror };
    const _modifiers = modifiers.toJS();

    (0, _editor.searchSourceForHighlight)(ctx, false, query, true, _modifiers, line, ch);
  };
}

function traverseResults(cx, rev, editor) {
  return async ({ getState, dispatch }) => {
    if (!editor) {
      return;
    }

    const ctx = { ed: editor, cm: editor.codeMirror };

    const query = (0, _selectors.getFileSearchQuery)(getState());
    const modifiers = (0, _selectors.getFileSearchModifiers)(getState());
    const { matches } = (0, _selectors.getFileSearchResults)(getState());

    if (query === "") {
      dispatch((0, _ui.setActiveSearch)("file"));
    }

    if (modifiers) {
      const matchedLocations = matches || [];
      const findArgs = [ctx, query, true, modifiers.toJS()];
      const results = rev ? (0, _editor.findPrev)(...findArgs) : (0, _editor.findNext)(...findArgs);

      if (!results) {
        return;
      }
      const { ch, line } = results;
      dispatch(updateSearchResults(cx, ch, line, matchedLocations));
    }
  };
}

function closeFileSearch(cx, editor) {
  return ({ getState, dispatch }) => {
    if (editor) {
      const query = (0, _selectors.getFileSearchQuery)(getState());
      const ctx = { ed: editor, cm: editor.codeMirror };
      (0, _editor.removeOverlay)(ctx, query);
    }

    dispatch(setFileSearchQuery(cx, ""));
    dispatch((0, _ui.closeActiveSearch)());
    dispatch((0, _ui.clearHighlightLineRange)());
  };
}