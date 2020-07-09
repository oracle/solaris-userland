"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.vendored = void 0;

var devtoolsComponents = _interopRequireWildcard(require("devtools/client/debugger/dist/vendors").vendored["devtools-components"]);

var devtoolsConfig = _interopRequireWildcard(require("devtools/client/debugger/dist/vendors").vendored["devtools-config"]);

var devtoolsContextmenu = _interopRequireWildcard(require("devtools/client/debugger/dist/vendors").vendored["devtools-contextmenu"]);

var devtoolsEnvironment = _interopRequireWildcard(require("devtools/client/debugger/dist/vendors").vendored["devtools-environment"]);

var devtoolsModules = _interopRequireWildcard(require("devtools/client/debugger/dist/vendors").vendored["devtools-modules"]);

var devtoolsUtils = _interopRequireWildcard(require("devtools/client/debugger/dist/vendors").vendored["devtools-utils"]);

var fuzzaldrinPlus = _interopRequireWildcard(require("devtools/client/debugger/dist/vendors").vendored["fuzzaldrin-plus"]);

var transition = _interopRequireWildcard(require("devtools/client/debugger/dist/vendors").vendored["react-transition-group/Transition"]);

var reactAriaComponentsTabs = _interopRequireWildcard(require("devtools/client/debugger/dist/vendors").vendored["react-aria-components/src/tabs"]);

var _classnames = _interopRequireDefault(require("devtools/client/debugger/dist/vendors").vendored["classnames"]);

var _devtoolsSplitter = _interopRequireDefault(require("devtools/client/debugger/dist/vendors").vendored["devtools-splitter"]);

var _lodashMove = _interopRequireDefault(require("devtools/client/debugger/dist/vendors").vendored["lodash-move"]);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

/**
 * Vendors.js is a file used to bundle and expose all dependencies needed to run
 * the transpiled debugger modules when running in Firefox.
 *
 * To make transpilation easier, a vendored module should always be imported in
 * same way:
 * - always with destructuring (import { a } from "modA";)
 * - always without destructuring (import modB from "modB")
 *
 * Both are fine, but cannot be mixed for the same module.
 */
// Modules imported with destructuring
// $FlowIgnore
// Modules imported without destructuring
// We cannot directly export literals containing special characters
// (eg. "my-module/Test") which is why they are nested in "vendored".
// The keys of the vendored object should match the module names
// !!! Should remain synchronized with .babel/transform-mc.js !!!
const vendored = {
  classnames: _classnames.default,
  "devtools-components": devtoolsComponents,
  "devtools-config": devtoolsConfig,
  "devtools-contextmenu": devtoolsContextmenu,
  "devtools-environment": devtoolsEnvironment,
  "devtools-modules": devtoolsModules,
  "devtools-splitter": _devtoolsSplitter.default,
  "devtools-utils": devtoolsUtils,
  "fuzzaldrin-plus": fuzzaldrinPlus,
  "lodash-move": _lodashMove.default,
  "react-aria-components/src/tabs": reactAriaComponentsTabs,
  "react-transition-group/Transition": transition
};
exports.vendored = vendored;