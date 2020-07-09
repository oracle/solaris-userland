"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setupHelper = setupHelper;

var timings = _interopRequireWildcard(require("./timings"));

loader.lazyRequireGetter(this, "_prefs", "devtools/client/debugger/src/utils/prefs");

var _devtoolsEnvironment = require("devtools/client/debugger/dist/vendors").vendored["devtools-environment"];

loader.lazyRequireGetter(this, "_sourceDocuments", "devtools/client/debugger/src/utils/editor/source-documents");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
function getThreadFront(dbg) {
  return dbg.connection.targetList.targetFront.threadFront;
}

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
    to: getThreadFront(dbg).actor,
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
    timings,
    getCM,
    helpers: {
      findSource: url => findSource(dbg, url),
      findSources: url => findSources(dbg, url),
      evaluate: expression => evaluate(dbg, expression),
      sendPacketToThread: packet => sendPacketToThread(dbg, packet),
      sendPacket: packet => sendPacket(dbg, packet),
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

  if ((0, _devtoolsEnvironment.isDevelopment)() && !(0, _devtoolsEnvironment.isTesting)()) {
    console.group("Development Notes");
    const baseUrl = "https://firefox-devtools.github.io/debugger";
    const localDevelopmentUrl = `${baseUrl}/docs/dbg.html`;
    console.log("Debugging Tips", localDevelopmentUrl);
    console.log("dbg", window.dbg);
    console.groupEnd();
  }
}