"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _propTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

var _react = require("devtools/client/shared/vendor/react");

loader.lazyRequireGetter(this, "_editor", "devtools/client/debugger/src/utils/editor/index");
loader.lazyRequireGetter(this, "_source", "devtools/client/debugger/src/utils/source");
loader.lazyRequireGetter(this, "_wasm", "devtools/client/debugger/src/utils/wasm");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
// This renders blackbox line highlighting in the editor
class BlackboxLines extends _react.Component {
  static get propTypes() {
    return {
      editor: _propTypes.default.object.isRequired,
      selectedSource: _propTypes.default.object.isRequired,
      blackboxedRangesForSelectedSource: _propTypes.default.array,
      isSourceOnIgnoreList: _propTypes.default.bool
    };
  }

  componentDidMount() {
    const {
      selectedSource,
      blackboxedRangesForSelectedSource,
      editor
    } = this.props;

    if (this.props.isSourceOnIgnoreList) {
      this.setAllBlackboxLines(editor);
      return;
    } // When `blackboxedRangesForSelectedSource` is defined and the array is empty,
    // the whole source was blackboxed.


    if (!blackboxedRangesForSelectedSource.length) {
      this.setAllBlackboxLines(editor);
    } else {
      editor.codeMirror.operation(() => {
        blackboxedRangesForSelectedSource.forEach(range => {
          const start = (0, _editor.toEditorLine)(selectedSource.id, range.start.line);
          const end = (0, _editor.toEditorLine)(selectedSource.id, range.end.line);
          editor.codeMirror.eachLine(start, end, lineHandle => {
            this.setBlackboxLine(editor, lineHandle);
          });
        });
      });
    }
  }

  componentDidUpdate() {
    const {
      selectedSource,
      blackboxedRangesForSelectedSource,
      editor,
      isSourceOnIgnoreList
    } = this.props;

    if (this.props.isSourceOnIgnoreList) {
      this.setAllBlackboxLines(editor);
      return;
    } // when unblackboxed


    if (!blackboxedRangesForSelectedSource) {
      this.clearAllBlackboxLines(editor);
      return;
    } // When the whole source is blackboxed


    if (!blackboxedRangesForSelectedSource.length) {
      this.setAllBlackboxLines(editor);
      return;
    }

    const sourceIsWasm = (0, _wasm.isWasm)(selectedSource.id); // TODO: Possible perf improvement. Instead of going
    // over all the lines each time get diffs of what has
    // changed and update those.

    editor.codeMirror.operation(() => {
      editor.codeMirror.eachLine(lineHandle => {
        const line = (0, _editor.fromEditorLine)(selectedSource.id, editor.codeMirror.getLineNumber(lineHandle), sourceIsWasm);

        if ((0, _source.isLineBlackboxed)(blackboxedRangesForSelectedSource, line, isSourceOnIgnoreList)) {
          this.setBlackboxLine(editor, lineHandle);
        } else {
          this.clearBlackboxLine(editor, lineHandle);
        }
      });
    });
  }

  componentWillUnmount() {
    // Lets make sure we remove everything  relating to
    // blackboxing lines when this component is unmounted.
    this.clearAllBlackboxLines(this.props.editor);
  }

  clearAllBlackboxLines(editor) {
    editor.codeMirror.operation(() => {
      editor.codeMirror.eachLine(lineHandle => {
        this.clearBlackboxLine(editor, lineHandle);
      });
    });
  }

  setAllBlackboxLines(editor) {
    //TODO:We might be able to handle the whole source
    // than adding the blackboxing line by line
    editor.codeMirror.operation(() => {
      editor.codeMirror.eachLine(lineHandle => {
        this.setBlackboxLine(editor, lineHandle);
      });
    });
  }

  clearBlackboxLine(editor, lineHandle) {
    editor.codeMirror.removeLineClass(lineHandle, "wrap", "blackboxed-line");
  }

  setBlackboxLine(editor, lineHandle) {
    editor.codeMirror.addLineClass(lineHandle, "wrap", "blackboxed-line");
  }

  render() {
    return null;
  }

}

var _default = BlackboxLines;
exports.default = _default;