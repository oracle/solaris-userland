"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

var _Breakpoint = _interopRequireDefault(require("./Breakpoint"));

loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_breakpoint", "devtools/client/debugger/src/utils/breakpoint/index");
loader.lazyRequireGetter(this, "_connect", "devtools/client/debugger/src/utils/connect");
loader.lazyRequireGetter(this, "_breakpoints", "devtools/client/debugger/src/components/Editor/menus/breakpoints");
loader.lazyRequireGetter(this, "_editor", "devtools/client/debugger/src/components/Editor/menus/editor");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
class Breakpoints extends _react.Component {
  render() {
    const {
      cx,
      breakpoints,
      selectedSource,
      editor,
      breakpointActions,
      editorActions
    } = this.props;

    if (!selectedSource || !breakpoints || selectedSource.isBlackBoxed) {
      return null;
    }

    return _react.default.createElement("div", null, breakpoints.map(bp => {
      return _react.default.createElement(_Breakpoint.default, {
        cx: cx,
        key: (0, _breakpoint.makeBreakpointId)(bp.location),
        breakpoint: bp,
        selectedSource: selectedSource,
        editor: editor,
        breakpointActions: breakpointActions,
        editorActions: editorActions
      });
    }));
  }

}

var _default = (0, _connect.connect)(state => ({
  // Retrieves only the first breakpoint per line so that the
  // breakpoint marker represents only the first breakpoint
  breakpoints: (0, _selectors.getFirstVisibleBreakpoints)(state),
  selectedSource: (0, _selectors.getSelectedSource)(state)
}), dispatch => ({
  breakpointActions: (0, _breakpoints.breakpointItemActions)(dispatch),
  editorActions: (0, _editor.editorItemActions)(dispatch)
}))(Breakpoints);

exports.default = _default;