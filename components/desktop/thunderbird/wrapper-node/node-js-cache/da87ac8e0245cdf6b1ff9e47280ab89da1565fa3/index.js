"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _propTypes = require("devtools/client/shared/vendor/react-prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require("devtools/client/shared/vendor/react");

var _react2 = _interopRequireDefault(_react);

var _redux = require("devtools/client/shared/vendor/redux");

var _reactDom = require("devtools/client/shared/vendor/react-dom");

var _reactDom2 = _interopRequireDefault(_reactDom);

var _connect = require("../../utils/connect");

var _classnames = require("devtools/client/debugger/dist/vendors").vendored["classnames"];

var _classnames2 = _interopRequireDefault(_classnames);

var _lodash = require("devtools/client/shared/vendor/lodash");

var _devtoolsEnvironment = require("devtools/client/debugger/dist/vendors").vendored["devtools-environment"];

var _prefs = require("../../utils/prefs");

var _indentation = require("../../utils/indentation");

var _devtoolsContextmenu = require("devtools/client/debugger/dist/vendors").vendored["devtools-contextmenu"];

var _breakpoints = require("./menus/breakpoints");

var _editor = require("./menus/editor");

var _selectors = require("../../selectors/index");

var _actions = require("../../actions/index");

var _actions2 = _interopRequireDefault(_actions);

var _SearchBar = require("./SearchBar");

var _SearchBar2 = _interopRequireDefault(_SearchBar);

var _HighlightLines = require("./HighlightLines");

var _HighlightLines2 = _interopRequireDefault(_HighlightLines);

var _Preview = require("./Preview/index");

var _Preview2 = _interopRequireDefault(_Preview);

var _Breakpoints = require("./Breakpoints");

var _Breakpoints2 = _interopRequireDefault(_Breakpoints);

var _ColumnBreakpoints = require("./ColumnBreakpoints");

var _ColumnBreakpoints2 = _interopRequireDefault(_ColumnBreakpoints);

var _DebugLine = require("./DebugLine");

var _DebugLine2 = _interopRequireDefault(_DebugLine);

var _HighlightLine = require("./HighlightLine");

var _HighlightLine2 = _interopRequireDefault(_HighlightLine);

var _EmptyLines = require("./EmptyLines");

var _EmptyLines2 = _interopRequireDefault(_EmptyLines);

var _EditorMenu = require("./EditorMenu");

var _EditorMenu2 = _interopRequireDefault(_EditorMenu);

var _ConditionalPanel = require("./ConditionalPanel");

var _ConditionalPanel2 = _interopRequireDefault(_ConditionalPanel);

var _editor2 = require("../../utils/editor/index");

var _ui = require("../../utils/ui");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const cssVars = {
  searchbarHeight: "var(--editor-searchbar-height)"
};

// Redux actions
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

class Editor extends _react.PureComponent {
  constructor(props) {
    super(props);

    this.onClosePress = (key, e) => {
      const { cx, selectedSourceWithContent } = this.props;
      if (selectedSourceWithContent) {
        e.preventDefault();
        e.stopPropagation();
        this.props.closeTab(cx, selectedSourceWithContent.source);
      }
    };

    this.onToggleBreakpoint = (key, e) => {
      e.preventDefault();
      e.stopPropagation();

      const line = this.getCurrentLine();
      if (typeof line !== "number") {
        return;
      }

      this.props.toggleBreakpointAtLine(this.props.cx, line);
    };

    this.onToggleConditionalPanel = (key, e) => {
      e.stopPropagation();
      e.preventDefault();
      const line = this.getCurrentLine();

      if (typeof line !== "number") {
        return;
      }

      const isLog = key === L10N.getStr("toggleCondPanel.logPoint.key");
      this.toggleConditionalPanel(line, isLog);
    };

    this.onEditorScroll = (0, _lodash.throttle)(this.props.updateViewport, 100);

    this.onEscape = (key, e) => {
      if (!this.state.editor) {
        return;
      }

      const { codeMirror } = this.state.editor;
      if (codeMirror.listSelections().length > 1) {
        codeMirror.execCommand("singleSelection");
        e.preventDefault();
      }
    };

    this.clearContextMenu = () => {
      this.setState({ contextMenu: null });
    };

    this.onGutterClick = (cm, line, gutter, ev) => {
      const {
        cx,
        selectedSourceWithContent,
        conditionalPanelLocation,
        closeConditionalPanel,
        addBreakpointAtLine,
        continueToHere
      } = this.props;

      // ignore right clicks in the gutter
      if (ev.ctrlKey && ev.button === 0 || ev.button === 2 || selectedSourceWithContent && selectedSourceWithContent.source.isBlackBoxed || !selectedSourceWithContent) {
        return;
      }

      if (conditionalPanelLocation) {
        return closeConditionalPanel();
      }

      if (gutter === "CodeMirror-foldgutter") {
        return;
      }

      const sourceLine = (0, _editor2.toSourceLine)(selectedSourceWithContent.source.id, line);
      if (typeof sourceLine !== "number") {
        return;
      }

      if (ev.metaKey) {
        return continueToHere(cx, sourceLine);
      }

      return addBreakpointAtLine(cx, sourceLine, ev.altKey, ev.shiftKey);
    };

    this.onGutterContextMenu = event => {
      return this.openMenu(event);
    };

    this.toggleConditionalPanel = (line, log = false) => {
      const {
        conditionalPanelLocation,
        closeConditionalPanel,
        openConditionalPanel,
        selectedSourceWithContent
      } = this.props;

      if (conditionalPanelLocation) {
        return closeConditionalPanel();
      }

      if (!selectedSourceWithContent) {
        return;
      }

      return openConditionalPanel({
        line: line,
        sourceId: selectedSourceWithContent.source.id,
        sourceUrl: selectedSourceWithContent.source.url
      }, log);
    };

    this.state = {
      highlightedLineRange: null,
      editor: null,
      contextMenu: null
    };
  }

