"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.log = log;

var _devtoolsEnvironment = require("devtools/client/debugger/dist/vendors").vendored["devtools-environment"];

loader.lazyRequireGetter(this, "_prefs", "devtools/client/debugger/src/utils/prefs");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
const blacklist = ["ADD_BREAKPOINT_POSITIONS", "SET_SYMBOLS", "OUT_OF_SCOPE_LOCATIONS", "MAP_SCOPES", "MAP_FRAMES", "ADD_SCOPES", "IN_SCOPE_LINES", "REMOVE_BREAKPOINT", "NODE_PROPERTIES_LOADED", "SET_FOCUSED_SOURCE_ITEM", "NODE_EXPAND", "IN_SCOPE_LINES", "SET_PREVIEW"];

function cloneAction(action) {
  var _action$source, _action$value;

  action = action || {};
  action = { ...action
  }; // ADD_TAB, ...

  if ((_action$source = action.source) === null || _action$source === void 0 ? void 0 : _action$source.text) {
    const source = { ...action.source,
      text: ""
    };
    action.source = source;
  }

  if (action.sources) {
    const sources = action.sources.slice(0, 20).map(source => {
      const url = !source.url || source.url.includes("data:") ? "" : source.url;
      return { ...source,
        url
      };
    });
    action.sources = sources;
  } // LOAD_SOURCE_TEXT


  if (action.text) {
    action.text = "";
  }

  if ((_action$value = action.value) === null || _action$value === void 0 ? void 0 : _action$value.text) {
    const value = { ...action.value,
      text: ""
    };
    action.value = value;
  }

  return action;
}

function formatPause(pause) {
  return { ...pause,
    pauseInfo: {
      why: pause.why
    },
    scopes: [],
    loadedObjects: []
  };
}

function serializeAction(action) {
  try {
    action = cloneAction(action);

    if (blacklist.includes(action.type)) {
      action = {};
    }

    if (action.type === "PAUSED") {
      action = formatPause(action);
    }

    const serializer = function (key, value) {
      // Serialize Object/LongString fronts
      if (value === null || value === void 0 ? void 0 : value.getGrip) {
        return value.getGrip();
      }

      return value;
    }; // dump(`> ${action.type}...\n ${JSON.stringify(action, serializer)}\n`);


    return JSON.stringify(action, serializer);
  } catch (e) {
    console.error(e);
    return "";
  }
}
/**
 * A middleware that logs all actions coming through the system
 * to the console.
 */


function log({
  dispatch,
  getState
}) {
  return next => action => {
    const asyncMsg = !action.status ? "" : `[${action.status}]`;

    if (_prefs.prefs.logActions) {
      if ((0, _devtoolsEnvironment.isTesting)()) {
        // $FlowIgnore
        dump(`[ACTION] ${action.type} ${asyncMsg} - ${serializeAction(action)}\n`);
      } else {
        console.log(action, asyncMsg);
      }
    }

    next(action);
  };
}