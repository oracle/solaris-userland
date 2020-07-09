"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.history = void 0;

var _devtoolsEnvironment = require("devtools/client/debugger/dist/vendors").vendored["devtools-environment"];

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

/**
 * A middleware that stores every action coming through the store in the passed
 * in logging object. Should only be used for tests, as it collects all
 * action information, which will cause memory bloat.
 */
const history = (log = []) => ({
  dispatch,
  getState
}) => {
  return next => action => {
    if ((0, _devtoolsEnvironment.isDevelopment)()) {
      log.push(action);
    }

    return next(action);
  };
};

exports.history = history;