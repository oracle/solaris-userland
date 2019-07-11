"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setupHelper = setupHelper;

var _timings = require("./timings");

var timings = _interopRequireWildcard(_timings);

var _prefs = require("./prefs");

var _devtoolsEnvironment = require("devtools/client/debugger/dist/vendors").vendored["devtools-environment"];

var _sourceDocuments = require("./editor/source-documents");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

function findSource(dbg, url) {
  const sources = dbg.selectors.getSourceList();
  return sources.find(s => (s.url || "").includes(url));
}

function findSources(dbg, url) {
  const sources = dbg.selectors.getSourceList();
  return sources.filter(s => (s.url || "").includes(url));
}

function sendPacket(dbg, packet) {
  return dbg.client.sendPacket(packet);
}

function sendPacketToThread(dbg, packet) {
  return sendPacket(dbg, {
    to: dbg.connection.tabConnection.threadClient.actor,
    ...packet
  });
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
  return cm && cm.CodeMirror;
}

function formatMappedLocation(mappedLocation) {
  const { location, generatedLocation } = mappedLocation;
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

function setupHelper(obj) {
  const selectors = bindSelectors(obj);
  const dbg = {
    ...obj,
    selectors,
    prefs: _prefs.prefs,
    asyncStore: _prefs.asyncStore,
    features: _prefs.features,
    timings,
    getCM,
    helpers: {
      findSource: url => findSource(dbg, url),
      findSources: url => findSources(dbg, url),
      evaluate: expression => evaluate(dbg, expression),
      sendPacketToThread: packet => sendPacketToThread(dbg, packet),
      sendPacket: packet => sendPacket(dbg, packet),
      dumpThread: () => sendPacketToThread(dbg, { type: "dumpThread" }),
      getDocument: url => getDocumentForUrl(dbg, url)
    },
    formatters: {
      mappedLocations: locations => formatMappedLocations(locations),
      mappedLocation: location => formatMappedLocation(location),
      selectedColumnBreakpoints: () => formatSelectedColumnBreakpoints(dbg)
    },
    _telemetry: {
      events: {}
    }
  };

  window.dbg = dbg;

  if ((0, _devtoolsEnvironment.isDevelopment)() && !(0, _devtoolsEnvironment.isTesting)()) {
    console.group("Development Notes");
    const baseUrl = "https://firefox-devtools.github.io/debugger";
    const localDevelopmentUrl = `${baseUrl}/docs/dbg.html`;
    console.log("Debugging Tips", localDevelopmentUrl);
    console.log("dbg", window.dbg);
    console.groupEnd();
  }
}