  componentWillReceiveProps(nextProps) {
    let editor = this.state.editor;

    if (!this.state.editor && nextProps.selectedSourceWithContent) {
      editor = this.setupEditor();
    }

    (0, _editor2.startOperation)();
    this.setText(nextProps, editor);
    this.setSize(nextProps, editor);
    this.scrollToLocation(nextProps, editor);
    (0, _editor2.endOperation)();

    if (this.props.selectedSourceWithContent != nextProps.selectedSourceWithContent) {
      this.props.updateViewport();
      (0, _ui.resizeBreakpointGutter)(editor.codeMirror);
      (0, _ui.resizeToggleButton)(editor.codeMirror);
    }
  }

  setupEditor() {
    const editor = (0, _editor2.getEditor)();

    // disables the default search shortcuts
    // $FlowIgnore
    editor._initShortcuts = () => {};

    const node = _reactDom2.default.findDOMNode(this);
    if (node instanceof HTMLElement) {
      editor.appendToLocalElement(node.querySelector(".editor-mount"));
    }

    const { codeMirror } = editor;
    const codeMirrorWrapper = codeMirror.getWrapperElement();

    codeMirror.on("gutterClick", this.onGutterClick);

    // Set code editor wrapper to be focusable
    codeMirrorWrapper.tabIndex = 0;
    codeMirrorWrapper.addEventListener("keydown", e => this.onKeyDown(e));
    codeMirrorWrapper.addEventListener("click", e => this.onClick(e));
    codeMirrorWrapper.addEventListener("mouseover", (0, _editor2.onMouseOver)(codeMirror));

    const toggleFoldMarkerVisibility = e => {
      if (node instanceof HTMLElement) {
        node.querySelectorAll(".CodeMirror-guttermarker-subtle").forEach(elem => {
          elem.classList.toggle("visible");
        });
      }
    };

    const codeMirrorGutter = codeMirror.getGutterElement();
    codeMirrorGutter.addEventListener("mouseleave", toggleFoldMarkerVisibility);
    codeMirrorGutter.addEventListener("mouseenter", toggleFoldMarkerVisibility);

    if (!(0, _devtoolsEnvironment.isFirefox)()) {
      codeMirror.on("gutterContextMenu", (cm, line, eventName, event) => this.onGutterContextMenu(event));
      codeMirror.on("contextmenu", (cm, event) => this.openMenu(event));
    } else {
      codeMirrorWrapper.addEventListener("contextmenu", event => this.openMenu(event));
    }

    codeMirror.on("scroll", this.onEditorScroll);
    this.onEditorScroll();
    this.setState({ editor });
    return editor;
  }

  componentDidMount() {
    const { shortcuts } = this.context;

    shortcuts.on(L10N.getStr("toggleBreakpoint.key"), this.onToggleBreakpoint);
    shortcuts.on(L10N.getStr("toggleCondPanel.breakpoint.key"), this.onToggleConditionalPanel);
    shortcuts.on(L10N.getStr("toggleCondPanel.logPoint.key"), this.onToggleConditionalPanel);
    shortcuts.on(L10N.getStr("sourceTabs.closeTab.key"), this.onClosePress);
    shortcuts.on("Esc", this.onEscape);
  }

  componentWillUnmount() {
    if (this.state.editor) {
      this.state.editor.destroy();
      this.state.editor.codeMirror.off("scroll", this.onEditorScroll);
      this.setState({ editor: null });
    }

    const shortcuts = this.context.shortcuts;
    shortcuts.off(L10N.getStr("sourceTabs.closeTab.key"));
    shortcuts.off(L10N.getStr("toggleBreakpoint.key"));
    shortcuts.off(L10N.getStr("toggleCondPanel.breakpoint.key"));
    shortcuts.off(L10N.getStr("toggleCondPanel.logPoint.key"));
  }

