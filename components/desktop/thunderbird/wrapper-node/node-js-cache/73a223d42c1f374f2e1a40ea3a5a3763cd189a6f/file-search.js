"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFileSearchQuery = getFileSearchQuery;
exports.getFileSearchModifiers = getFileSearchModifiers;
exports.getFileSearchResults = getFileSearchResults;
exports.default = exports.createFileSearchState = void 0;
loader.lazyRequireGetter(this, "_prefs", "devtools/client/debugger/src/utils/prefs");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

/**
 * File Search reducer
 * @module reducers/fileSearch
 */
const emptySearchResults = Object.freeze({
  matches: Object.freeze([]),
  matchIndex: -1,
  index: -1,
  count: 0
});

const createFileSearchState = () => ({
  query: "",
  searchResults: emptySearchResults,
  modifiers: {
    caseSensitive: _prefs.prefs.fileSearchCaseSensitive,
    wholeWord: _prefs.prefs.fileSearchWholeWord,
    regexMatch: _prefs.prefs.fileSearchRegexMatch
  }
});

exports.createFileSearchState = createFileSearchState;

function update(state = createFileSearchState(), action) {
  switch (action.type) {
    case "UPDATE_FILE_SEARCH_QUERY":
      {
        return { ...state,
          query: action.query
        };
      }

    case "UPDATE_SEARCH_RESULTS":
      {
        return { ...state,
          searchResults: action.results
        };
      }

    case "TOGGLE_FILE_SEARCH_MODIFIER":
      {
        const actionVal = !state.modifiers[action.modifier];

        if (action.modifier == "caseSensitive") {
          _prefs.prefs.fileSearchCaseSensitive = actionVal;
        }

        if (action.modifier == "wholeWord") {
          _prefs.prefs.fileSearchWholeWord = actionVal;
        }

        if (action.modifier == "regexMatch") {
          _prefs.prefs.fileSearchRegexMatch = actionVal;
        }

        return { ...state,
          modifiers: { ...state.modifiers,
            [action.modifier]: actionVal
          }
        };
      }

    case "NAVIGATE":
      {
        return { ...state,
          query: "",
          searchResults: emptySearchResults
        };
      }

    default:
      {
        return state;
      }
  }
} // NOTE: we'd like to have the app state fully typed
// https://github.com/firefox-devtools/debugger/blob/master/src/reducers/sources.js#L179-L185


function getFileSearchQuery(state) {
  return state.fileSearch.query;
}

function getFileSearchModifiers(state) {
  return state.fileSearch.modifiers;
}

function getFileSearchResults(state) {
  return state.fileSearch.searchResults;
}

var _default = update;
exports.default = _default;