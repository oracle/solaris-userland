"use strict";

var _reactDom = require("devtools/client/shared/vendor/react-dom");

var _reactDom2 = _interopRequireDefault(_reactDom);

var _client = require("./client/index");

var _bootstrap = require("./utils/bootstrap");

var _sourceQueue = require("./utils/source-queue");

var _sourceQueue2 = _interopRequireDefault(_sourceQueue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

function unmountRoot() {
  const mount = document.querySelector("#mount .launchpad-root");
  _reactDom2.default.unmountComponentAtNode(mount);
}

module.exports = {
  bootstrap: ({
    threadClient,
    tabTarget,
    debuggerClient,
    workers,
    panel
  }) => (0, _client.onConnect)({
    tab: { clientType: "firefox" },
    tabConnection: {
      tabTarget,
      threadClient,
      debuggerClient
    }
  }, workers, panel),
  destroy: () => {
    unmountRoot();
    _sourceQueue2.default.clear();
    (0, _bootstrap.teardownWorkers)();
  }
};