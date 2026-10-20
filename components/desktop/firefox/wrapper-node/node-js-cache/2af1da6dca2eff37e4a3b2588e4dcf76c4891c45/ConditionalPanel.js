"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.ConditionalPanel = void 0;

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

var _reactDomFactories = require("devtools/client/shared/vendor/react-dom-factories");

var _reactDom = _interopRequireDefault(require("devtools/client/shared/vendor/react-dom"));

var _reactPropTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

var _reactRedux = require("devtools/client/shared/vendor/react-redux");

loader.lazyRequireGetter(this, "_index", "devtools/client/debugger/src/utils/editor/index");
loader.lazyRequireGetter(this, "_createEditor", "devtools/client/debugger/src/utils/editor/create-editor");

var _index2 = _interopRequireDefault(require("../../actions/index"));

loader.lazyRequireGetter(this, "_index3", "devtools/client/debugger/src/selectors/index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

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

    _defineProperty(this, "onFormSubmit", e => {
      if (e && e.preventDefault) {
        e.preventDefault();
      }

      const formData = new FormData(this.formRef.current);
      const showStacktrace = formData.get("showStacktrace") === "on";

      if (!this.breakpointPanelEditor || this.breakpointPanelEditor.isDestroyed()) {
        return;
      }

      const expression = this.breakpointPanelEditor.getText(null);
      this.saveAndClose(expression, showStacktrace);
    });

    _defineProperty(this, "onPanelBlur", e => {
      // if the focus is outside of the conditional panel,
      // close/hide the conditional panel
      if (e.relatedTarget && e.relatedTarget.closest(".conditional-breakpoint-panel-container")) {
        return;
      }

      this.props.closeConditionalPanel();
    });

    _defineProperty(this, "saveAndClose", (expression = null, showStacktrace = false) => {
      if (typeof expression === "string") {
        const trimmedExpression = expression.trim();

        if (trimmedExpression) {
          this.setBreakpoint(trimmedExpression, showStacktrace);
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
        e.preventDefault();
        this.formRef.current.requestSubmit();
      } else if (e.key === "Escape") {
        this.props.closeConditionalPanel();
      }
    });

    _defineProperty(this, "onBlur", e => {
      let explicitOriginalTarget = e?.explicitOriginalTarget; // The explicit original target can be a text node, in such case retrieve its parent
      // element so we can use `closest` on it.

      if (explicitOriginalTarget && !Element.isInstance(explicitOriginalTarget)) {
        explicitOriginalTarget = explicitOriginalTarget.parentElement;
      }

      if ( // if there is no event
      // or if the focus is the conditional panel
      // do not close the conditional panel
      !e || explicitOriginalTarget && explicitOriginalTarget.closest(".conditional-breakpoint-panel-container")) {
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
    this.formRef = _react.default.createRef();
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

  setBreakpoint(value, showStacktrace) {
    const {
      log,
      breakpoint
    } = this.props; // If breakpoint is `pending`, props will not contain a breakpoint.
    // If source is a URL without location, breakpoint will contain no generatedLocation.

    const location = breakpoint && breakpoint.generatedLocation ? breakpoint.generatedLocation : this.props.location;
    const options = breakpoint ? breakpoint.options : {};
    const type = log ? "logValue" : "condition";
    return this.props.setBreakpointOptions(location, { ...options,
      [type]: value,
      showStacktrace
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
      editor.removeLineContentMarker(editor.markerTypes.CONDITIONAL_BP_MARKER);
      this.removeBreakpointPanelEditor();
      return;
    }

    if (selectedSource.id !== location.source.id) {
      editor.removeLineContentMarker(editor.markerTypes.CONDITIONAL_BP_MARKER);
      this.removeBreakpointPanelEditor();
      return;
    }

    const line = (0, _index.toEditorLine)(location.source, location.line || 0);
    editor.setLineContentMarker({
      id: editor.markerTypes.CONDITIONAL_BP_MARKER,
      lines: [{
        line
      }],
      renderAsBlock: true,
      createLineElementNode: () => {
        // Create a Codemirror editor for the breakpoint panel
        const onEnterKeyMapConfig = {
          preventDefault: true,
          stopPropagation: true,
          run: () => this.formRef.current.requestSubmit()
        };
        const breakpointPanelEditor = (0, _createEditor.createEditor)({
          cm6: true,
          readOnly: false,
          lineNumbers: false,
          lineWrapping: true,
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
    editor.removeLineContentMarker(editor.markerTypes.CONDITIONAL_BP_MARKER);
    this.removeBreakpointPanelEditor();
  }

  componentDidMount() {
    if (this.formRef && this.formRef.current) {
      const checkbox = this.formRef.current.querySelector("#showStacktrace");

      if (checkbox) {
        checkbox.checked = this.props.breakpoint?.options?.showStacktrace;
      }
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
        if (HTMLElement.isInstance(parent) && parent.classList.contains("CodeMirror-scroll")) {
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
    const panel = document.createElement("div");
    const isWindows = Services.appinfo.OS.startsWith("WINNT");
    const isCreating = !this.props.breakpoint;
    const saveButton = (0, _reactDomFactories.button)({
      type: "submit",
      id: "save-logpoint",
      className: "devtools-button conditional-breakpoint-panel-save-button"
    }, L10N.getStr(isCreating ? "editor.conditionalPanel.create" : "editor.conditionalPanel.update"));
    const cancelButton = (0, _reactDomFactories.button)({
      type: "button",
      className: "devtools-button conditional-breakpoint-panel-cancel-button",
      onClick: () => this.props.closeConditionalPanel()
    }, L10N.getStr("editor.conditionalPanel.cancel")); // CodeMirror6 can't have margin on a block widget, so we need to wrap the actual
    // panel inside a container which won't have any margin

    const reactElPanel = (0, _reactDomFactories.div)({
      className: "conditional-breakpoint-panel-container",
      onBlur: this.onPanelBlur,
      tabIndex: -1
    }, (0, _reactDomFactories.form)({
      className: classnames("conditional-breakpoint-panel", {
        "log-point": log
      }),
      onSubmit: this.onFormSubmit,
      ref: this.formRef
    }, (0, _reactDomFactories.div)({
      className: "input-container"
    }, (0, _reactDomFactories.div)({
      className: "prompt"
    }, "»"), (0, _reactDomFactories.div)({
      className: "inline-codemirror-container",
      ref: el => this.setupAndAppendInlineEditor(el, editor)
    })), (0, _reactDomFactories.div)({
      className: "conditional-breakpoint-panel-controls"
    }, log ? (0, _reactDomFactories.label)({
      className: "conditional-breakpoint-panel-checkbox-label",
      htmlFor: "showStacktrace"
    }, (0, _reactDomFactories.input)({
      type: "checkbox",
      id: "showStacktrace",
      name: "showStacktrace",
      defaultChecked: this.props.breakpoint?.options?.showStacktrace,
      "aria-label": L10N.getStr("editor.conditionalPanel.logPoint.showStacktrace")
    }), L10N.getStr("editor.conditionalPanel.logPoint.showStacktrace")) : null, (0, _reactDomFactories.div)({
      className: "conditional-breakpoint-panel-buttons"
    }, isWindows ? saveButton : cancelButton, isWindows ? cancelButton : saveButton))));

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