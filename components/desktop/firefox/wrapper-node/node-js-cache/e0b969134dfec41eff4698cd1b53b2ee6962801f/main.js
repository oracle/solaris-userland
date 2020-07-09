"use strict";

var _reactDom = _interopRequireDefault(require("devtools/client/shared/vendor/react-dom"));

loader.lazyRequireGetter(this, "_client", "devtools/client/debugger/src/client/index");
loader.lazyRequireGetter(this, "_bootstrap", "devtools/client/debugger/src/utils/bootstrap");

var _sourceQueue = _interopRequireDefault(require("./utils/source-queue"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
function unmountRoot() {
  const mount = document.querySelector("#mount .launchpad-root");

  _reactDom.default.unmountComponentAtNode(mount);
}

module.exports = {
  bootstrap: ({
    targetList,
    devToolsClient,
    workers,
    panel
  }) => (0, _client.onConnect)({
    tab: {
      clientType: "firefox"
    },
    targetList,
    devToolsClient
  }, workers, panel),
  destroy: () => {
    unmountRoot();

    _sourceQueue.default.clear();

    (0, _bootstrap.teardownWorkers)();
  }
};