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
loader.lazyRequireGetter(this, "_indentation", "devtools/client/debugger/src/utils/indentation");
loader.lazyRequireGetter(this, "_wasm", "devtools/client/debugger/src/utils/wasm");
loader.lazyRequireGetter(this, "_prefs", "devtools/client/debugger/src/utils/prefs");
loader.lazyRequireGetter(this, "_index", "devtools/client/debugger/src/selectors/index");

var _index2 = _interopRequireDefault(require("../../actions/index"));

var _SearchInFileBar = _interopRequireDefault(require("./SearchInFileBar"));

var _HighlightLines = _interopRequireDefault(require("./HighlightLines"));

var _index3 = _interopRequireDefault(require("./Preview/index"));

var _Breakpoints = _interopRequireDefault(require("./Breakpoints"));

var _ColumnBreakpoints = _interopRequireDefault(require("./ColumnBreakpoints"));

var _DebugLine = _interopRequireDefault(require("./DebugLine"));

var _HighlightLine = _interopRequireDefault(require("./HighlightLine"));

var _EmptyLines = _interopRequireDefault(require("./EmptyLines"));

var _ConditionalPanel = _interopRequireDefault(require("./ConditionalPanel"));

var _InlinePreviews = _interopRequireDefault(require("./InlinePreviews"));

var _Exceptions = _interopRequireDefault(require("./Exceptions"));

