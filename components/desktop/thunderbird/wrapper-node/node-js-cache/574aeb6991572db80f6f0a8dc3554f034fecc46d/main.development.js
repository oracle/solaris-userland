"use strict";

var _react = _interopRequireDefault(require("devtools/client/shared/vendor/react"));

var _reactDom = _interopRequireDefault(require("devtools/client/shared/vendor/react-dom"));

loader.lazyRequireGetter(this, "_client", "devtools/client/debugger/src/client/index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
const {
  bootstrap,
  L10N
} = require("devtools/shared/flags");

window.L10N = L10N; // $FlowIgnore:

window.L10N.setBundle(require("../../locales/en-US/debugger.properties/index"));
bootstrap(_react.default, _reactDom.default).then(connection => {
  (0, _client.onConnect)(connection, require("devtools/client/shared/source-map/index.js"), {
    emit: eventName => console.log(`emitted: ${eventName}`),
    openLink: url => {
      const win = window.open(url, "_blank");
      win.focus();
    },
    openInspector: () => console.log("opening inspector"),
    openElementInInspector: grip => alert(`Opening node in Inspector: ${grip.class}`),
    openConsoleAndEvaluate: input => alert(`console.log: ${input}`),
    highlightDomElement: grip => console.log("highlighting dom element"),
    unHighlightDomElement: grip => console.log("unhighlighting dom element"),
    getToolboxStore: () => {
      throw new Error("Cannot connect to Toolbox store when running Launchpad");
    },
    panelWin: window
  });
});