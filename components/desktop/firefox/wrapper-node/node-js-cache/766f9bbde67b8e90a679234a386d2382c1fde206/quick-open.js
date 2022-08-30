"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getQuickOpenEnabled = getQuickOpenEnabled;
exports.getQuickOpenQuery = getQuickOpenQuery;
exports.getQuickOpenType = getQuickOpenType;

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
function getQuickOpenEnabled(state) {
  return state.quickOpen.enabled;
}

function getQuickOpenQuery(state) {
  return state.quickOpen.query;
}

function getQuickOpenType(state) {
  return state.quickOpen.searchType;
}