var _BlackboxLines = _interopRequireDefault(require("./BlackboxLines"));

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
      symbols: _reactPropTypes.default.object,
      startPanelSize: _reactPropTypes.default.number.isRequired,
      endPanelSize: _reactPropTypes.default.number.isRequired,
      searchInFileEnabled: _reactPropTypes.default.bool.isRequired,
      inlinePreviewEnabled: _reactPropTypes.default.bool.isRequired,
      skipPausing: _reactPropTypes.default.bool.isRequired,
      blackboxedRanges: _reactPropTypes.default.object.isRequired,
      breakableLines: _reactPropTypes.default.object.isRequired,
      highlightedLineRange: _reactPropTypes.default.object,
      isSourceOnIgnoreList: _reactPropTypes.default.bool,
      mapScopesEnabled: _reactPropTypes.default.bool
    };
  }

  constructor(props) {
    super(props);

    _defineProperty(this, "$editorWrapper", void 0);

    _defineProperty(this, "onEditorUpdated", v => {
      if (v.docChanged || v.geometryChanged) {
        (0, _ui.resizeToggleButton)(v.view.dom.querySelector(".cm-gutters").clientWidth);
        this.props.updateViewport();
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
      const line = this.getCurrentLine();

      if (typeof line !== "number") {
        return;
      }

      this.props.toggleBreakpointAtLine(line);
    });

    _defineProperty(this, "onToggleConditionalPanel", e => {
      e.stopPropagation();
      e.preventDefault();
      const {
        conditionalPanelLocation,
        closeConditionalPanel,
        openConditionalPanel,
        selectedSource
      } = this.props;
      const line = this.getCurrentLine();
      const {
        codeMirror
      } = this.state.editor; // add one to column for correct position in editor.

      const column = (0, _index4.getCursorColumn)(codeMirror) + 1;

      if (conditionalPanelLocation) {
        return closeConditionalPanel();
      }

      if (!selectedSource || typeof line !== "number") {
        return null;
      }

      return openConditionalPanel((0, _location.createLocation)({
        line,
        column,
        source: selectedSource
      }), false);
    });

    _defineProperty(this, "onEditorScroll", debounce(this.props.updateViewport, 75));

    _defineProperty(this, "onEscape", e => {
      if (!this.state.editor) {
        return;
      }

      const {
        codeMirror
      } = this.state.editor;

      if (codeMirror.listSelections().length > 1) {
        codeMirror.execCommand("singleSelection");
        e.preventDefault();
      }
    });

    _defineProperty(this, "onCursorChange", event => {
      const {
        line,
        ch
      } = event.doc.getCursor();
      this.props.selectLocation((0, _location.createLocation)({
        source: this.props.selectedSource,
        // CodeMirror cursor location is all 0-based.
        // Whereast in DevTools frontend and backend,
        // only colunm is 0-based, the line is 1 based.
        line: line + 1,
        column: ch
      }), {
        // Reset the context, so that we don't switch to original
        // while moving the cursor within a bundle
        keepContext: false,
        // Avoid highlighting the selected line
        highlight: false
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

      const sourceLine = (0, _index4.toSourceLine)(selectedSource.id, line);

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

    if (!editor && nextProps.selectedSource) {
      editor = this.setupEditor();
    }

    const shouldUpdateText = nextProps.selectedSource !== this.props.selectedSource || nextProps.selectedSourceTextContent?.value !== this.props.selectedSourceTextContent?.value || nextProps.symbols !== this.props.symbols;
    const shouldScroll = nextProps.selectedLocation && this.shouldScrollToLocation(nextProps, editor);

    if (!_prefs.features.codemirrorNext) {
      const shouldUpdateSize = nextProps.startPanelSize !== this.props.startPanelSize || nextProps.endPanelSize !== this.props.endPanelSize;

      if (shouldUpdateText || shouldUpdateSize || shouldScroll) {
        (0, _index4.startOperation)();

        if (shouldUpdateText) {
          this.setText(nextProps, editor);
        }

        if (shouldUpdateSize) {
          editor.codeMirror.setSize();
        }

        if (shouldScroll) {
          this.scrollToLocation(nextProps, editor);
        }

        (0, _index4.endOperation)();
      }

      if (this.props.selectedSource != nextProps.selectedSource) {
        this.props.updateViewport();
        (0, _ui.resizeBreakpointGutter)(editor.codeMirror);
        (0, _ui.resizeToggleButton)((0, _ui.getLineNumberWidth)(editor.codeMirror));
      }
    } else {
      // For codemirror 6
      // eslint-disable-next-line no-lonely-if
      if (shouldUpdateText) {
        this.setText(nextProps, editor);
      }

      if (shouldScroll) {
        this.scrollToLocation(nextProps, editor);
      }
    }
  }

  setupEditor() {
    const editor = (0, _index4.getEditor)(_prefs.features.codemirrorNext); // disables the default search shortcuts

    editor._initShortcuts = () => {};

    const node = _reactDom.default.findDOMNode(this);

    if (node instanceof HTMLElement) {
      editor.appendToLocalElement(node.querySelector(".editor-mount"));
    }

    if (!_prefs.features.codemirrorNext) {
      const {
        codeMirror
      } = editor;
      this.abortController = new window.AbortController(); // CodeMirror refreshes its internal state on window resize, but we need to also
      // refresh it when the side panels are resized.
      // We could have a ResizeObserver instead, but we wouldn't be able to differentiate
      // between window resize and side panel resize and as a result, might refresh
      // codeMirror twice, which is wasteful.

      window.document.querySelector(".editor-pane").addEventListener("resizeend", () => codeMirror.refresh(), {
        signal: this.abortController.signal
      });
      codeMirror.on("gutterClick", this.onGutterClick);
      codeMirror.on("cursorActivity", this.onCursorChange);
      const codeMirrorWrapper = codeMirror.getWrapperElement(); // Set code editor wrapper to be focusable

      codeMirrorWrapper.tabIndex = 0;
      codeMirrorWrapper.addEventListener("keydown", e => this.onKeyDown(e));
      codeMirrorWrapper.addEventListener("click", e => this.onClick(e));
      codeMirrorWrapper.addEventListener("mouseover", (0, _index4.onMouseOver)(codeMirror));
      codeMirrorWrapper.addEventListener("contextmenu", event => this.openMenu(event));
      codeMirror.on("scroll", this.onEditorScroll);
      this.onEditorScroll();
    } else {
      editor.setUpdateListener(this.onEditorUpdated);
      editor.setGutterEventListeners({
        click: (event, cm, line) => this.onGutterClick(cm, line, null, event),
        contextmenu: (event, cm, line) => this.openMenu(event, line)
      });
      editor.addEditorDOMEventListeners({
        click: (event, cm, line, column) => this.onClick(event, line, column),
        contextmenu: (event, cm, line, column) => this.openMenu(event, line, column),
        mouseover: (0, _index4.onMouseOver)(editor)
      });
    }

    this.setState({
      editor
    });
    return editor;
  }

  componentDidMount() {
    if (!_prefs.features.codemirrorNext) {
      const {
        shortcuts
      } = this.context;
      shortcuts.on(L10N.getStr("toggleBreakpoint.key"), this.onToggleBreakpoint);
      shortcuts.on(L10N.getStr("toggleCondPanel.breakpoint.key"), this.onToggleConditionalPanel);
      shortcuts.on(L10N.getStr("toggleCondPanel.logPoint.key"), this.onToggleConditionalPanel);
      shortcuts.on(L10N.getStr("sourceTabs.closeTab.key"), this.onCloseShortcutPress);
      shortcuts.on("Esc", this.onEscape);
    }
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
    } // Sets the breakables lines for codemirror 6


    if (_prefs.features.codemirrorNext) {
      const shouldUpdateBreakableLines = prevProps.breakableLines.size !== this.props.breakableLines.size || prevProps.selectedSource?.id !== selectedSource.id || // Make sure we update after the editor has loaded
      !prevState.editor && !!editor;
      const isSourceWasm = (0, _wasm.isWasm)(selectedSource.id);

      if (shouldUpdateBreakableLines) {
        editor.setLineGutterMarkers([{
          id: "empty-line-marker",
          lineClassName: "empty-line",
          condition: line => {
            const lineNumber = (0, _index4.fromEditorLine)(selectedSource.id, line, isSourceWasm);
            return !breakableLines.has(lineNumber);
          }
        }]);
      }

      function condition(line) {
        const lineNumber = (0, _index4.fromEditorLine)(selectedSource.id, line);
        return (0, _source.isLineBlackboxed)(blackboxedRanges[selectedSource.url], lineNumber, isSourceOnIgnoreList);
      }

      editor.setLineGutterMarkers([{
        id: "blackboxed-line-gutter-marker",
        lineClassName: "blackboxed-line",
        condition
      }]);
      editor.setLineContentMarker({
        id: "blackboxed-line-marker",
        lineClassName: "blackboxed-line",
        condition
      });
    }
  }

  componentWillUnmount() {
    const {
      editor
    } = this.state;

    if (!_prefs.features.codemirrorNext) {
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
    }

    if (editor) {
      if (!_prefs.features.codemirrorNext) {
        editor.codeMirror.off("scroll", this.onEditorScroll);
      }

      editor.destroy();
      this.setState({
        editor: null
      });
    }
  }

  getCurrentLine() {
    const {
      codeMirror
    } = this.state.editor;
    const {
      selectedSource
    } = this.props;

    if (!selectedSource) {
      return null;
    }

    const line = (0, _index4.getCursorLine)(codeMirror);
    return (0, _index4.toSourceLine)(selectedSource.id, line);
  }

  onKeyDown(e) {
    const {
      codeMirror
    } = this.state.editor;
    const {
      key,
      target
    } = e;
    const codeWrapper = codeMirror.getWrapperElement();
    const textArea = codeWrapper.querySelector("textArea");

    if (key === "Escape" && target == textArea) {
      e.stopPropagation();
      e.preventDefault();
      codeWrapper.focus();
    } else if (key === "Enter" && target == codeWrapper) {
      e.preventDefault(); // Focus into editor's text area

      textArea.focus();
    }
  }
  /*
   * The default Esc command is overridden in the CodeMirror keymap to allow
   * the Esc keypress event to be catched by the toolbox and trigger the
   * split console. Restore it here, but preventDefault if and only if there
   * is a multiselection.
   */


  // Note: The line is optional, if not passed (as is likely for codemirror 6)
  // it fallsback to lineAtHeight.
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
    line = line ?? (0, _index4.lineAtHeight)(editor, sourceId, event);

    if (typeof line != "number") {
      return;
    }

    if ( // handles codemirror 6
    target.classList.contains("cm-gutterElement") && target.closest(".cm-gutter.cm-lineNumbers") || // handles codemirror 5
    target.classList.contains("CodeMirror-linenumber")) {
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

    let location;

    if (_prefs.features.codemirrorNext) {
      location = (0, _location.createLocation)({
        source: selectedSource,
        line: (0, _index4.fromEditorLine)(selectedSource.id, line, (0, _wasm.isWasm)(selectedSource.id)),
        column: (0, _wasm.isWasm)(selectedSource.id) ? 0 : ch + 1
      });
    } else {
      location = (0, _index4.getSourceLocationFromMouseEvent)(editor, selectedSource, event);
    }

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

    if (selectedSource) {
      let sourceLocation;

      if (_prefs.features.codemirrorNext) {
        sourceLocation = (0, _location.createLocation)({
          source: selectedSource,
          line: (0, _index4.fromEditorLine)(selectedSource.id, line, (0, _wasm.isWasm)(selectedSource.id)),
          column: (0, _wasm.isWasm)(selectedSource.id) ? 0 : ch + 1
        });
      } else {
        sourceLocation = (0, _index4.getSourceLocationFromMouseEvent)(this.state.editor, selectedSource, e);
      }

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
    const symbolsChanged = nextProps.symbols != this.props.symbols;
    return contentChanged || locationChanged || symbolsChanged;
  }

  scrollToLocation(nextProps, editor) {
    const {
      selectedLocation,
      selectedSource
    } = nextProps;
    let {
      line,
      column
    } = (0, _index4.toEditorPosition)(selectedLocation);

    if (selectedSource && (0, _index4.hasDocument)(selectedSource.id)) {
      const doc = (0, _index4.getDocument)(selectedSource.id);
      const lineText = doc.getLine(line);
      column = Math.max(column, (0, _indentation.getIndentation)(lineText));
    }

    editor.scrollTo(line, column);
  }

  setText(props, editor) {
    const {
      selectedSource,
      selectedSourceTextContent,
      symbols
    } = props;

    if (!editor) {
      return;
    } // check if we previously had a selected source


    if (!selectedSource) {
      if (!_prefs.features.codemirrorNext) {
        this.clearEditor();
      }

      return;
    }

    if (!selectedSourceTextContent?.value) {
      this.showLoadingMessage(editor);
      return;
    }

    if (selectedSourceTextContent.state === "rejected") {
      let {
        value
      } = selectedSourceTextContent;

      if (typeof value !== "string") {
        value = "Unexpected source error";
      }

      this.showErrorMessage(value);
      return;
    }

    if (!_prefs.features.codemirrorNext) {
      (0, _index4.showSourceText)(editor, selectedSource, selectedSourceTextContent, symbols);
    } else {
      editor.setText(selectedSourceTextContent.value.value);
    }
  }

  clearEditor() {
    const {
      editor
    } = this.state;

    if (!editor) {
      return;
    }

    const doc = editor.createDocument("", {
      name: "text"
    });
    editor.replaceDocument(doc);
    (0, _index4.resetLineNumberFormat)(editor);
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

    if (!_prefs.features.codemirrorNext) {
      const doc = editor.createDocument(error, {
        name: "text"
      });
      editor.replaceDocument(doc);
      (0, _index4.resetLineNumberFormat)(editor);
    } else {
      editor.setText(error);
    }
  }

  showLoadingMessage(editor) {
    if (!_prefs.features.codemirrorNext) {
      // Create the "loading message" document only once
      let doc = (0, _index4.getDocument)("loading");

      if (!doc) {
        doc = editor.createDocument(L10N.getStr("loadingText"), {
          name: "text"
        });
        (0, _index4.setDocument)("loading", doc);
      } // `createDocument` won't be used right away in the editor, we still need to
      // explicitely update it


      editor.replaceDocument(doc);
    } else {
      editor.setText(L10N.getStr("loadingText"));
    }
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
      inlinePreviewEnabled,
      highlightedLineRange,
      blackboxedRanges,
      isSourceOnIgnoreList,
      selectedSourceIsBlackBoxed,
      mapScopesEnabled
    } = this.props;
    const {
      editor
    } = this.state;

    if (!selectedSource || !editor) {
      return null;
    }

    if (_prefs.features.codemirrorNext) {
      return _react.default.createElement(_react.default.Fragment, null, _react.default.createElement(_Breakpoints.default, {
        editor
      }), isPaused && selectedSource.isOriginal && !selectedSource.isPrettyPrinted && !mapScopesEnabled ? null : _react.default.createElement(_index3.default, {
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
      }) : null, isPaused && inlinePreviewEnabled && (!selectedSource.isOriginal || selectedSource.isPrettyPrinted || mapScopesEnabled) ? _react.default.createElement(_InlinePreviews.default, {
        editor,
        selectedSource
      }) : null, highlightedLineRange ? _react.default.createElement(_HighlightLines.default, {
        editor,
        range: highlightedLineRange
      }) : null, _react.default.createElement(_ColumnBreakpoints.default, {
        editor
      }));
    }

    if (!(0, _index4.getDocument)(selectedSource.id)) {
      return null;
    }

    return (0, _reactDomFactories.div)(null, _react.default.createElement(_DebugLine.default, null), _react.default.createElement(_HighlightLine.default, null), _react.default.createElement(_EmptyLines.default, {
      editor
    }), _react.default.createElement(_Breakpoints.default, {
      editor
    }), isPaused && selectedSource.isOriginal && !selectedSource.isPrettyPrinted && !mapScopesEnabled ? null : _react.default.createElement(_index3.default, {
      editor,
      editorRef: this.$editorWrapper
    }), highlightedLineRange ? _react.default.createElement(_HighlightLines.default, {
      editor,
      range: highlightedLineRange
    }) : null, isSourceOnIgnoreList || selectedSourceIsBlackBoxed ? _react.default.createElement(_BlackboxLines.default, {
      editor,
      selectedSource,
      isSourceOnIgnoreList,
      blackboxedRangesForSelectedSource: blackboxedRanges[selectedSource.url]
    }) : null, _react.default.createElement(_Exceptions.default, null), conditionalPanelLocation ? _react.default.createElement(_ConditionalPanel.default, {
      editor
    }) : null, _react.default.createElement(_ColumnBreakpoints.default, {
      editor
    }), isPaused && inlinePreviewEnabled && (!selectedSource.isOriginal || selectedSource.isOriginal && selectedSource.isPrettyPrinted || selectedSource.isOriginal && mapScopesEnabled) ? _react.default.createElement(_InlinePreviews.default, {
      editor,
      selectedSource
    }) : null);
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
  return {
    selectedLocation,
    selectedSource,
    selectedSourceTextContent: (0, _index.getSelectedSourceTextContent)(state),
    selectedSourceIsBlackBoxed: selectedSource ? (0, _index.isSourceBlackBoxed)(state, selectedSource) : null,
    isSourceOnIgnoreList: (0, _index.isSourceMapIgnoreListEnabled)(state) && (0, _index.isSourceOnSourceMapIgnoreList)(state, selectedSource),
    searchInFileEnabled: (0, _index.getActiveSearch)(state) === "file",
    conditionalPanelLocation: (0, _index.getConditionalPanelLocation)(state),
    symbols: (0, _index.getSymbols)(state, selectedLocation),
    isPaused: (0, _index.getIsCurrentThreadPaused)(state),
    skipPausing: (0, _index.getSkipPausing)(state),
    inlinePreviewEnabled: (0, _index.getInlinePreview)(state),
    blackboxedRanges: (0, _index.getBlackBoxRanges)(state),
    breakableLines: (0, _index.getSelectedBreakableLines)(state),
    highlightedLineRange: (0, _index.getHighlightedLineRangeForSelectedSource)(state),
    mapScopesEnabled: selectedSource?.isOriginal ? (0, _index.isMapScopesEnabled)(state) : null
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
    selectLocation: _index2.default.selectLocation
  }, dispatch)
});

var _default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(Editor);

exports.default = _default;