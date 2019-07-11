"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDisplayName = getDisplayName;
exports.isWorker = isWorker;

var _path = require("./path");

function getDisplayName(thread) {
  return (0, _path.basename)(thread.url);
} /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

function isWorker(thread) {
  return thread.actor.includes("workerTarget");
}