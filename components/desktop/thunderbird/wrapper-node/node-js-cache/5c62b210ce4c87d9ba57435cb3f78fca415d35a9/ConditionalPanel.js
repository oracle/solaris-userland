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
loader.lazyRequireGetter(this, "_prefs", "devtools/client/debugger/src/utils/prefs");

var _index2 = _interopRequireDefault(require("../../actions/index"));

loader.lazyRequireGetter(this, "_index3", "devtools/client/debugger/src/selectors/index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const classnames = require("resource://devtools/client/shared/classnames.js");

const CONDITIONAL_BP_MARKER = "conditional-breakpoint-panel-marker";

function addNewLine(doc) {
  const cursor = doc.getCursor();
  const pos = {
    line: cursor.line,
    ch: cursor.ch
  };
  doc.replaceRange("\n", pos);
}

class ConditionalPanel extends _react.PureComponent {
  constructor() {
    super();

    _defineProperty(this, "cbPanel", void 0);

    _defineProperty(this, "input", void 0);

    _defineProperty(this, "codeMirror", void 0);

    _defineProperty(this, "panelNode", void 0);

    _defineProperty(this, "scrollParent", void 0);

    _defineProperty(this, "saveAndClose", () => {
      if (this.input) {
        this.setBreakpoint(this.input.value.trim());
      }

      this.props.closeConditionalPanel();
    });

    _defineProperty(this, "onKey", e => {
      if (e.key === "Enter") {
        if (this.codeMirror && e.altKey) {
          addNewLine(this.codeMirror.doc);
        } else {
          this.saveAndClose();
        }
      } else if (e.key === "Escape") {
        this.props.closeConditionalPanel();
      }
    });

    _defineProperty(this, "repositionOnScroll", () => {
      if (this.panelNode && this.scrollParent) {
        const {
          scrollLeft
        } = this.scrollParent;
        this.panelNode.style.transform = `translateX(${scrollLeft}px)`;
      }
    });

    _defineProperty(this, "createEditor", (input, editor) => {
      const {
        log,
        closeConditionalPanel
      } = this.props;
      const codeMirror = editor.CodeMirror.fromTextArea(input, {
        mode: "javascript",
        theme: "mozilla",
        placeholder: L10N.getStr(log ? "editor.conditionalPanel.logPoint.placeholder2" : "editor.conditionalPanel.placeholder2"),
        cursorBlinkRate: _prefs.prefs.cursorBlinkRate
      });
      codeMirror.on("keydown", (cm, e) => {
        if (e.key === "Enter") {
          e.codemirrorIgnore = true;
        }
      });
      codeMirror.on("blur", (cm, e) => {
        if ( // if there is no event
        // or if the focus is the conditional panel
        // do not close the conditional panel
        !e || e?.relatedTarget && e.relatedTarget.closest(".conditional-breakpoint-panel")) {
          return;
        }

        closeConditionalPanel();
      });
      const codeMirrorWrapper = codeMirror.getWrapperElement();
      codeMirrorWrapper.addEventListener("keydown", e => {
        codeMirror.save();
        this.onKey(e);
      });
      this.input = input;
      this.codeMirror = codeMirror;
      codeMirror.focus();
      codeMirror.setCursor(codeMirror.lineCount(), 0);
    });

    this.cbPanel = null;
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

  keepFocusOnInput() {
    if (this.input) {
      this.input.focus();
    }
  }

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
      editor,
      breakpoint,
      selectedSource
    } = this.props; // When breakpoint is removed

    if (prevProps?.breakpoint && !breakpoint) {
      editor.removeLineContentMarker(CONDITIONAL_BP_MARKER);
      return;
    }

    if (selectedSource.id !== location.source.id) {
      editor.removeLineContentMarker(CONDITIONAL_BP_MARKER);
      return;
    }

    const editorLine = (0, _index.toEditorLine)(location.source.id, location.line || 0);
    editor.setLineContentMarker({
      id: CONDITIONAL_BP_MARKER,
      condition: line => line == editorLine,
      createLineElementNode: () => {
        // Create a Codemirror 5 editor for the breakpoint panel
        // TODO: Switch to use Codemirror 6 version Bug 1890205
        const breakpointPanelEditor = (0, _createEditor.createEditor)();
        breakpointPanelEditor.appendToLocalElement(document.createElement("div"));
        return this.renderConditionalPanel(this.props, breakpointPanelEditor);
      }
    });
  } // FIXME: https://bugzilla.mozilla.org/show_bug.cgi?id=1774507


  UNSAFE_componentWillMount() {
    if (_prefs.features.codemirrorNext) {
      this.showConditionalPanel();
    } else {
      this.renderToWidget(this.props);
    }
  } // FIXME: https://bugzilla.mozilla.org/show_bug.cgi?id=1774507


  UNSAFE_componentWillUpdate() {
    if (!_prefs.features.codemirrorNext) {
      this.clearConditionalPanel();
    }
  }

  componentDidUpdate(prevProps) {
    if (_prefs.features.codemirrorNext) {
      this.showConditionalPanel(prevProps);
    }

    this.keepFocusOnInput();
  }

  componentWillUnmount() {
    // This is called if CodeMirror is re-initializing itself before the
    // user closes the conditional panel. Clear the widget, and re-render it
    // as soon as this component gets remounted
    const {
      editor
    } = this.props;

    if (_prefs.features.codemirrorNext) {
      editor.removeLineContentMarker(CONDITIONAL_BP_MARKER);
    } else {
      this.clearConditionalPanel();
    }
  }

  renderToWidget(props) {
    if (this.cbPanel) {
      this.clearConditionalPanel();
    }

    const {
      location,
      editor
    } = props;
    const editorLine = (0, _index.toEditorLine)(location.source.id, location.line || 0);
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
    return log ? options.logValue : options.condition;
  }

  renderConditionalPanel(props, editor) {
    const {
      log
    } = props;
    const defaultValue = this.getDefaultValue();
    const panel = document.createElement("div");

    _reactDom.default.render((0, _reactDomFactories.div)({
      className: classnames("conditional-breakpoint-panel", {
        "log-point": log
      }),
      onClick: () => this.keepFocusOnInput(),
      ref: node => this.panelNode = node
    }, (0, _reactDomFactories.div)({
      className: "prompt"
    }, "»"), (0, _reactDomFactories.textarea)({
      defaultValue,
      ref: input => this.createEditor(input, editor)
    })), panel);

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
    throw new Error("Conditional panel location needed.");
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