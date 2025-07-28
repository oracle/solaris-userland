"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSelectedTraceIndex = getSelectedTraceIndex;
exports.getSelectedTraceLocation = getSelectedTraceLocation;
exports.getFilteredTopTraces = getFilteredTopTraces;
exports.getAllTraces = getAllTraces;
exports.getTraceChildren = getTraceChildren;
exports.getTraceParents = getTraceParents;
exports.getTraceFrames = getTraceFrames;
exports.getAllMutationTraces = getAllMutationTraces;
exports.getAllTraceCount = getAllTraceCount;
exports.getRuntimeVersions = getRuntimeVersions;
exports.getTracerEventNames = getTracerEventNames;
exports.getTraceDomEvent = getTraceDomEvent;
exports.getTraceHighlightedDomEvents = getTraceHighlightedDomEvents;
exports.getSelectedTraceSource = getSelectedTraceSource;
exports.getTraceMatchingSearchTraces = getTraceMatchingSearchTraces;
exports.getTraceMatchingSearchException = getTraceMatchingSearchException;
exports.getTraceMatchingSearchValueOrGrip = getTraceMatchingSearchValueOrGrip;
exports.getIsTracingValues = getIsTracingValues;
loader.lazyRequireGetter(this, "_sources", "devtools/client/debugger/src/selectors/sources.js");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
const {
  TRACER_FIELDS_INDEXES
} = require("resource://devtools/server/actors/tracer.js");

function getSelectedTraceIndex(state) {
  return state.tracerFrames?.selectedTraceIndex;
}

function getSelectedTraceLocation(state) {
  return state.tracerFrames?.selectedTraceLocation;
}

function getFilteredTopTraces(state) {
  return state.tracerFrames?.mutableFilteredTopTraces || [];
}

function getAllTraces(state) {
  return state.tracerFrames?.mutableTraces || [];
}

function getTraceChildren(state) {
  return state.tracerFrames?.mutableChildren || [];
}

function getTraceParents(state) {
  return state.tracerFrames?.mutableParents || [];
}

function getTraceFrames(state) {
  return state.tracerFrames?.mutableFrames || [];
}

function getAllMutationTraces(state) {
  return state.tracerFrames?.mutableMutationTraces || [];
}

function getAllTraceCount(state) {
  return state.tracerFrames?.mutableTraces.length || 0;
}

function getRuntimeVersions(state) {
  return {
    localPlatformVersion: state.tracerFrames?.localPlatformVersion,
    remotePlatformVersion: state.tracerFrames?.remotePlatformVersion
  };
}

function getTracerEventNames(state) {
  return state.tracerFrames?.mutableEventNames;
}

function getTraceDomEvent(state) {
  return state.tracerFrames?.domEvents || new Set();
}

function getTraceHighlightedDomEvents(state) {
  return state.tracerFrames?.highlightedDomEvents || [];
}

function getSelectedTraceSource(state) {
  const trace = getAllTraces(state)[getSelectedTraceIndex(state)];

  if (!trace) {
    return null;
  }

  const frameIndex = trace[TRACER_FIELDS_INDEXES.FRAME_INDEX];
  const frames = getTraceFrames(state);
  const frame = frames[frameIndex];

  if (!frame) {
    return null;
  }

  return (0, _sources.getSourceByActorId)(state, frame.sourceId);
}

function getTraceMatchingSearchTraces(state) {
  return state.tracerFrames?.mutableMatchingTraces || [];
}

function getTraceMatchingSearchException(state) {
  return state.tracerFrames?.searchExceptionMessage || null;
}

function getTraceMatchingSearchValueOrGrip(state) {
  return state.tracerFrames?.searchValueOrGrip;
}

function getIsTracingValues(state) {
  return state.tracerFrames?.traceValues || false;
}