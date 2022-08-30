"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
loader.lazyRequireGetter(this, "_connect", "devtools/client/debugger/src/utils/connect");

var _react = require("devtools/client/shared/vendor/react");

var _propTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_editor", "devtools/client/debugger/src/utils/editor/index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
class EmptyLines extends _react.Component {
  static get propTypes() {
    return {
      breakableLines: _propTypes.default.object.isRequired,
      editor: _propTypes.default.object.isRequired,
      selectedSource: _propTypes.default.object.isRequired
    };
  }

  componentDidMount() {
    this.disableEmptyLines();
  }

  componentDidUpdate() {
    this.disableEmptyLines();
  }

  componentWillUnmount() {
    const {
      editor
    } = this.props;
    editor.codeMirror.operation(() => {
      editor.codeMirror.eachLine(lineHandle => {
        editor.codeMirror.removeLineClass(lineHandle, "wrapClass", "empty-line");
      });
    });
  }

  shouldComponentUpdate(nextProps) {
    const {
      breakableLines,
      selectedSource
    } = this.props;
    return (// Breakable lines are something that evolves over time,
      // but we either have them loaded or not. So only compare the size
      // as sometimes we always get a blank new empty Set instance.
      breakableLines.size != nextProps.breakableLines.size || selectedSource.id != nextProps.selectedSource.id
    );
  }

  disableEmptyLines() {
    const {
      breakableLines,
      selectedSource,
      editor
    } = this.props;
    editor.codeMirror.operation(() => {
      editor.codeMirror.eachLine(lineHandle => {
        const line = (0, _editor.fromEditorLine)(selectedSource.id, editor.codeMirror.getLineNumber(lineHandle));

        if (breakableLines.has(line)) {
          editor.codeMirror.removeLineClass(lineHandle, "wrapClass", "empty-line");
        } else {
          editor.codeMirror.addLineClass(lineHandle, "wrapClass", "empty-line");
        }
      });
    });
  }

  render() {
    return null;
  }

}

const mapStateToProps = state => {
  const selectedSource = (0, _selectors.getSelectedSource)(state);

  if (!selectedSource) {
    throw new Error("no selectedSource");
  }

  const breakableLines = (0, _selectors.getSelectedBreakableLines)(state);
  return {
    selectedSource,
    breakableLines
  };
};

var _default = (0, _connect.connect)(mapStateToProps)(EmptyLines);

exports.default = _default;