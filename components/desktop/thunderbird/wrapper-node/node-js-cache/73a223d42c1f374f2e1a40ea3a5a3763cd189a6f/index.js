"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _expressions = _interopRequireDefault(require("./expressions"));

var _sourceActors = _interopRequireDefault(require("./source-actors"));

var _sources = _interopRequireDefault(require("./sources"));

var _tabs = _interopRequireDefault(require("./tabs"));

var _breakpoints = _interopRequireDefault(require("./breakpoints"));

var _pendingBreakpoints = _interopRequireDefault(require("./pending-breakpoints"));

var _asyncRequests = _interopRequireDefault(require("./async-requests"));

var _pause = _interopRequireDefault(require("./pause"));

var _ui = _interopRequireDefault(require("./ui"));

var _fileSearch = _interopRequireDefault(require("./file-search"));

var _ast = _interopRequireDefault(require("./ast"));

var _preview = _interopRequireDefault(require("./preview"));

var _projectTextSearch = _interopRequireDefault(require("./project-text-search"));

var _quickOpen = _interopRequireDefault(require("./quick-open"));

var _sourceTree = _interopRequireDefault(require("./source-tree"));

var _threads = _interopRequireDefault(require("./threads"));

var _eventListeners = _interopRequireDefault(require("./event-listeners"));

var _devtoolsReps = require("devtools/client/shared/components/reps/reps.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

/**
 * Reducer index
 * @module reducers/index
 */
// eslint-disable-next-line import/named
var _default = {
  expressions: _expressions.default,
  sourceActors: _sourceActors.default,
  sources: _sources.default,
  tabs: _tabs.default,
  breakpoints: _breakpoints.default,
  pendingBreakpoints: _pendingBreakpoints.default,
  asyncRequests: _asyncRequests.default,
  pause: _pause.default,
  ui: _ui.default,
  fileSearch: _fileSearch.default,
  ast: _ast.default,
  projectTextSearch: _projectTextSearch.default,
  quickOpen: _quickOpen.default,
  sourceTree: _sourceTree.default,
  threads: _threads.default,
  objectInspector: _devtoolsReps.objectInspector.reducer.default,
  eventListenerBreakpoints: _eventListeners.default,
  preview: _preview.default
};
exports.default = _default;