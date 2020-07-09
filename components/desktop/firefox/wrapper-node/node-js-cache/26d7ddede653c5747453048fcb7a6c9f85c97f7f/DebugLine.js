"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.DebugLine = void 0;

var _react = require("devtools/client/shared/vendor/react");

loader.lazyRequireGetter(this, "_editor", "devtools/client/debugger/src/utils/editor/index");
loader.lazyRequireGetter(this, "_pause", "devtools/client/debugger/src/utils/pause/index");
loader.lazyRequireGetter(this, "_indentation", "devtools/client/debugger/src/utils/indentation");
loader.lazyRequireGetter(this, "_connect", "devtools/client/debugger/src/utils/connect");
loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
function isDocumentReady(source, location) {
  return location && source && source.content && (0, _editor.hasDocument)(location.sourceId);
}

class DebugLine extends _react.PureComponent {
  componentDidMount() {
    const {
      why,
      location,
      source
    } = this.props;
    this.setDebugLine(why, location, source);
  }

  componentWillUnmount() {
    const {
      why,
      location,
      source
    } = this.props;
    this.clearDebugLine(why, location, source);
  }

  componentDidUpdate(prevProps) {
    const {
      why,
      location,
      source
    } = this.props;
    (0, _editor.startOperation)();
    this.clearDebugLine(prevProps.why, prevProps.location, prevProps.source);
    this.setDebugLine(why, location, source);
    (0, _editor.endOperation)();
  }

  setDebugLine(why, location, source) {
    if (!location || !isDocumentReady(source, location)) {
      return;
    }

    const {
      sourceId
    } = location;
    const doc = (0, _editor.getDocument)(sourceId);
    let {
      line,
      column
    } = (0, _editor.toEditorPosition)(location);
    let {
      markTextClass,
      lineClass
    } = this.getTextClasses(why);
    doc.addLineClass(line, "wrapClass", lineClass);
    const lineText = doc.getLine(line);
    column = Math.max(column, (0, _indentation.getIndentation)(lineText)); // If component updates because user clicks on
    // another source tab, codeMirror will be null.

    const columnEnd = doc.cm ? (0, _editor.getTokenEnd)(doc.cm, line, column) : null;

    if (columnEnd === null) {
      markTextClass += " to-line-end";
    }

    this.debugExpression = doc.markText({
      ch: column,
      line
    }, {
      ch: columnEnd,
      line
    }, {
      className: markTextClass
    });
  }

  clearDebugLine(why, location, source) {
    if (!location || !isDocumentReady(source, location)) {
      return;
    }

    if (this.debugExpression) {
      this.debugExpression.clear();
    }

    const {
      line
    } = (0, _editor.toEditorPosition)(location);
    const doc = (0, _editor.getDocument)(location.sourceId);
    const {
      lineClass
    } = this.getTextClasses(why);
    doc.removeLineClass(line, "wrapClass", lineClass);
  }

  getTextClasses(why) {
    if (why && (0, _pause.isException)(why)) {
      return {
        markTextClass: "debug-expression-error",
        lineClass: "new-debug-line-error"
      };
    }

    return {
      markTextClass: "debug-expression",
      lineClass: "new-debug-line"
    };
  }

  render() {
    return null;
  }

}

exports.DebugLine = DebugLine;

const mapStateToProps = state => {
  const frame = (0, _selectors.getVisibleSelectedFrame)(state);
  const previewLocation = (0, _selectors.getPausePreviewLocation)(state);
  const location = previewLocation || (frame === null || frame === void 0 ? void 0 : frame.location);
  return {
    frame,
    location,
    source: location && (0, _selectors.getSourceWithContent)(state, location.sourceId),
    why: (0, _selectors.getPauseReason)(state, (0, _selectors.getCurrentThread)(state))
  };
};

var _default = (0, _connect.connect)(mapStateToProps)(DebugLine);

exports.default = _default;