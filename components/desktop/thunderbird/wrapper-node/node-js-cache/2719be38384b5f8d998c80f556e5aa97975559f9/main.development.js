"use strict";

var _react = require("devtools/client/shared/vendor/react");

var _react2 = _interopRequireDefault(_react);

var _reactDom = require("devtools/client/shared/vendor/react-dom");

var _reactDom2 = _interopRequireDefault(_reactDom);

var _client = require("./client/index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const { bootstrap, L10N } = require("devtools/shared/flags"); /* This Source Code Form is subject to the terms of the Mozilla Public
                                                               * License, v. 2.0. If a copy of the MPL was not distributed with this
                                                               * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

window.L10N = L10N;
// $FlowIgnore:
window.L10N.setBundle(require("../../locales/en-US/debugger.properties/index"));

bootstrap(_react2.default, _reactDom2.default).then(connection => {
  (0, _client.onConnect)(connection, require("devtools/client/shared/source-map/index.js"), {
    emit: eventName => console.log(`emitted: ${eventName}`),
    openLink: url => {
      const win = window.open(url, "_blank");
      win.focus();
    },
    openWorkerToolbox: worker => alert(worker.url),
    openElementInInspector: grip => alert(`Opening node in Inspector: ${grip.class}`),
    openConsoleAndEvaluate: input => alert(`console.log: ${input}`),
    highlightDomElement: grip => console.log("highlighting dom element"),
    unHighlightDomElement: grip => console.log("unhighlighting dom element")
  });
});