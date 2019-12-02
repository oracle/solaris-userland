"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stop = exports.start = undefined;
exports.prettyPrint = prettyPrint;

var _devtoolsUtils = require("devtools/client/debugger/dist/vendors").vendored["devtools-utils"];

const { WorkerDispatcher } = _devtoolsUtils.workerUtils; /* This Source Code Form is subject to the terms of the Mozilla Public
                                                          * License, v. 2.0. If a copy of the MPL was not distributed with this
                                                          * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

const dispatcher = new WorkerDispatcher();
const start = exports.start = dispatcher.start.bind(dispatcher);
const stop = exports.stop = dispatcher.stop.bind(dispatcher);

async function prettyPrint({ text, url }) {
  return dispatcher.invoke("prettyPrint", {
    url,
    indent: 2,
    sourceText: text
  });
}