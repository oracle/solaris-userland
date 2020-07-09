"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = require("devtools/client/shared/vendor/react");

loader.lazyRequireGetter(this, "_connect", "devtools/client/debugger/src/utils/connect");

var _devtoolsContextmenu = require("devtools/client/debugger/dist/vendors").vendored["devtools-contextmenu"];

loader.lazyRequireGetter(this, "_editor", "devtools/client/debugger/src/utils/editor/index");
loader.lazyRequireGetter(this, "_source", "devtools/client/debugger/src/utils/source");
loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_editor2", "devtools/client/debugger/src/components/Editor/menus/editor");

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
      selectedSource,
      editorActions,
      hasMappedLocation,
      isPaused,
      contextMenu: event
    } = props;
    const location = (0, _editor.getSourceLocationFromMouseEvent)(editor, selectedSource, // Use a coercion, as contextMenu is optional
    event);
    (0, _devtoolsContextmenu.showMenu)(event, (0, _editor2.editorMenuItems)({
      cx,
      editorActions,
      selectedSource,
      hasMappedLocation,
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
  hasMappedLocation: (props.selectedSource.isOriginal || (0, _selectors.isSourceWithMap)(state, props.selectedSource.id) || (0, _source.isPretty)(props.selectedSource)) && !(0, _selectors.getPrettySource)(state, props.selectedSource.id)
});

const mapDispatchToProps = dispatch => ({
  editorActions: (0, _editor2.editorItemActions)(dispatch)
});

var _default = (0, _connect.connect)(mapStateToProps, mapDispatchToProps)(EditorMenu);

exports.default = _default;