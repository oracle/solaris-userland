"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.prettyPrint = prettyPrint;
exports.stop = exports.start = void 0;
loader.lazyRequireGetter(this, "_prefs", "devtools/client/debugger/src/utils/prefs");

var _workerUtils = require("devtools/client/shared/worker-utils");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
let dispatcher;
let workerPath;

const start = path => {
  workerPath = path;
};

exports.start = start;

const stop = () => {
  if (dispatcher) {
    dispatcher.stop();
    dispatcher = null;
    workerPath = null;
  }
};

exports.stop = stop;

async function prettyPrint({
  text,
  url
}) {
  if (!dispatcher) {
    dispatcher = new _workerUtils.WorkerDispatcher();
    dispatcher.start(workerPath);
  }

  return dispatcher.invoke("prettyPrint", {
    url,
    indent: _prefs.prefs.indentSize,
    sourceText: text
  });
}