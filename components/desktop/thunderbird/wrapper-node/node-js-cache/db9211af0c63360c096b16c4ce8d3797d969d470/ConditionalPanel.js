"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.ConditionalPanel = void 0;

var _react = require("devtools/client/shared/vendor/react");

var _reactDomFactories = require("devtools/client/shared/vendor/react-dom-factories");

var _reactDom = _interopRequireDefault(require("devtools/client/shared/vendor/react-dom"));

var _reactPropTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

var _reactRedux = require("devtools/client/shared/vendor/react-redux");

loader.lazyRequireGetter(this, "_index", "devtools/client/debugger/src/utils/editor/index");
loader.lazyRequireGetter(this, "_createEditor", "devtools/client/debugger/src/utils/editor/create-editor");

var _index2 = _interopRequireDefault(require("../../actions/index"));

loader.lazyRequireGetter(this, "_constants", "devtools/client/debugger/src/constants");
loader.lazyRequireGetter(this, "_index3", "devtools/client/debugger/src/selectors/index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const classnames = require("resource://devtools/client/shared/classnames.js");

class ConditionalPanel extends _react.PureComponent {
  constructor() {
    super();

    _defineProperty(this, "cbPanel", void 0);

    _defineProperty(this, "input", void 0);

    _defineProperty(this, "codeMirror", void 0);

    _defineProperty(this, "panelNode", void 0);

    _defineProperty(this, "scrollParent", void 0);

    _defineProperty(this, "saveAndClose", (expression = null) => {
      if (typeof expression === "string") {
        const trimmedExpression = expression.trim();

        if (trimmedExpression) {
          this.setBreakpoint(trimmedExpression);
        } else if (this.props.breakpoint) {
          // if the user was editing the condition/log of an existing breakpoint,
          // we remove the condition/log.
          this.setBreakpoint(null);
        }
      }

      this.props.closeConditionalPanel();
    });

    _defineProperty(this, "onKey", e => {
      if (e.key === "Enter" && !e.shiftKey) {
        this.saveAndClose(this.input?.value);
      } else if (e.key === "Escape") {
        this.props.closeConditionalPanel();
      }
    });

    _defineProperty(this, "onBlur", e => {
      if ( // if there is no event
      // or if the focus is the conditional panel
      // do not close the conditional panel
      !e || e?.relatedTarget && e.relatedTarget.closest(".conditional-breakpoint-panel")) {
        return;
      }

      this.props.closeConditionalPanel();
    });

    _defineProperty(this, "repositionOnScroll", () => {
      if (this.panelNode && this.scrollParent) {
        const {
          scrollLeft
        } = this.scrollParent;
        this.panelNode.style.transform = `translateX(${scrollLeft}px)`;
      }
    });

    _defineProperty(this, "setupAndAppendInlineEditor", (el, editor) => {
      editor.appendToLocalElement(el);
      editor.on("blur", e => this.onBlur(e));
      editor.setText(this.getDefaultValue());
      editor.focus();
      editor.selectAll();
    });

    this.cbPanel = null;
    this.breakpointPanelEditor = null;
  }

  static get propTypes() {
    return {
      breakpoint: _reactPropTypes.default.object,
      closeConditionalPanel: _reactPropTypes.default.func.isRequired,
      editor: _reactPropTypes.default.object.isRequired,
      location: _reactPropTypes.default.any.isRequired,
      log: _reactPropTypes.default.bool.isRequired,
      openConditionalPanel: _reactPropTypes.default.func.isRequired,
      setBreakpointOptions: _reactPropTypes.default.func.isRequired,
      selectedSource: _reactPropTypes.default.object.isRequired
    };
  }

  removeBreakpointPanelEditor() {
    if (this.breakpointPanelEditor) {
      this.breakpointPanelEditor.destroy();
    }

    this.breakpointPanelEditor = null;
  }

  keepFocusOnInput() {
    if (this.input) {
      this.input.focus();
    } else if (this.breakpointPanelEditor) {
      if (!this.breakpointPanelEditor.isDestroyed()) {
        this.breakpointPanelEditor.focus();
      }
    }
  }
  /**
   * Set the breakpoint/logpoint if expression isn't empty, and close the panel.
   *
   * @param {String} expression: The expression that will be used for setting the
   *        conditional breakpoint/logpoint
   */


  setBreakpoint(value) {
    const {
      log,
      breakpoint
    } = this.props; // If breakpoint is `pending`, props will not contain a breakpoint.
    // If source is a URL without location, breakpoint will contain no generatedLocation.

    const location = breakpoint && breakpoint.generatedLocation ? breakpoint.generatedLocation : this.props.location;
    const options = breakpoint ? breakpoint.options : {};
    const type = log ? "logValue" : "condition";
    return this.props.setBreakpointOptions(location, { ...options,
      [type]: value
    });
  }

  clearConditionalPanel() {
    if (this.cbPanel) {
      this.cbPanel.clear();
      this.cbPanel = null;
    }

    if (this.scrollParent) {
      this.scrollParent.removeEventListener("scroll", this.repositionOnScroll);
    }
  }

  showConditionalPanel(prevProps) {
    const {
      location,
      log,
      editor,
      breakpoint,
      selectedSource
    } = this.props;

    if (!selectedSource || !location) {
      this.removeBreakpointPanelEditor();
      return;
    } // When breakpoint is removed


    if (prevProps?.breakpoint && !breakpoint) {
      editor.removeLineContentMarker(_constants.markerTypes.CONDITIONAL_BP_MARKER);
      this.removeBreakpointPanelEditor();
      return;
    }

    if (selectedSource.id !== location.source.id) {
      editor.removeLineContentMarker(_constants.markerTypes.CONDITIONAL_BP_MARKER);
      this.removeBreakpointPanelEditor();
      return;
    }

    const line = (0, _index.toEditorLine)(location.source, location.line || 0);
    editor.setLineContentMarker({
      id: _constants.markerTypes.CONDITIONAL_BP_MARKER,
      lines: [{
        line
      }],
      renderAsBlock: true,
      createLineElementNode: () => {
        // Create a Codemirror editor for the breakpoint panel
        const onEnterKeyMapConfig = {
          preventDefault: true,
          stopPropagation: true,
          run: () => this.saveAndClose(breakpointPanelEditor.getText(null))
        };
        const breakpointPanelEditor = (0, _createEditor.createEditor)({
          cm6: true,
          readOnly: false,
          lineNumbers: false,
          placeholder: L10N.getStr(log ? "editor.conditionalPanel.logPoint.placeholder2" : "editor.conditionalPanel.placeholder2"),
          keyMap: [{
            key: "Enter",
            ...onEnterKeyMapConfig
          }, {
            key: "Mod-Enter",
            ...onEnterKeyMapConfig
          }, {
            key: "Escape",
            preventDefault: true,
            stopPropagation: true,
            run: () => this.props.closeConditionalPanel()
          }]
        });
        this.breakpointPanelEditor = breakpointPanelEditor;
        return this.renderConditionalPanel(this.props, breakpointPanelEditor);
      }
    });
  } // FIXME: https://bugzilla.mozilla.org/show_bug.cgi?id=1774507


  UNSAFE_componentWillMount() {
    this.showConditionalPanel();
  }

  componentDidUpdate(prevProps) {
    this.showConditionalPanel(prevProps);
    this.keepFocusOnInput();
  }

  componentWillUnmount() {
    // This is called if CodeMirror is re-initializing itself before the
    // user closes the conditional panel. Clear the widget, and re-render it
    // as soon as this component gets remounted
    const {
      editor
    } = this.props;
    editor.removeLineContentMarker(_constants.markerTypes.CONDITIONAL_BP_MARKER);
    this.removeBreakpointPanelEditor();
  }

  renderToWidget(props) {
    if (this.cbPanel) {
      this.clearConditionalPanel();
    }

    const {
      location,
      editor
    } = props;

    if (!location) {
      return;
    }

    const editorLine = (0, _index.toEditorLine)(location.source, location.line || 0);
    this.cbPanel = editor.codeMirror.addLineWidget(editorLine, this.renderConditionalPanel(props, editor), {
      coverGutter: true,
      noHScroll: true
    });

    if (this.input) {
      let parent = this.input.parentNode;

      while (parent) {
        if (parent instanceof HTMLElement && parent.classList.contains("CodeMirror-scroll")) {
          this.scrollParent = parent;
          break;
        }

        parent = parent.parentNode;
      }

      if (this.scrollParent) {
        this.scrollParent.addEventListener("scroll", this.repositionOnScroll);
        this.repositionOnScroll();
      }
    }
  }

  getDefaultValue() {
    const {
      breakpoint,
      log
    } = this.props;
    const options = breakpoint?.options || {};
    const value = log ? options.logValue : options.condition;
    return value || "";
  }

  renderConditionalPanel(props, editor) {
    const {
      log
    } = props;
    const panel = document.createElement("div"); // CodeMirror6 can't have margin on a block widget, so we need to wrap the actual
    // panel inside a container which won't have any margin

    const reactElPanel = (0, _reactDomFactories.div)({
      className: "conditional-breakpoint-panel-container"
    }, (0, _reactDomFactories.div)({
      className: classnames("conditional-breakpoint-panel", {
        "log-point": log
      }),
      onClick: () => this.keepFocusOnInput(),
      ref: node => this.panelNode = node
    }, (0, _reactDomFactories.div)({
      className: "prompt"
    }, "»"), (0, _reactDomFactories.div)({
      className: "inline-codemirror-container",
      ref: el => this.setupAndAppendInlineEditor(el, editor)
    })));

    _reactDom.default.render(reactElPanel, panel);

    return panel;
  }

  render() {
    return null;
  }

}

exports.ConditionalPanel = ConditionalPanel;

const mapStateToProps = state => {
  const location = (0, _index3.getConditionalPanelLocation)(state);

  if (!location) {
    return {};
  }

  const breakpoint = (0, _index3.getClosestBreakpoint)(state, location);
  return {
    breakpoint,
    location,
    log: (0, _index3.getLogPointStatus)(state)
  };
};

const {
  setBreakpointOptions,
  openConditionalPanel,
  closeConditionalPanel
} = _index2.default;
const mapDispatchToProps = {
  setBreakpointOptions,
  openConditionalPanel,
  closeConditionalPanel
};

var _default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(ConditionalPanel);

exports.default = _default;