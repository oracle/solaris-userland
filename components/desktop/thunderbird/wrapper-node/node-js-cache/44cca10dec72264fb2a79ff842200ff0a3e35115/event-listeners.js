"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initialEventListenerState = initialEventListenerState;
exports.default = void 0;
loader.lazyRequireGetter(this, "_prefs", "devtools/client/debugger/src/utils/prefs");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
function initialEventListenerState() {
  return {
    active: [],
    categories: [],
    expanded: [],
    logEventBreakpoints: _prefs.prefs.logEventBreakpoints
  };
}

function update(state = initialEventListenerState(), action) {
  switch (action.type) {
    case "UPDATE_EVENT_LISTENERS":
      return { ...state,
        active: action.active
      };

    case "RECEIVE_EVENT_LISTENER_TYPES":
      return { ...state,
        categories: action.categories
      };

    case "UPDATE_EVENT_LISTENER_EXPANDED":
      return { ...state,
        expanded: action.expanded
      };

    case "TOGGLE_EVENT_LISTENERS":
      {
        const {
          logEventBreakpoints
        } = action;
        _prefs.prefs.logEventBreakpoints = logEventBreakpoints;
        return { ...state,
          logEventBreakpoints
        };
      }

    default:
      return state;
  }
}

var _default = update;
exports.default = _default;