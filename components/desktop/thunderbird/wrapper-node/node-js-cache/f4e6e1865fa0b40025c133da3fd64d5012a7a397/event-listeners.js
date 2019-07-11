"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getActiveEventListeners = getActiveEventListeners;

var _lodash = require("devtools/client/shared/vendor/lodash");

var _prefs = require("../utils/prefs");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

function update(state = [], action) {
  switch (action.type) {
    case "ADD_EVENT_LISTENERS":
      return updateEventTypes("add", state, action.events);

    case "REMOVE_EVENT_LISTENERS":
      return updateEventTypes("remove", state, action.events);

    default:
      return state;
  }
}

function updateEventTypes(addOrRemove, currentEvents, events) {
  let newEventListeners;

  if (addOrRemove === "add") {
    newEventListeners = (0, _lodash.uniq)([...currentEvents, ...events]);
  } else {
    newEventListeners = currentEvents.filter(event => !events.includes(event));
  }

  _prefs.asyncStore.eventListenerBreakpoints = newEventListeners;
  return newEventListeners;
}

function getActiveEventListeners(state) {
  return state.eventListenerBreakpoints;
}

exports.default = update;