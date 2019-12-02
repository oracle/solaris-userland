"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addEventListeners = addEventListeners;
exports.removeEventListeners = removeEventListeners;

var _prefs = require("../utils/prefs");

function addEventListeners(events) {
  return async ({ dispatch, client }) => {
    await dispatch({
      type: "ADD_EVENT_LISTENERS",
      events
    });
    const newList = await _prefs.asyncStore.eventListenerBreakpoints;
    client.setEventListenerBreakpoints(newList);
  };
} /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

function removeEventListeners(events) {
  return async ({ dispatch, client }) => {
    await dispatch({
      type: "REMOVE_EVENT_LISTENERS",
      events
    });
    const newList = await _prefs.asyncStore.eventListenerBreakpoints;
    client.setEventListenerBreakpoints(newList);
  };
}