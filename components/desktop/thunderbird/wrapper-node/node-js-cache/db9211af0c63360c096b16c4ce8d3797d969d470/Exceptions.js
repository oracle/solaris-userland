"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = require("devtools/client/shared/vendor/react");

var _reactPropTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

var _reactRedux = require("devtools/client/shared/vendor/react-redux");

loader.lazyRequireGetter(this, "_constants", "devtools/client/debugger/src/constants");
loader.lazyRequireGetter(this, "_index", "devtools/client/debugger/src/selectors/index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
class Exceptions extends _react.Component {
  static get propTypes() {
    return {
      exceptions: _reactPropTypes.default.array,
      selectedSource: _reactPropTypes.default.object,
      editor: _reactPropTypes.default.object
    };
  }

  componentDidMount() {
    this.setMarkers();
  }

  componentDidUpdate(prevProps) {
    this.clearMarkers(prevProps);
    this.setMarkers();
  }

  componentWillUnmount() {
    this.clearMarkers();
  }

  clearMarkers(prevProps) {
    const {
      exceptions,
      selectedSource,
      editor
    } = this.props;

    if (!editor) {
      return;
    }

    if (!selectedSource || !exceptions.length || prevProps?.selectedSource !== selectedSource) {
      editor.removeLineContentMarker(_constants.markerTypes.LINE_EXCEPTION_MARKER);
      editor.removePositionContentMarker(_constants.markerTypes.EXCEPTION_POSITION_MARKER);
    }
  }

  setMarkers() {
    const {
      exceptions,
      selectedSource,
      editor
    } = this.props;

    if (!selectedSource || !editor || !exceptions.length) {
      return;
    }

    editor.setLineContentMarker({
      id: _constants.markerTypes.LINE_EXCEPTION_MARKER,
      lineClassName: "line-exception",
      lines: exceptions.map(e => ({
        line: e.lineNumber
      }))
    });
    editor.setPositionContentMarker({
      id: _constants.markerTypes.EXCEPTION_POSITION_MARKER,
      positionClassName: "mark-text-exception",
      positions: exceptions.map(e => ({
        line: e.lineNumber,
        // Exceptions are reported with column being 1-based
        // while the frontend uses 0-based column.
        column: e.columnNumber - 1
      }))
    });
  }

  render() {
    return null;
  }

}

var _default = (0, _reactRedux.connect)(state => {
  const selectedSource = (0, _index.getSelectedSource)(state); // Avoid calling getSelectedSourceExceptions when there is no source selected.

  if (!selectedSource) {
    return {};
  } // Avoid causing any update until we start having exceptions


  const exceptions = (0, _index.getSelectedSourceExceptions)(state);

  if (!exceptions.length) {
    return {};
  }

  return {
    exceptions: (0, _index.getSelectedSourceExceptions)(state),
    selectedSource
  };
})(Exceptions);

exports.default = _default;