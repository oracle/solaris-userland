"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.log = log;
loader.lazyRequireGetter(this, "_prefs", "devtools/client/debugger/src/utils/prefs");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

/*       */

/**
 *
 * Utils for logging to the console
 * Suppresses logging in non-development environment
 *
 * @module utils/log
 */

/**
 * Produces a formatted console log line by imploding args, prefixed by [log]
 *
 * function input: log(["hello", "world"])
 * console output: [log] hello world
 *
 * @memberof utils/log
 * @static
 */
function log(...args) {
  if (_prefs.prefs.logging) {
    console.log(...args);
  }
}