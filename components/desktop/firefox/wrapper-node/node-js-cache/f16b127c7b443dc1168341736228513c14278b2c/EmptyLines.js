"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _connect = require("../../utils/connect");

var _react = require("devtools/client/shared/vendor/react");

var _selectors = require("../../selectors/index");

var _editor = require("../../utils/editor/index");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

class EmptyLines extends _react.Component {
  componentDidMount() {
    this.disableEmptyLines();
  }

  componentDidUpdate() {
    this.disableEmptyLines();
  }

  componentWillUnmount() {
    const { editor } = this.props;

    editor.codeMirror.operation(() => {
      editor.codeMirror.eachLine(lineHandle => {
        editor.codeMirror.removeLineClass(lineHandle, "line", "empty-line");
      });
    });
  }

  disableEmptyLines() {
    const { breakableLines, selectedSource, editor } = this.props;

    editor.codeMirror.operation(() => {
      editor.codeMirror.eachLine(lineHandle => {
        const line = (0, _editor.fromEditorLine)(selectedSource.id, editor.codeMirror.getLineNumber(lineHandle));

        if (breakableLines.has(line)) {
          editor.codeMirror.removeLineClass(lineHandle, "line", "empty-line");
        } else {
          editor.codeMirror.addLineClass(lineHandle, "line", "empty-line");
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

exports.default = (0, _connect.connect)(mapStateToProps)(EmptyLines);