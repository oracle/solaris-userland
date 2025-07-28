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
function getActiveEventListeners(state, panelKey) {
  if (panelKey == "breakpoint") {
    return state.eventListenerBreakpoints.byPanel[panelKey].active;
  }

  return state.tracerFrames.activeDomEvents;
}

function getEventListenerBreakpointTypes(state, panelKey) {
  if (panelKey == "breakpoint") {
    return state.eventListenerBreakpoints.categories;
  }

  return state.tracerFrames.domEventCategories;
}

function getEventListenerExpanded(state, panelKey) {
  return state.eventListenerBreakpoints.byPanel[panelKey].expanded;
}

function shouldLogEventBreakpoints(state) {
  return state.eventListenerBreakpoints.logEventBreakpoints;
}