"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.doSearchForHighlight = doSearchForHighlight;
exports.querySearchWorker = querySearchWorker;
exports.searchContentsForHighlight = searchContentsForHighlight;
exports.closeFileSearch = closeFileSearch;
loader.lazyRequireGetter(this, "_index", "devtools/client/debugger/src/utils/editor/index");
loader.lazyRequireGetter(this, "_index2", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_ui", "devtools/client/debugger/src/actions/ui");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
function doSearchForHighlight(query, editor) {
  return async ({
    getState,
    dispatch
  }) => {
    const sourceTextContent = (0, _index2.getSelectedSourceTextContent)(getState());

    if (!sourceTextContent) {
      return;
    }

    dispatch(searchContentsForHighlight(query, editor));
  };
} // Expose an action to the React component, so that it can call the searchWorker.


function querySearchWorker(query, text, modifiers) {
  return ({
    searchWorker
  }) => {
    return searchWorker.getMatches(query, text, modifiers);
  };
}

function searchContentsForHighlight(query, editor) {
  return async ({
    getState
  }) => {
    const modifiers = (0, _index2.getSearchOptions)(getState(), "file-search");
    const sourceTextContent = (0, _index2.getSelectedSourceTextContent)(getState());

    if (!query || !editor || !sourceTextContent || !modifiers) {
      return;
    }

    const ctx = {
      editor,
      cm: editor.codeMirror
    };
    (0, _index.searchSourceForHighlight)(ctx, false, query, true, modifiers);
  };
}

function closeFileSearch() {
  return ({
    dispatch
  }) => {
    dispatch((0, _ui.closeActiveSearch)());
    dispatch((0, _ui.clearHighlightLineRange)());
  };
}