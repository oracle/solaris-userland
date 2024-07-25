"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

var _reactPropTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

var _reactRedux = require("devtools/client/shared/vendor/react-redux");

loader.lazyRequireGetter(this, "_index", "devtools/client/debugger/src/utils/editor/index");
loader.lazyRequireGetter(this, "_location", "devtools/client/debugger/src/utils/location");
loader.lazyRequireGetter(this, "_prefs", "devtools/client/debugger/src/utils/prefs");

var _Exception = _interopRequireDefault(require("./Exception"));

loader.lazyRequireGetter(this, "_index2", "devtools/client/debugger/src/selectors/index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

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

  componentDidUpdate() {
    const {
      exceptions,
      selectedSource,
      editor
    } = this.props;

    if (!_prefs.features.codemirrorNext) {
      return;
    }

    if (!selectedSource || !editor || !exceptions.length) {
      editor.removeLineContentMarker("line-exception-marker");
      editor.removePositionContentMarker("exception-position-marker");
      return;
    }

    editor.setLineContentMarker({
      id: "line-exception-marker",
      lineClassName: "line-exception",
      condition: line => {
        const lineNumber = (0, _index.fromEditorLine)(selectedSource.id, line);
        const exception = exceptions.find(e => e.lineNumber == lineNumber);

        if (!exception) {
          return false;
        }

        const exceptionLocation = (0, _location.createLocation)({
          source: selectedSource,
          line: exception.lineNumber,
          // Exceptions are reported with column being 1-based
          // while the frontend uses 0-based column.
          column: exception.columnNumber - 1
        });
        const editorLocation = (0, _index.toEditorPosition)(exceptionLocation);
        return editorLocation.line == lineNumber;
      }
    });
    editor.setPositionContentMarker({
      id: "exception-position-marker",
      positionClassName: "mark-text-exception",
      positions: exceptions.map(e => ({
        line: e.lineNumber,
        column: e.columnNumber - 1
      }))
    });
  }

  render() {
    const {
      exceptions,
      selectedSource
    } = this.props;

    if (_prefs.features.codemirrorNext) {
      return null;
    }

    if (!selectedSource || !exceptions.length) {
      return null;
    }

    const doc = (0, _index.getDocument)(selectedSource.id);
    return _react.default.createElement(_react.default.Fragment, null, exceptions.map(exception => _react.default.createElement(_Exception.default, {
      exception,
      doc,
      key: `${exception.sourceActorId}:${exception.lineNumber}`,
      selectedSource
    })));
  }

}

var _default = (0, _reactRedux.connect)(state => {
  const selectedSource = (0, _index2.getSelectedSource)(state); // Avoid calling getSelectedSourceExceptions when there is no source selected.

  if (!selectedSource) {
    return {};
  } // Avoid causing any update until we start having exceptions


  const exceptions = (0, _index2.getSelectedSourceExceptions)(state);

  if (!exceptions.length) {
    return {};
  }

  return {
    exceptions: (0, _index2.getSelectedSourceExceptions)(state),
    selectedSource
  };
})(Exceptions);

exports.default = _default;