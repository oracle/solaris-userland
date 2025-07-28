"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reactPropTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

var _reactDomFactories = require("devtools/client/shared/vendor/react-dom-factories");

var _redux = require("devtools/client/shared/vendor/redux");

var _reactDom = _interopRequireDefault(require("devtools/client/shared/vendor/react-dom"));

var _reactRedux = require("devtools/client/shared/vendor/react-redux");

loader.lazyRequireGetter(this, "_source", "devtools/client/debugger/src/utils/source");
loader.lazyRequireGetter(this, "_location", "devtools/client/debugger/src/utils/location");
loader.lazyRequireGetter(this, "_constants", "devtools/client/debugger/src/constants");
loader.lazyRequireGetter(this, "_asyncValue", "devtools/client/debugger/src/utils/async-value");
loader.lazyRequireGetter(this, "_index", "devtools/client/debugger/src/selectors/index");

var _index2 = _interopRequireDefault(require("../../actions/index"));

var _SearchInFileBar = _interopRequireDefault(require("./SearchInFileBar"));

var _HighlightLines = _interopRequireDefault(require("./HighlightLines"));

var _index3 = _interopRequireDefault(require("./Preview/index"));

var _Breakpoints = _interopRequireDefault(require("./Breakpoints"));

var _ColumnBreakpoints = _interopRequireDefault(require("./ColumnBreakpoints"));

var _DebugLine = _interopRequireDefault(require("./DebugLine"));

var _HighlightLine = _interopRequireDefault(require("./HighlightLine"));

var _ConditionalPanel = _interopRequireDefault(require("./ConditionalPanel"));

var _InlinePreviews = _interopRequireDefault(require("./InlinePreviews"));

var _Exceptions = _interopRequireDefault(require("./Exceptions"));

loader.lazyRequireGetter(this, "_index4", "devtools/client/debugger/src/utils/editor/index");
loader.lazyRequireGetter(this, "_ui", "devtools/client/debugger/src/utils/ui");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const {
  debounce
} = require("resource://devtools/shared/debounce.js");

const classnames = require("resource://devtools/client/shared/classnames.js");

const {
  appinfo
} = Services;
const isMacOS = appinfo.OS === "Darwin";

function isSecondary(ev) {
  return isMacOS && ev.ctrlKey && ev.button === 0;
}

function isCmd(ev) {
  return isMacOS ? ev.metaKey : ev.ctrlKey;
}

const cssVars = {
  searchbarHeight: "var(--editor-searchbar-height)"
};

class Editor extends _react.PureComponent {
  static get propTypes() {
    return {
      selectedSource: _reactPropTypes.default.object,
      selectedSourceTextContent: _reactPropTypes.default.object,
      selectedSourceIsBlackBoxed: _reactPropTypes.default.bool,
      closeTab: _reactPropTypes.default.func.isRequired,
      toggleBreakpointAtLine: _reactPropTypes.default.func.isRequired,
      conditionalPanelLocation: _reactPropTypes.default.object,
      closeConditionalPanel: _reactPropTypes.default.func.isRequired,
      openConditionalPanel: _reactPropTypes.default.func.isRequired,
      updateViewport: _reactPropTypes.default.func.isRequired,
      isPaused: _reactPropTypes.default.bool.isRequired,
      addBreakpointAtLine: _reactPropTypes.default.func.isRequired,
      continueToHere: _reactPropTypes.default.func.isRequired,
      updateCursorPosition: _reactPropTypes.default.func.isRequired,
      jumpToMappedLocation: _reactPropTypes.default.func.isRequired,
      selectedLocation: _reactPropTypes.default.object,
      startPanelSize: _reactPropTypes.default.number.isRequired,
      endPanelSize: _reactPropTypes.default.number.isRequired,
      searchInFileEnabled: _reactPropTypes.default.bool.isRequired,
      inlinePreviewEnabled: _reactPropTypes.default.bool.isRequired,
      skipPausing: _reactPropTypes.default.bool.isRequired,
      blackboxedRanges: _reactPropTypes.default.object.isRequired,
      breakableLines: _reactPropTypes.default.object.isRequired,
      highlightedLineRange: _reactPropTypes.default.object,
      isSourceOnIgnoreList: _reactPropTypes.default.bool,
      isOriginalSourceAndMapScopesEnabled: _reactPropTypes.default.bool,
      shouldScrollToSelectedLocation: _reactPropTypes.default.bool,
      setInScopeLines: _reactPropTypes.default.func
    };
  }

