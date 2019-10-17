"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("devtools/client/shared/vendor/react");

var _connect = require("../../utils/connect");

var _devtoolsContextmenu = require("devtools/client/debugger/dist/vendors").vendored["devtools-contextmenu"];

var _editor = require("../../utils/editor/index");

var _selectors = require("../../selectors/index");

var _editor2 = require("./menus/editor");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

class EditorMenu extends _react.Component {

  componentWillUpdate(nextProps) {
    this.props.clearContextMenu();
    if (nextProps.contextMenu) {
      this.showMenu(nextProps);
    }
  }

  showMenu(props) {
    const {
      cx,
      editor,
      selectedSourceWithContent,
      editorActions,
      hasPrettySource,
      isPaused,
      contextMenu: event
    } = props;

    const location = (0, _editor.getSourceLocationFromMouseEvent)(editor, selectedSourceWithContent.source,
    // Use a coercion, as contextMenu is optional
    event);

    (0, _devtoolsContextmenu.showMenu)(event, (0, _editor2.editorMenuItems)({
      cx,
      editorActions,
      selectedSourceWithContent,
      hasPrettySource,
      location,
      isPaused,
      selectionText: editor.codeMirror.getSelection().trim(),
      isTextSelected: editor.codeMirror.somethingSelected()
    }));
  }

  render() {
    return null;
  }
}

const mapStateToProps = (state, props) => ({
  cx: (0, _selectors.getThreadContext)(state),
  isPaused: (0, _selectors.getIsPaused)(state, (0, _selectors.getCurrentThread)(state)),
  hasPrettySource: !!(0, _selectors.getPrettySource)(state, props.selectedSourceWithContent.source.id)
});

const mapDispatchToProps = dispatch => ({
  editorActions: (0, _editor2.editorItemActions)(dispatch)
});

exports.default = (0, _connect.connect)(mapStateToProps, mapDispatchToProps)(EditorMenu);