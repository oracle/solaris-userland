"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = update;
exports.initialQuickOpenState = void 0;
loader.lazyRequireGetter(this, "_quickOpen", "devtools/client/debugger/src/utils/quick-open");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

/**
 * Quick Open reducer
 * @module reducers/quick-open
 */
const initialQuickOpenState = () => ({
  enabled: false,
  query: "",
  searchType: "sources"
});

exports.initialQuickOpenState = initialQuickOpenState;

function update(state = initialQuickOpenState(), action) {
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
      return initialQuickOpenState();

    case "SET_QUICK_OPEN_QUERY":
      return { ...state,
        query: action.query,
        searchType: (0, _quickOpen.parseQuickOpenQuery)(action.query)
      };

    default:
      return state;
  }
}