  constructor(props) {
    super(props);

    _defineProperty(this, "$editorWrapper", void 0);

    _defineProperty(this, "onEditorUpdated", viewUpdate => {
      if (viewUpdate.docChanged || viewUpdate.geometryChanged) {
        (0, _ui.resizeToggleButton)(viewUpdate.view.dom.querySelector(".cm-gutters").clientWidth);
        this.props.updateViewport();
      } else if (viewUpdate.selectionSet) {
        this.onCursorChange();
      }
    });

    _defineProperty(this, "onCloseShortcutPress", e => {
      const {
        selectedSource
      } = this.props;

      if (selectedSource) {
        e.preventDefault();
        e.stopPropagation();
        this.props.closeTab(selectedSource, "shortcut");
      }
    });

    _defineProperty(this, "onToggleBreakpoint", e => {
      e.preventDefault();
      e.stopPropagation();
      const currentPosition = this.getCurrentPosition();

      if (!currentPosition || typeof currentPosition.line !== "number") {
        return;
      }

      this.props.toggleBreakpointAtLine(currentPosition.line);
    });

    _defineProperty(this, "onToggleLogPanel", e => {
      e.stopPropagation();
      e.preventDefault();
      this.toggleBreakpointPanel(true);
    });

    _defineProperty(this, "onToggleConditionalPanel", e => {
      e.stopPropagation();
      e.preventDefault();
      this.toggleBreakpointPanel(false);
    });

    _defineProperty(this, "onEditorScroll", debounce(this.props.updateViewport, 75));

    _defineProperty(this, "onCursorChange", () => {
      const {
        editor
      } = this.state;

      if (!editor || !this.props.selectedSource) {
        return;
      }

      const selectionCursor = editor.getSelectionCursor();
      const {
        line,
        ch
      } = selectionCursor.to;
      this.props.selectLocation((0, _location.createLocation)({
        source: this.props.selectedSource,
        line: (0, _index4.toSourceLine)(this.props.selectedSource, line),
        column: ch
      }), {
        // Reset the context, so that we don't switch to original
        // while moving the cursor within a bundle
        keepContext: false,
        // Avoid highlighting the selected line
        highlight: false,
        // Avoid scrolling to the selected line, it's already visible
        scroll: false
      });
    });

    _defineProperty(this, "onGutterClick", (cm, line, gutter, ev) => {
      const {
        selectedSource,
        conditionalPanelLocation,
        closeConditionalPanel,
        addBreakpointAtLine,
        continueToHere,
        breakableLines,
        blackboxedRanges,
        isSourceOnIgnoreList
      } = this.props; // ignore right clicks in the gutter

      if (isSecondary(ev) || ev.button === 2 || !selectedSource) {
        return;
      }

      if (conditionalPanelLocation) {
        closeConditionalPanel();
        return;
      }

      if (gutter === "CodeMirror-foldgutter") {
        return;
      }

      const sourceLine = (0, _index4.toSourceLine)(selectedSource, line);

      if (typeof sourceLine !== "number") {
        return;
      } // ignore clicks on a non-breakable line


      if (!breakableLines.has(sourceLine)) {
        return;
      }

      if (isCmd(ev)) {
        continueToHere((0, _location.createLocation)({
          line: sourceLine,
          column: undefined,
          source: selectedSource
        }));
        return;
      }

      addBreakpointAtLine(sourceLine, ev.altKey, ev.shiftKey || (0, _source.isLineBlackboxed)(blackboxedRanges[selectedSource.url], sourceLine, isSourceOnIgnoreList));
    });

    this.state = {
      editor: null
    };
  } // FIXME: https://bugzilla.mozilla.org/show_bug.cgi?id=1774507


  UNSAFE_componentWillReceiveProps(nextProps) {
    let {
      editor
    } = this.state;
    const prevEditor = editor;

    if (!editor) {
      // See Bug 1913061
      if (!nextProps.selectedSource) {
        return;
      }

      editor = this.setupEditor();
    }

    this.setTextContent(nextProps, editor, prevEditor);
  }