  getCurrentLine() {
    const { codeMirror } = this.state.editor;
    const { selectedSourceWithContent } = this.props;
    if (!selectedSourceWithContent) {
      return;
    }

    const line = (0, _editor2.getCursorLine)(codeMirror);
    return (0, _editor2.toSourceLine)(selectedSourceWithContent.source.id, line);
  }

  onKeyDown(e) {
    const { codeMirror } = this.state.editor;
    const { key, target } = e;
    const codeWrapper = codeMirror.getWrapperElement();
    const textArea = codeWrapper.querySelector("textArea");

    if (key === "Escape" && target == textArea) {
      e.stopPropagation();
      e.preventDefault();
      codeWrapper.focus();
    } else if (key === "Enter" && target == codeWrapper) {
      e.preventDefault();
      // Focus into editor's text area
      textArea.focus();
    }
  }

  /*
   * The default Esc command is overridden in the CodeMirror keymap to allow
   * the Esc keypress event to be catched by the toolbox and trigger the
   * split console. Restore it here, but preventDefault if and only if there
   * is a multiselection.
   */


  openMenu(event) {
    event.stopPropagation();
    event.preventDefault();

    const {
      cx,
      selectedSourceWithContent,
      breakpointActions,
      editorActions,
      isPaused
    } = this.props;
    const { editor } = this.state;
    if (!selectedSourceWithContent || !editor) {
      return;
    }

    const target = event.target;
    const { id: sourceId } = selectedSourceWithContent.source;
    const line = (0, _editor2.lineAtHeight)(editor, sourceId, event);

    if (typeof line != "number") {
      return;
    }

    const location = { line, column: undefined, sourceId };

    if (target.classList.contains("CodeMirror-linenumber")) {
      return (0, _devtoolsContextmenu.showMenu)(event, [...(0, _breakpoints.createBreakpointItems)(cx, location, breakpointActions), { type: "separator" }, (0, _editor.continueToHereItem)(cx, location, isPaused, editorActions)]);
    }

    if (target.getAttribute("id") === "columnmarker") {
      return;
    }

    this.setState({ contextMenu: event });
  }

  onClick(e) {
    const { cx, selectedSourceWithContent, jumpToMappedLocation } = this.props;

    if (selectedSourceWithContent && e.metaKey && e.altKey) {
      const sourceLocation = (0, _editor2.getSourceLocationFromMouseEvent)(this.state.editor, selectedSourceWithContent.source, e);
      jumpToMappedLocation(cx, sourceLocation);
    }
  }

  shouldScrollToLocation(nextProps, editor) {
    const { selectedLocation, selectedSourceWithContent } = this.props;
    if (!editor || !nextProps.selectedSourceWithContent || !nextProps.selectedLocation || !nextProps.selectedLocation.line || !nextProps.selectedSourceWithContent.content) {
      return false;
    }

    const isFirstLoad = (!selectedSourceWithContent || !selectedSourceWithContent.content) && nextProps.selectedSourceWithContent.content;
    const locationChanged = selectedLocation !== nextProps.selectedLocation;
    const symbolsChanged = nextProps.symbols != this.props.symbols;

    return isFirstLoad || locationChanged || symbolsChanged;
  }

  scrollToLocation(nextProps, editor) {
    const { selectedLocation, selectedSourceWithContent } = nextProps;

    if (selectedLocation && this.shouldScrollToLocation(nextProps, editor)) {
      let { line, column } = (0, _editor2.toEditorPosition)(selectedLocation);

      if (selectedSourceWithContent && (0, _editor2.hasDocument)(selectedSourceWithContent.source.id)) {
        const doc = (0, _editor2.getDocument)(selectedSourceWithContent.source.id);
        const lineText = doc.getLine(line);
        column = Math.max(column, (0, _indentation.getIndentation)(lineText));
      }

      (0, _editor2.scrollToColumn)(editor.codeMirror, line, column);
    }
  }

  setSize(nextProps, editor) {
    if (!editor) {
      return;
    }

    if (nextProps.startPanelSize !== this.props.startPanelSize || nextProps.endPanelSize !== this.props.endPanelSize) {
      editor.codeMirror.setSize();
    }
  }

  setText(props, editor) {
    const { selectedSourceWithContent, symbols } = props;

    if (!editor) {
      return;
    }

    // check if we previously had a selected source
    if (!selectedSourceWithContent) {
      return this.clearEditor();
    }

    if (!selectedSourceWithContent.content) {
      return (0, _editor2.showLoading)(editor);
    }

    if (selectedSourceWithContent.content.state === "rejected") {
      let { value } = selectedSourceWithContent.content;
      if (typeof value !== "string") {
        value = "Unexpected source error";
      }

      return this.showErrorMessage(value);
    }

    return (0, _editor2.showSourceText)(editor, selectedSourceWithContent.source, selectedSourceWithContent.content.value, symbols);
  }

