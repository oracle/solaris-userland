"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pending = pending;
exports.fulfilled = fulfilled;
exports.rejected = rejected;
exports.isPending = isPending;
exports.isFulfilled = isFulfilled;
exports.isRejected = isRejected;
function pending() {
  return { state: "pending" };
} /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

function fulfilled(value) {
  return { state: "fulfilled", value };
}
function rejected(value) {
  return { state: "rejected", value };
}

function isPending(value) {
  return value.state === "pending";
}
function isFulfilled(value) {
  return value.state === "fulfilled";
}
function isRejected(value) {
  return value.state === "rejected";
}