  async setTextContent(nextProps, editor, prevEditor) {
    const shouldUpdateText = nextProps.selectedSource !== this.props.selectedSource || nextProps.selectedSourceTextContent?.value !== this.props.selectedSourceTextContent?.value || // If the selectedSource gets set before the editor get selected, make sure we update the text
    prevEditor !== editor;
    const shouldScroll = nextProps.selectedLocation && nextProps.shouldScrollToSelectedLocation && this.shouldScrollToLocation(nextProps);

    if (shouldUpdateText) {
      await this.setText(nextProps, editor);
    }

    if (shouldScroll) {
      await this.scrollToLocation(nextProps, editor);
    } // Note: Its important to get the scope lines after
    // the scrolling is complete to make sure codemirror
    // has loaded the content for the current viewport.
    //
    // Also if scope mapping is on, the babel parser worker
    // will be used instead (for scope mapping) as the preview data relies
    // on it for original variable mapping.


    if (nextProps.isPaused && !nextProps.isOriginalSourceAndMapScopesEnabled) {
      this.props.setInScopeLines(editor);
    }
  }

  setupEditor() {
    const editor = (0, _index4.getEditor)(); // disables the default search shortcuts

    editor._initShortcuts = () => {};

    const node = _reactDom.default.findDOMNode(this);

    const mountEl = node.querySelector(".editor-mount");

    if (node instanceof HTMLElement) {
      editor.appendToLocalElement(mountEl);
    }

    editor.setUpdateListener(this.onEditorUpdated);
    editor.setGutterEventListeners({
      click: (event, cm, line) => {
        // Ignore clicks on the code folding button
        if (event.target.className.includes("cm6-dt-foldgutter__toggle-button")) {
          return;
        } // Clicking any where on the fold gutter (except on a code folding button)
        // should toggle the breakpoint for this line, if possible.


        if (event.target.className.includes("cm-foldGutter")) {
          this.props.toggleBreakpointAtLine(line);
          return;
        }

        this.onGutterClick(cm, line, null, event);
      },
      contextmenu: (event, cm, line) => this.openMenu(event, line)
    });
    editor.addEditorDOMEventListeners({
      click: (event, cm, line, column) => this.onClick(event, line, column),
      contextmenu: (event, cm, line, column) => this.openMenu(event, line, column),
      mouseover: (0, _index4.onMouseOver)(editor)
    });
    this.setState({
      editor
    }); // Used for tests

    Object.defineProperty(window, "codeMirrorSourceEditorTestInstance", {
      get() {
        return editor;
      }

    });
    return editor;
  }

  componentDidMount() {
    const {
      shortcuts
    } = this.context;
    shortcuts.on(L10N.getStr("toggleBreakpoint.key"), this.onToggleBreakpoint);
    shortcuts.on(L10N.getStr("toggleCondPanel.breakpoint.key"), this.onToggleConditionalPanel);
    shortcuts.on(L10N.getStr("toggleCondPanel.logPoint.key"), this.onToggleLogPanel);
    shortcuts.on(L10N.getStr("sourceTabs.closeTab.key"), this.onCloseShortcutPress);
    shortcuts.on("Esc", this.onEscape);
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      selectedSource,
      blackboxedRanges,
      isSourceOnIgnoreList,
      breakableLines
    } = this.props;
    const {
      editor
    } = this.state;

    if (!selectedSource || !editor) {
      return;
    }

    const shouldUpdateBreakableLines = prevProps.breakableLines.size !== this.props.breakableLines.size || prevProps.selectedSource?.id !== selectedSource.id || // Make sure we update after the editor has loaded
    !prevState.editor && !!editor;

    if (shouldUpdateBreakableLines) {
      editor.setLineGutterMarkers([{
        id: _constants.markerTypes.EMPTY_LINE_MARKER,
        lineClassName: "empty-line",
        condition: line => {
          const lineNumber = (0, _index4.fromEditorLine)(selectedSource, line);
          return !breakableLines.has(lineNumber);
        }
      }]);
    }

    editor.setLineGutterMarkers([{
      id: _constants.markerTypes.BLACKBOX_LINE_GUTTER_MARKER,
      lineClassName: "blackboxed-line",
      condition: line => {
        const lineNumber = (0, _index4.fromEditorLine)(selectedSource, line);
        return (0, _source.isLineBlackboxed)(blackboxedRanges[selectedSource.url], lineNumber, isSourceOnIgnoreList);
      }
    }]);

