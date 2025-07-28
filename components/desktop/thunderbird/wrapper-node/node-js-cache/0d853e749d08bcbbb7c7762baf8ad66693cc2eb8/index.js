"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reactRedux = require("devtools/client/shared/vendor/react-redux");

loader.lazyRequireGetter(this, "_Frames", "devtools/client/debugger/src/components/SecondaryPanes/Frames/Frames");

var _index = _interopRequireDefault(require("../../../actions/index"));

loader.lazyRequireGetter(this, "_index2", "devtools/client/debugger/src/selectors/index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
// The React component is in a distinct module in order to prevent loading all Debugger actions and selectors
// when SmartTrace imports the Frames Component.
const mapStateToProps = state => ({
  frames: (0, _index2.getCurrentThreadFrames)(state),
  frameworkGroupingOn: (0, _index2.getFrameworkGroupingState)(state),
  selectedFrame: (0, _index2.getSelectedFrame)(state),
  isTracerFrameSelected: (0, _index2.getSelectedTraceIndex)(state) != null,
  shouldDisplayOriginalLocation: (0, _index2.getShouldSelectOriginalLocation)(state),
  disableFrameTruncate: false,
  disableContextMenu: false,
  displayFullUrl: false
});

var _default = (0, _reactRedux.connect)(mapStateToProps, {
  selectFrame: _index.default.selectFrame,
  showFrameContextMenu: _index.default.showFrameContextMenu
})(_Frames.Frames);

exports.default = _default;