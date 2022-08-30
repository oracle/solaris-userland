"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
loader.lazyRequireGetter(this, "_connect", "devtools/client/debugger/src/utils/connect");

var _propTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

var _react = require("devtools/client/shared/vendor/react");

loader.lazyRequireGetter(this, "_editor", "devtools/client/debugger/src/utils/editor/index");
loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
// This renders blackbox line highlighting in the editor
class BlackboxLines extends _react.Component {
  static get propTypes() {
    return {
      editor: _propTypes.default.object,
      selectedSource: _propTypes.default.object,
      blackboxedRanges: _propTypes.default.object
    };
  }

  componentDidMount() {
    const {
      selectedSource,
      blackboxedRanges,
      editor
    } = this.props;
    const ranges = blackboxedRanges[selectedSource.url];

    if (!selectedSource.isBlackBoxed && !ranges) {
      return;
    }

    if (ranges) {
      if (!ranges.length) {
        // The whole source was blackboxed
        this.setAllBlackboxLines(editor);
      } else {
        editor.codeMirror.operation(() => {
          ranges.forEach(range => {
            const start = (0, _editor.toEditorLine)(selectedSource.id, range.start.line);
            const end = (0, _editor.toEditorLine)(selectedSource.id, range.end.line);
            editor.codeMirror.eachLine(start, end, lineHandle => {
              this.setBlackboxLine(editor, lineHandle);
            });
          });
        });
      }
    }
  }

  componentDidUpdate() {
    const {
      selectedSource,
      blackboxedRanges,
      editor
    } = this.props;
    const ranges = blackboxedRanges[selectedSource.url]; // when unblackboxed

    if (!ranges) {
      this.clearAllBlackboxLines(editor);
      return;
    } // When the whole source is blackboxed


    if (!ranges.length) {
      this.setAllBlackboxLines(editor);
      return;
    } // TODO: Possible perf improvement. Instead of going
    // over all the lines each time get diffs of what has
    // changed and update those.


    editor.codeMirror.operation(() => {
      editor.codeMirror.eachLine(lineHandle => {
        const line = (0, _editor.fromEditorLine)(selectedSource.id, editor.codeMirror.getLineNumber(lineHandle));

        if (this.isLineBlackboxed(ranges, line)) {
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

  isLineBlackboxed(ranges, line) {
    return !!ranges.find(range => line >= range.start.line && line <= range.end.line);
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
    editor.codeMirror.removeLineClass(lineHandle, "wrapClass", "blackboxed-line");
  }

  setBlackboxLine(editor, lineHandle) {
    editor.codeMirror.addLineClass(lineHandle, "wrapClass", "blackboxed-line");
  }

  render() {
    return null;
  }

}

const mapStateToProps = state => {
  return {
    blackboxedRanges: (0, _selectors.getBlackBoxRanges)(state),
    selectedSource: (0, _selectors.getSelectedSource)(state)
  };
};

var _default = (0, _connect.connect)(mapStateToProps)(BlackboxLines);

exports.default = _default;