    if (prevProps.selectedSource?.id !== selectedSource.id || prevProps.blackboxedRanges[selectedSource.url]?.length !== blackboxedRanges[selectedSource.url]?.length || !prevState.editor && !!editor) {
      if (blackboxedRanges[selectedSource.url] == undefined) {
        editor.removeLineContentMarker(_constants.markerTypes.BLACKBOX_LINE_MARKER);
        return;
      }

      const lines = [];

      for (const range of blackboxedRanges[selectedSource.url]) {
        for (let line = range.start.line; line <= range.end.line; line++) {
          lines.push({
            line
          });
        }
      }

      editor.setLineContentMarker({
        id: _constants.markerTypes.BLACKBOX_LINE_MARKER,
        lineClassName: "blackboxed-line",
        // If the the whole source is blackboxed, lets just mark all positions.
        shouldMarkAllLines: !blackboxedRanges[selectedSource.url].length,
        lines
      });
    }
  }

  componentWillUnmount() {
    const {
      editor
    } = this.state;
    const {
      shortcuts
    } = this.context;
    shortcuts.off(L10N.getStr("sourceTabs.closeTab.key"));
    shortcuts.off(L10N.getStr("toggleBreakpoint.key"));
    shortcuts.off(L10N.getStr("toggleCondPanel.breakpoint.key"));
    shortcuts.off(L10N.getStr("toggleCondPanel.logPoint.key"));

    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }

    if (editor) {
      editor.destroy();
      this.setState({
        editor: null
      });
      (0, _index4.removeEditor)();
    }
  }

  getCurrentPosition() {
    const {
      editor
    } = this.state;
    const {
      selectedLocation
    } = this.props;

    if (!selectedLocation) {
      return null;
    }

    let {
      line,
      column
    } = selectedLocation; // When no specific line has been selected, fallback to the current cursor posiiton

    if (line == 0) {
      const selectionCursor = editor.getSelectionCursor();
      line = (0, _index4.toSourceLine)(selectedLocation.source, selectionCursor.from.line);
      column = selectionCursor.from.ch + 1;
    }

    return {
      line,
      column
    };
  }

  toggleBreakpointPanel(logPanel) {
    const {
      conditionalPanelLocation,
      closeConditionalPanel,
      openConditionalPanel,
      selectedSource
    } = this.props;
    const currentPosition = this.getCurrentPosition();

    if (conditionalPanelLocation) {
      return closeConditionalPanel();
    }

    if (!selectedSource || typeof currentPosition?.line !== "number") {
      return null;
    }

    return openConditionalPanel((0, _location.createLocation)({
      line: currentPosition.line,
      column: currentPosition.column,
      source: selectedSource
    }), logPanel);
  }

  /*
   * The default Esc command is overridden in the CodeMirror keymap to allow
   * the Esc keypress event to be catched by the toolbox and trigger the
   * split console. Restore it here, but preventDefault if and only if there
   * is a multiselection.
   */
  onEscape() {} // Note: The line is optional, if not passed it fallsback to lineAtHeight.


  openMenu(event, line, ch) {
    event.stopPropagation();
    event.preventDefault();
    const {
      selectedSource,
      selectedSourceTextContent,
      conditionalPanelLocation,
      closeConditionalPanel
    } = this.props;
    const {
      editor
    } = this.state;

    if (!selectedSource || !editor) {
      return;
    } // only allow one conditionalPanel location.


    if (conditionalPanelLocation) {
      closeConditionalPanel();
    }

    const target = event.target;
    const {
      id: sourceId
    } = selectedSource;

    if (typeof line != "number") {
      return;
    }

    if (target.classList.contains("cm-gutter") || target.classList.contains("cm-gutterElement")) {
      const location = (0, _location.createLocation)({
        line,
        column: undefined,
        source: selectedSource
      });
      const lineText = (0, _source.getLineText)(sourceId, selectedSourceTextContent, line).trim();
      const lineObject = {
        from: {
          line,
          ch
        },
        to: {
          line,
          ch
        }
      };
      this.props.showEditorGutterContextMenu(event, lineObject, location, lineText);
      return;
    }

    if (target.getAttribute("id") === "columnmarker") {
      return;
    }

    const location = (0, _location.createLocation)({
      source: selectedSource,
      line: (0, _index4.fromEditorLine)(selectedSource, line),
      column: editor.isWasm ? 0 : ch + 1
    });
    const lineObject = editor.getSelectionCursor();
    this.props.showEditorContextMenu(event, editor, lineObject, location);
  }
  /**
   * CodeMirror event handler, called whenever the cursor moves
   * for user-driven or programatic reasons.
   */


  onClick(e, line, ch) {
    const {
      selectedSource,
      updateCursorPosition,
      jumpToMappedLocation
    } = this.props;
    const {
      editor
    } = this.state;

    if (selectedSource) {
      const sourceLocation = (0, _location.createLocation)({
        source: selectedSource,
        line: (0, _index4.fromEditorLine)(selectedSource, line),
        column: editor.isWasm ? 0 : ch + 1
      });

      if (e.metaKey && e.altKey) {
        jumpToMappedLocation(sourceLocation);
      }

      updateCursorPosition(sourceLocation);
    }
  }

  shouldScrollToLocation(nextProps) {
    if (!nextProps.selectedLocation?.line || !nextProps.selectedSourceTextContent) {
      return false;
    }

    const {
      selectedLocation,
      selectedSourceTextContent
    } = this.props;
    const contentChanged = !selectedSourceTextContent?.value && nextProps.selectedSourceTextContent?.value;
    const locationChanged = selectedLocation !== nextProps.selectedLocation;
    return contentChanged || locationChanged;
  }

  scrollToLocation(nextProps, editor) {
    const {
      selectedLocation
    } = nextProps;
    const {
      line,
      column
    } = (0, _index4.toEditorPosition)(selectedLocation);
    return editor.scrollTo(line, column);
  }

  async setText(props, editor) {
    const {
      selectedSource,
      selectedSourceTextContent
    } = props;

    if (!editor) {
      return;
    } // check if we previously had a selected source


    if (!selectedSource) {
      return;
    }

    if (!selectedSourceTextContent?.value) {
      this.showLoadingMessage(editor);
      return;
    }

    if ((0, _asyncValue.isRejected)(selectedSourceTextContent)) {
      let {
        value
      } = selectedSourceTextContent;

      if (typeof value !== "string") {
        value = "Unexpected source error";
      }

      this.showErrorMessage(value);
      return;
    }

    await editor.setText(selectedSourceTextContent.value.value, selectedSource.id);
  }

  showErrorMessage(msg) {
    const {
      editor
    } = this.state;

    if (!editor) {
      return;
    }

    let error;

    if (msg.includes("WebAssembly binary source is not available")) {
      error = L10N.getStr("wasmIsNotAvailable");
    } else {
      error = L10N.getFormatStr("errorLoadingText3", msg);
    }

    editor.setText(error);
  }

  showLoadingMessage(editor) {
    editor.setText(L10N.getStr("loadingText"));
  }

  getInlineEditorStyles() {
    const {
      searchInFileEnabled
    } = this.props;

    if (searchInFileEnabled) {
      return {
        height: `calc(100% - ${cssVars.searchbarHeight})`
      };
    }

    return {
      height: "100%"
    };
  } // eslint-disable-next-line complexity


  renderItems() {
    const {
      selectedSource,
      conditionalPanelLocation,
      isPaused,
      isTraceSelected,
      inlinePreviewEnabled,
      highlightedLineRange,
      isOriginalSourceAndMapScopesEnabled,
      selectedSourceTextContent
    } = this.props;
    const {
      editor
    } = this.state;

    if (!selectedSource || !editor) {
      return null;
    } // Only load the sub components if the content has loaded without issues.


    if (selectedSourceTextContent && !(0, _asyncValue.isFulfilled)(selectedSourceTextContent)) {
      return null;
    }

    return _react.default.createElement(_react.default.Fragment, null, _react.default.createElement(_Breakpoints.default, {
      editor
    }), (isPaused || isTraceSelected) && selectedSource.isOriginal && !selectedSource.isPrettyPrinted && !isOriginalSourceAndMapScopesEnabled ? null : _react.default.createElement(_index3.default, {
      editor,
      editorRef: this.$editorWrapper
    }), _react.default.createElement(_DebugLine.default, {
      editor,
      selectedSource
    }), _react.default.createElement(_HighlightLine.default, {
      editor
    }), _react.default.createElement(_Exceptions.default, {
      editor
    }), conditionalPanelLocation ? _react.default.createElement(_ConditionalPanel.default, {
      editor,
      selectedSource
    }) : null, (isPaused || isTraceSelected) && inlinePreviewEnabled && (!selectedSource.isOriginal || selectedSource.isPrettyPrinted || isOriginalSourceAndMapScopesEnabled) ? _react.default.createElement(_InlinePreviews.default, {
      editor
    }) : null, highlightedLineRange ? _react.default.createElement(_HighlightLines.default, {
      editor,
      range: highlightedLineRange
    }) : null, _react.default.createElement(_ColumnBreakpoints.default, {
      editor
    }));
  }

  renderSearchInFileBar() {
    if (!this.props.selectedSource) {
      return null;
    }

    return _react.default.createElement(_SearchInFileBar.default, {
      editor: this.state.editor
    });
  }

  render() {
    const {
      selectedSourceIsBlackBoxed,
      skipPausing
    } = this.props;
    return (0, _reactDomFactories.div)({
      className: classnames("editor-wrapper", {
        blackboxed: selectedSourceIsBlackBoxed,
        "skip-pausing": skipPausing
      }),
      ref: c => this.$editorWrapper = c
    }, (0, _reactDomFactories.div)({
      className: "editor-mount devtools-monospace",
      style: this.getInlineEditorStyles()
    }), this.renderSearchInFileBar(), this.renderItems());
  }

}

