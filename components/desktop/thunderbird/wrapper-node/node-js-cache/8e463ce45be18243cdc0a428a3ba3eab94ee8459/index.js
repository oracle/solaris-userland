"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findSourceMatches = exports.getMatches = exports.stop = exports.start = void 0;

var _devtoolsUtils = require("devtools/client/debugger/dist/vendors").vendored["devtools-utils"];

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
const {
  WorkerDispatcher
} = _devtoolsUtils.workerUtils;
let startArgs;
let dispatcher;

function getDispatcher() {
  if (!dispatcher) {
    dispatcher = new WorkerDispatcher();
    dispatcher.start(...startArgs);
  }

  return dispatcher;
}

const start = (...args) => {
  startArgs = args;
};

exports.start = start;

const stop = () => {
  if (dispatcher) {
    dispatcher.stop();
    dispatcher = null;
    startArgs = null;
  }
};

exports.stop = stop;

const getMatches = (...args) => {
  return getDispatcher().invoke("getMatches", ...args);
};

exports.getMatches = getMatches;

const findSourceMatches = (...args) => {
  return getDispatcher().invoke("findSourceMatches", ...args);
};

exports.findSourceMatches = findSourceMatches;