  clearEditor() {
    const { editor } = this.state;
    if (!editor) {
      return;
    }

    (0, _editor2.clearEditor)(editor);
  }

  showErrorMessage(msg) {
    const { editor } = this.state;
    if (!editor) {
      return;
    }

    (0, _editor2.showErrorMessage)(editor, msg);
  }

  getInlineEditorStyles() {
    const { searchOn } = this.props;

    if (searchOn) {
      return {
        height: `calc(100% - ${cssVars.searchbarHeight})`
      };
    }

    return {
      height: "100%"
    };
  }

  renderItems() {
    const {
      cx,
      selectedSourceWithContent,
      conditionalPanelLocation
    } = this.props;
    const { editor, contextMenu } = this.state;

    if (!selectedSourceWithContent || !editor || !(0, _editor2.getDocument)(selectedSourceWithContent.source.id)) {
      return null;
    }

    return _react2.default.createElement(
      "div",
      null,
      _react2.default.createElement(_DebugLine2.default, { editor: editor }),
      _react2.default.createElement(_HighlightLine2.default, null),
      _react2.default.createElement(_EmptyLines2.default, { editor: editor }),
      _react2.default.createElement(_Breakpoints2.default, { editor: editor, cx: cx }),
      _react2.default.createElement(_Preview2.default, { editor: editor, editorRef: this.$editorWrapper }),
      _react2.default.createElement(_HighlightLines2.default, { editor: editor }),
      _react2.default.createElement(_EditorMenu2.default, {
        editor: editor,
        contextMenu: contextMenu,
        clearContextMenu: this.clearContextMenu,
        selectedSourceWithContent: selectedSourceWithContent
      }),
      conditionalPanelLocation ? _react2.default.createElement(_ConditionalPanel2.default, { editor: editor }) : null,
      _prefs.features.columnBreakpoints ? _react2.default.createElement(_ColumnBreakpoints2.default, { editor: editor }) : null
    );
  }

  renderSearchBar() {
    const { editor } = this.state;

    if (!this.props.selectedSourceWithContent) {
      return null;
    }

    return _react2.default.createElement(_SearchBar2.default, { editor: editor });
  }

  render() {
    const { selectedSourceWithContent, skipPausing } = this.props;
    return _react2.default.createElement(
      "div",
      {
        className: (0, _classnames2.default)("editor-wrapper", {
          blackboxed: selectedSourceWithContent && selectedSourceWithContent.source.isBlackBoxed,
          "skip-pausing": skipPausing
        }),
        ref: c => this.$editorWrapper = c
      },
      _react2.default.createElement("div", {
        className: "editor-mount devtools-monospace",
        style: this.getInlineEditorStyles()
      }),
      this.renderSearchBar(),
      this.renderItems()
    );
  }
}

Editor.contextTypes = {
  shortcuts: _propTypes2.default.object
};

const mapStateToProps = state => {
  const selectedSourceWithContent = (0, _selectors.getSelectedSourceWithContent)(state);

  return {
    cx: (0, _selectors.getThreadContext)(state),
    selectedLocation: (0, _selectors.getSelectedLocation)(state),
    selectedSourceWithContent,
    searchOn: (0, _selectors.getActiveSearch)(state) === "file",
    conditionalPanelLocation: (0, _selectors.getConditionalPanelLocation)(state),
    symbols: (0, _selectors.getSymbols)(state, selectedSourceWithContent ? selectedSourceWithContent.source : null),
    isPaused: (0, _selectors.getIsPaused)(state, (0, _selectors.getCurrentThread)(state)),
    skipPausing: (0, _selectors.getSkipPausing)(state)
  };
};

const mapDispatchToProps = dispatch => ({
  ...(0, _redux.bindActionCreators)({
    openConditionalPanel: _actions2.default.openConditionalPanel,
    closeConditionalPanel: _actions2.default.closeConditionalPanel,
    continueToHere: _actions2.default.continueToHere,
    toggleBreakpointAtLine: _actions2.default.toggleBreakpointAtLine,
    addBreakpointAtLine: _actions2.default.addBreakpointAtLine,
    jumpToMappedLocation: _actions2.default.jumpToMappedLocation,
    traverseResults: _actions2.default.traverseResults,
    updateViewport: _actions2.default.updateViewport,
    closeTab: _actions2.default.closeTab
  }, dispatch),
  breakpointActions: (0, _breakpoints.breakpointItemActions)(dispatch),
  editorActions: (0, _editor.editorItemActions)(dispatch)
});

exports.default = (0, _connect.connect)(mapStateToProps, mapDispatchToProps)(Editor);