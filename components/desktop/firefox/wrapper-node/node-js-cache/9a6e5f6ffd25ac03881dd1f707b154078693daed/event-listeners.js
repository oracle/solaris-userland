"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addEventListenerBreakpoints = addEventListenerBreakpoints;
exports.removeEventListenerBreakpoints = removeEventListenerBreakpoints;
exports.toggleEventLogging = toggleEventLogging;
exports.addEventListenerExpanded = addEventListenerExpanded;
exports.removeEventListenerExpanded = removeEventListenerExpanded;
exports.getEventListenerBreakpointTypes = getEventListenerBreakpointTypes;
loader.lazyRequireGetter(this, "_index", "devtools/client/debugger/src/selectors/index");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
async function updateBreakpoints(dispatch, client, newEvents) {
  await client.setEventListenerBreakpoints(newEvents);
  dispatch({
    type: "UPDATE_EVENT_LISTENERS",
    active: newEvents
  });
}

async function updateExpanded(dispatch, newExpanded) {
  dispatch({
    type: "UPDATE_EVENT_LISTENER_EXPANDED",
    expanded: newExpanded
  });
}

function addEventListenerBreakpoints(eventsToAdd) {
  return async ({
    dispatch,
    client,
    getState
  }) => {
    const activeListenerBreakpoints = await (0, _index.getActiveEventListeners)(getState());
    const newEvents = [...new Set([...eventsToAdd, ...activeListenerBreakpoints])];
    await updateBreakpoints(dispatch, client, newEvents);
  };
}

function removeEventListenerBreakpoints(eventsToRemove) {
  return async ({
    dispatch,
    client,
    getState
  }) => {
    const activeListenerBreakpoints = await (0, _index.getActiveEventListeners)(getState());
    const newEvents = activeListenerBreakpoints.filter(event => !eventsToRemove.includes(event));
    await updateBreakpoints(dispatch, client, newEvents);
  };
}

function toggleEventLogging() {
  return async ({
    dispatch,
    getState,
    client
  }) => {
    const logEventBreakpoints = !(0, _index.shouldLogEventBreakpoints)(getState());
    await client.toggleEventLogging(logEventBreakpoints);
    dispatch({
      type: "TOGGLE_EVENT_LISTENERS",
      logEventBreakpoints
    });
  };
}

function addEventListenerExpanded(category) {
  return async ({
    dispatch,
    getState
  }) => {
    const expanded = await (0, _index.getEventListenerExpanded)(getState());
    const newExpanded = [...new Set([...expanded, category])];
    await updateExpanded(dispatch, newExpanded);
  };
}

function removeEventListenerExpanded(category) {
  return async ({
    dispatch,
    getState
  }) => {
    const expanded = await (0, _index.getEventListenerExpanded)(getState());
    const newExpanded = expanded.filter(expand => expand != category);
    updateExpanded(dispatch, newExpanded);
  };
}

function getEventListenerBreakpointTypes() {
  return async ({
    dispatch,
    client
  }) => {
    const categories = await client.getEventListenerBreakpointTypes();
    dispatch({
      type: "RECEIVE_EVENT_LISTENER_TYPES",
      categories
    });
  };
}