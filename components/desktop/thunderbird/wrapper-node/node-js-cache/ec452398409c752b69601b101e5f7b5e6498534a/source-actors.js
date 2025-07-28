"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.insertSourceActors = insertSourceActors;

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
function insertSourceActors(sourceActors) {
  return function ({
    dispatch
  }) {
    dispatch({
      type: "INSERT_SOURCE_ACTORS",
      sourceActors
    });
  };
}