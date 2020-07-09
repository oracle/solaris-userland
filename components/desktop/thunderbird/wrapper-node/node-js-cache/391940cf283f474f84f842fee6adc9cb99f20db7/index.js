"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var ast = _interopRequireWildcard(require("./ast/index"));

var breakpoints = _interopRequireWildcard(require("./breakpoints/index"));

var expressions = _interopRequireWildcard(require("./expressions"));

var eventListeners = _interopRequireWildcard(require("./event-listeners"));

var pause = _interopRequireWildcard(require("./pause/index"));

var navigation = _interopRequireWildcard(require("./navigation"));

var ui = _interopRequireWildcard(require("./ui"));

var fileSearch = _interopRequireWildcard(require("./file-search"));

var projectTextSearch = _interopRequireWildcard(require("./project-text-search"));

var quickOpen = _interopRequireWildcard(require("./quick-open"));

var sourceTree = _interopRequireWildcard(require("./source-tree"));

var sources = _interopRequireWildcard(require("./sources/index"));

var sourcesActors = _interopRequireWildcard(require("./source-actors"));

var tabs = _interopRequireWildcard(require("./tabs"));

var threads = _interopRequireWildcard(require("./threads"));

var toolbox = _interopRequireWildcard(require("./toolbox"));

var preview = _interopRequireWildcard(require("./preview"));

var _devtoolsReps = require("devtools/client/shared/components/reps/reps.js");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
// eslint-disable-next-line import/named
var _default = { ...ast,
  ...navigation,
  ...breakpoints,
  ...expressions,
  ...eventListeners,
  ...sources,
  ...sourcesActors,
  ...tabs,
  ...pause,
  ...ui,
  ...fileSearch,
  ..._devtoolsReps.objectInspector.actions,
  ...projectTextSearch,
  ...quickOpen,
  ...sourceTree,
  ...threads,
  ...toolbox,
  ...preview
};
exports.default = _default;