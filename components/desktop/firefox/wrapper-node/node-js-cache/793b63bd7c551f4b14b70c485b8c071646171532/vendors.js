"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.vendored = undefined;

var _devtoolsComponents = require("devtools/client/debugger/dist/vendors").vendored["devtools-components"];

var devtoolsComponents = _interopRequireWildcard(_devtoolsComponents);

var _devtoolsConfig = require("devtools/client/debugger/dist/vendors").vendored["devtools-config"];

var devtoolsConfig = _interopRequireWildcard(_devtoolsConfig);

var _devtoolsContextmenu = require("devtools/client/debugger/dist/vendors").vendored["devtools-contextmenu"];

var devtoolsContextmenu = _interopRequireWildcard(_devtoolsContextmenu);

var _devtoolsEnvironment = require("devtools/client/debugger/dist/vendors").vendored["devtools-environment"];

var devtoolsEnvironment = _interopRequireWildcard(_devtoolsEnvironment);

var _devtoolsModules = require("devtools/client/debugger/dist/vendors").vendored["devtools-modules"];

var devtoolsModules = _interopRequireWildcard(_devtoolsModules);

var _devtoolsUtils = require("devtools/client/debugger/dist/vendors").vendored["devtools-utils"];

var devtoolsUtils = _interopRequireWildcard(_devtoolsUtils);

var _fuzzaldrinPlus = require("devtools/client/debugger/dist/vendors").vendored["fuzzaldrin-plus"];

var fuzzaldrinPlus = _interopRequireWildcard(_fuzzaldrinPlus);

var _Transition = require("devtools/client/debugger/dist/vendors").vendored["react-transition-group/Transition"];

var transition = _interopRequireWildcard(_Transition);

var _tabs = require("devtools/client/debugger/dist/vendors").vendored["react-aria-components/src/tabs"];

var reactAriaComponentsTabs = _interopRequireWildcard(_tabs);

var _reselect = require("devtools/client/debugger/dist/vendors").vendored["reselect"];

var reselect = _interopRequireWildcard(_reselect);

var _classnames = require("devtools/client/debugger/dist/vendors").vendored["classnames"];

var _classnames2 = _interopRequireDefault(_classnames);

var _devtoolsSplitter = require("devtools/client/debugger/dist/vendors").vendored["devtools-splitter"];

var _devtoolsSplitter2 = _interopRequireDefault(_devtoolsSplitter);

var _lodashMove = require("devtools/client/debugger/dist/vendors").vendored["lodash-move"];

var _lodashMove2 = _interopRequireDefault(_lodashMove);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// We cannot directly export literals containing special characters
// (eg. "my-module/Test") which is why they are nested in "vendored".
// The keys of the vendored object should match the module names
// !!! Should remain synchronized with .babel/transform-mc.js !!!

// $FlowIgnore
const vendored = exports.vendored = {
  classnames: _classnames2.default,
  "devtools-components": devtoolsComponents,
  "devtools-config": devtoolsConfig,
  "devtools-contextmenu": devtoolsContextmenu,
  "devtools-environment": devtoolsEnvironment,
  "devtools-modules": devtoolsModules,
  "devtools-splitter": _devtoolsSplitter2.default,
  "devtools-utils": devtoolsUtils,
  "fuzzaldrin-plus": fuzzaldrinPlus,
  "lodash-move": _lodashMove2.default,
  "react-aria-components/src/tabs": reactAriaComponentsTabs,
  "react-transition-group/Transition": transition,
  reselect
};

// Modules imported without destructuring
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