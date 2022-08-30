"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setupHelper = setupHelper;
loader.lazyRequireGetter(this, "_prefs", "devtools/client/debugger/src/utils/prefs");
loader.lazyRequireGetter(this, "_sourceDocuments", "devtools/client/debugger/src/utils/editor/source-documents");
loader.lazyRequireGetter(this, "_wasm", "devtools/client/debugger/src/utils/wasm");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
function getThreadFront(dbg) {
  return dbg.targetCommand.targetFront.threadFront;
}

function findSource(dbg, url) {
  const sources = dbg.selectors.getSourceList();
  return sources.find(s => (s.url || "").includes(url));
}

function findSources(dbg, url) {
  const sources = dbg.selectors.getSourceList();
  return sources.filter(s => (s.url || "").includes(url));
}

function evaluate(dbg, expression) {
  return dbg.client.evaluate(expression);
}

function bindSelectors(obj) {
  return Object.keys(obj.selectors).reduce((bound, selector) => {
    bound[selector] = (a, b, c) => obj.selectors[selector](obj.store.getState(), a, b, c);

    return bound;
  }, {});
}

function getCM() {
  const cm = document.querySelector(".CodeMirror");
  return cm === null || cm === void 0 ? void 0 : cm.CodeMirror;
}

function formatMappedLocation(mappedLocation) {
  const {
    location,
    generatedLocation
  } = mappedLocation;
  return {
    original: `(${location.line}, ${location.column})`,
    generated: `(${generatedLocation.line}, ${generatedLocation.column})`
  };
}

function formatMappedLocations(locations) {
  return console.table(locations.map(loc => formatMappedLocation(loc)));
}

function formatSelectedColumnBreakpoints(dbg) {
  const positions = dbg.selectors.getBreakpointPositionsForSource(dbg.selectors.getSelectedSource().id);
  return formatMappedLocations(positions);
}

function getDocumentForUrl(dbg, url) {
  const source = findSource(dbg, url);
  return (0, _sourceDocuments.getDocument)(source.id);
}

const diff = (a, b) => Object.keys(a).filter(key => !Object.is(a[key], b[key]));

function setupHelper(obj) {
  const selectors = bindSelectors(obj);
  const dbg = { ...obj,
    selectors,
    prefs: _prefs.prefs,
    asyncStore: _prefs.asyncStore,
    features: _prefs.features,
    getCM,
    // Expose this to tests as they don't have access to debugger's browser loader require
    // and so can't load utils/wasm.js
    wasmOffsetToLine: (sourceId, offset) => (0, _wasm.wasmOffsetToLine)(sourceId, offset),
    helpers: {
      findSource: url => findSource(dbg, url),
      findSources: url => findSources(dbg, url),
      evaluate: expression => evaluate(dbg, expression),
      dumpThread: () => getThreadFront(dbg).dumpThread(),
      getDocument: url => getDocumentForUrl(dbg, url)
    },
    formatters: {
      mappedLocations: locations => formatMappedLocations(locations),
      mappedLocation: location => formatMappedLocation(location),
      selectedColumnBreakpoints: () => formatSelectedColumnBreakpoints(dbg)
    },
    _telemetry: {
      events: {}
    },
    diff
  };
  window.dbg = dbg;
}