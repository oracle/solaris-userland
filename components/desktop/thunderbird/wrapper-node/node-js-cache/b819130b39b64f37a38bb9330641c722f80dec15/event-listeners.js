"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getActiveEventListeners = getActiveEventListeners;
exports.getEventListenerBreakpointTypes = getEventListenerBreakpointTypes;
exports.getEventListenerExpanded = getEventListenerExpanded;
exports.shouldLogEventBreakpoints = shouldLogEventBreakpoints;

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
function getActiveEventListeners(state) {
  return state.eventListenerBreakpoints.active;
}

function getEventListenerBreakpointTypes(state) {
  return state.eventListenerBreakpoints.categories;
}

function getEventListenerExpanded(state) {
  return state.eventListenerBreakpoints.expanded;
}

function shouldLogEventBreakpoints(state) {
  return state.eventListenerBreakpoints.logEventBreakpoints;
}