Editor.contextTypes = {
  shortcuts: _reactPropTypes.default.object
};

const mapStateToProps = state => {
  const selectedSource = (0, _index.getSelectedSource)(state);
  const selectedLocation = (0, _index.getSelectedLocation)(state);
  const selectedSourceTextContent = (0, _index.getSelectedSourceTextContent)(state);
  return {
    selectedLocation,
    selectedSource,
    // Settled means the content loaded succesfully (fulfilled) or the there was
    // error (rejected)
    selectedSourceTextContent: (0, _asyncValue.asSettled)(selectedSourceTextContent),
    selectedSourceIsBlackBoxed: selectedSource ? (0, _index.isSourceBlackBoxed)(state, selectedSource) : null,
    isSourceOnIgnoreList: (0, _index.isSourceMapIgnoreListEnabled)(state) && (0, _index.isSourceOnSourceMapIgnoreList)(state, selectedSource),
    searchInFileEnabled: (0, _index.getActiveSearch)(state) === "file",
    conditionalPanelLocation: (0, _index.getConditionalPanelLocation)(state),
    isPaused: (0, _index.getIsCurrentThreadPaused)(state),
    isTraceSelected: (0, _index.getSelectedTraceIndex)(state) != null,
    skipPausing: (0, _index.getSkipPausing)(state),
    inlinePreviewEnabled: (0, _index.getInlinePreview)(state),
    blackboxedRanges: (0, _index.getBlackBoxRanges)(state),
    breakableLines: (0, _index.getSelectedBreakableLines)(state),
    highlightedLineRange: (0, _index.getHighlightedLineRangeForSelectedSource)(state),
    isOriginalSourceAndMapScopesEnabled: selectedSource?.isOriginal && (0, _index.isMapScopesEnabled)(state),
    shouldScrollToSelectedLocation: (0, _index.getShouldScrollToSelectedLocation)(state)
  };
};

const mapDispatchToProps = dispatch => ({ ...(0, _redux.bindActionCreators)({
    openConditionalPanel: _index2.default.openConditionalPanel,
    closeConditionalPanel: _index2.default.closeConditionalPanel,
    continueToHere: _index2.default.continueToHere,
    toggleBreakpointAtLine: _index2.default.toggleBreakpointAtLine,
    addBreakpointAtLine: _index2.default.addBreakpointAtLine,
    jumpToMappedLocation: _index2.default.jumpToMappedLocation,
    updateViewport: _index2.default.updateViewport,
    updateCursorPosition: _index2.default.updateCursorPosition,
    closeTab: _index2.default.closeTab,
    showEditorContextMenu: _index2.default.showEditorContextMenu,
    showEditorGutterContextMenu: _index2.default.showEditorGutterContextMenu,
    selectLocation: _index2.default.selectLocation,
    setInScopeLines: _index2.default.setInScopeLines
  }, dispatch)
});

var _default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(Editor);

exports.default = _default;