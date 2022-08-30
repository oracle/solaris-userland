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
loader.lazyRequireGetter(this, "_editor", "devtools/client/debugger/src/utils/editor/index");
loader.lazyRequireGetter(this, "_wasm", "devtools/client/debugger/src/utils/wasm");
loader.lazyRequireGetter(this, "_search", "devtools/client/debugger/src/workers/search/index");
loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_ui", "devtools/client/debugger/src/actions/ui");
loader.lazyRequireGetter(this, "_asyncValue", "devtools/client/debugger/src/utils/async-value");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
function doSearch(cx, query, editor) {
  return ({
    getState,
    dispatch
  }) => {
    const sourceTextContent = (0, _selectors.getSelectedSourceTextContent)(getState());

    if (!sourceTextContent) {
      return;
    }

    dispatch(setFileSearchQuery(cx, query));
    dispatch(searchContents(cx, query, editor));
  };
}

function doSearchForHighlight(query, editor, line, ch) {
  return async ({
    getState,
    dispatch
  }) => {
    const sourceTextContent = (0, _selectors.getSelectedSourceTextContent)(getState());

    if (!sourceTextContent) {
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
  return {
    type: "TOGGLE_FILE_SEARCH_MODIFIER",
    cx,
    modifier
  };
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
  return async ({
    getState,
    dispatch
  }) => {
    const modifiers = (0, _selectors.getFileSearchModifiers)(getState());
    const sourceTextContent = (0, _selectors.getSelectedSourceTextContent)(getState());

    if (!editor || !sourceTextContent || !(0, _asyncValue.isFulfilled)(sourceTextContent) || !modifiers) {
      return;
    }

    const selectedContent = sourceTextContent.value;
    const ctx = {
      ed: editor,
      cm: editor.codeMirror
    };

    if (!query) {
      (0, _editor.clearSearch)(ctx.cm, query);
      return;
    }

    let text;

    if (selectedContent.type === "wasm") {
      const selectedSourceId = (0, _selectors.getSelectedSourceId)(getState());
      text = (0, _wasm.renderWasmText)(selectedSourceId, selectedContent).join("\n");
    } else {
      text = selectedContent.value;
    }

    const matches = await (0, _search.getMatches)(query, text, modifiers);
    const res = (0, _editor.find)(ctx, query, true, modifiers, focusFirstResult);

    if (!res) {
      return;
    }

    const {
      ch,
      line
    } = res;
    dispatch(updateSearchResults(cx, ch, line, matches));
  };
}

function searchContentsForHighlight(query, editor, line, ch) {
  return async ({
    getState,
    dispatch
  }) => {
    const modifiers = (0, _selectors.getFileSearchModifiers)(getState());
    const sourceTextContent = (0, _selectors.getSelectedSourceTextContent)(getState());

    if (!query || !editor || !sourceTextContent || !modifiers) {
      return;
    }

    const ctx = {
      ed: editor,
      cm: editor.codeMirror
    };
    (0, _editor.searchSourceForHighlight)(ctx, false, query, true, modifiers, line, ch);
  };
}

function traverseResults(cx, rev, editor) {
  return async ({
    getState,
    dispatch
  }) => {
    if (!editor) {
      return;
    }

    const ctx = {
      ed: editor,
      cm: editor.codeMirror
    };
    const query = (0, _selectors.getFileSearchQuery)(getState());
    const modifiers = (0, _selectors.getFileSearchModifiers)(getState());
    const {
      matches
    } = (0, _selectors.getFileSearchResults)(getState());

    if (query === "") {
      dispatch((0, _ui.setActiveSearch)("file"));
    }

    if (modifiers) {
      const matchedLocations = matches || [];
      const findArgs = [ctx, query, true, modifiers];
      const results = rev ? (0, _editor.findPrev)(...findArgs) : (0, _editor.findNext)(...findArgs);

      if (!results) {
        return;
      }

      const {
        ch,
        line
      } = results;
      dispatch(updateSearchResults(cx, ch, line, matchedLocations));
    }
  };
}

function closeFileSearch(cx, editor) {
  return ({
    getState,
    dispatch
  }) => {
    if (editor) {
      const query = (0, _selectors.getFileSearchQuery)(getState());
      const ctx = {
        ed: editor,
        cm: editor.codeMirror
      };
      (0, _editor.removeOverlay)(ctx, query);
    }

    dispatch(setFileSearchQuery(cx, ""));
    dispatch((0, _ui.closeActiveSearch)());
    dispatch((0, _ui.clearHighlightLineRange)());
  };
}