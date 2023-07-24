"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
loader.lazyRequireGetter(this, "_environment", "devtools/client/debugger/src/utils/environment");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
let assert; // TODO: try to enable these assertions on mochitest by also enabling it on:
//   import flags from "devtools/shared/flags";
//   if (flags.testing)
// Unfortunately it throws a lot on mochitests...

if ((0, _environment.isNodeTest)()) {
  assert = function (condition, message) {
    if (!condition) {
      throw new Error(`Assertion failure: ${message}`);
    }
  };
} else {
  assert = function () {};
}

var _default = assert;
exports.default = _default;