"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = update;
exports.getQuickOpenEnabled = getQuickOpenEnabled;
exports.getQuickOpenQuery = getQuickOpenQuery;
exports.getQuickOpenType = getQuickOpenType;
exports.createQuickOpenState = void 0;
loader.lazyRequireGetter(this, "_quickOpen", "devtools/client/debugger/src/utils/quick-open");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

/**
 * Quick Open reducer
 * @module reducers/quick-open
 */
const createQuickOpenState = () => ({
  enabled: false,
  query: "",
  searchType: "sources"
});

exports.createQuickOpenState = createQuickOpenState;

function update(state = createQuickOpenState(), action) {
  switch (action.type) {
    case "OPEN_QUICK_OPEN":
      if (action.query != null) {
        return { ...state,
          enabled: true,
          query: action.query,
          searchType: (0, _quickOpen.parseQuickOpenQuery)(action.query)
        };
      }

      return { ...state,
        enabled: true
      };

    case "CLOSE_QUICK_OPEN":
      return createQuickOpenState();

    case "SET_QUICK_OPEN_QUERY":
      return { ...state,
        query: action.query,
        searchType: (0, _quickOpen.parseQuickOpenQuery)(action.query)
      };

    default:
      return state;
  }
}

function getQuickOpenEnabled(state) {
  return state.quickOpen.enabled;
}

function getQuickOpenQuery(state) {
  return state.quickOpen.query;
}

function getQuickOpenType(state) {
  return state.quickOpen.searchType;
}