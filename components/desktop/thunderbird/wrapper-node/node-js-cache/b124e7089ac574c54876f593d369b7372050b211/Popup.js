"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addHighlightToTargetSiblings = addHighlightToTargetSiblings;
exports.removeHighlightForTargetSiblings = removeHighlightForTargetSiblings;
exports.default = exports.Popup = void 0;

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

var _reactDomFactories = require("devtools/client/shared/vendor/react-dom-factories");

var _reactPropTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

var _reactRedux = require("devtools/client/shared/vendor/react-redux");

var objectInspector = _interopRequireWildcard(require("resource://devtools/client/shared/components/object-inspector/index.js"));

var _ExceptionPopup = _interopRequireDefault(require("./ExceptionPopup"));

var _index2 = _interopRequireDefault(require("../../../actions/index"));

var _Popover = _interopRequireDefault(require("../../shared/Popover"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const Reps = ChromeUtils.importESModule("resource://devtools/client/shared/components/reps/index.mjs");
const {
  REPS: {
    Grip
  },
  MODE
} = Reps;
const {
  ObjectInspector,
  utils
} = objectInspector;
const {
  node: {
    nodeIsPrimitive
  }
} = utils;

class Popup extends _react.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "calculateMaxHeight", () => {
      const {
        editorRef
      } = this.props;

      if (!editorRef) {
        return "auto";
      }

      const {
        height,
        top
      } = editorRef.getBoundingClientRect();
      const maxHeight = height + top;

      if (maxHeight < 250) {
        return maxHeight;
      }

      return 250;
    });
  }

  static get propTypes() {
    return {
      clearPreview: _reactPropTypes.default.func.isRequired,
      editorRef: _reactPropTypes.default.object.isRequired,
      highlightDomElement: _reactPropTypes.default.func.isRequired,
      openElementInInspector: _reactPropTypes.default.func.isRequired,
      openLink: _reactPropTypes.default.func.isRequired,
      preview: _reactPropTypes.default.object.isRequired,
      selectSourceURL: _reactPropTypes.default.func.isRequired,
      unHighlightDomElement: _reactPropTypes.default.func.isRequired
    };
  }

  componentDidMount() {
    this.addHighlightToToken(this.props.preview.target);
  }

  componentWillUnmount() {
    this.removeHighlightFromToken(this.props.preview.target);
  }

  componentDidUpdate(prevProps) {
    const {
      target
    } = this.props.preview;

    if (prevProps.target == target) {
      return;
    }

    this.removeHighlightFromToken(prevProps.preview.target);
    this.addHighlightToToken(target);
  }

  addHighlightToToken(target) {
    if (!target) {
      return;
    }

    target.classList.add("preview-token");
    addHighlightToTargetSiblings(target, this.props);
  }

  removeHighlightFromToken(target) {
    if (!target) {
      return;
    }

    target.classList.remove("preview-token");
    removeHighlightForTargetSiblings(target);
  }

  createElement(element) {
    return document.createElement(element);
  }

  renderExceptionPreview(exception) {
    return _react.default.createElement(_ExceptionPopup.default, {
      exception,
      mouseout: this.props.clearPreview
    });
  }

  renderPreview() {
    const {
      preview: {
        root,
        exception,
        previewType
      }
    } = this.props;
    const usesCustomFormatter = root?.contents?.value?.useCustomFormatter ?? false;

    if (exception) {
      return this.renderExceptionPreview(exception);
    }

    return (0, _reactDomFactories.div)({
      className: `preview-popup preview-type-${previewType}`,
      style: {
        maxHeight: this.calculateMaxHeight()
      }
    }, // Bug 1915610 - JS Tracer isn't localized yet
    previewType == "tracer" ? (0, _reactDomFactories.div)({
      className: "preview-tracer-header"
    }, "Tracer preview") : null, previewType == "tracer" && !nodeIsPrimitive(root) ? (0, _reactDomFactories.div)({
      className: "preview-tracer-warning"
    }, "Attribute previews on traced objects are showing the current values and not the value at execution of the selected frame.") : null, _react.default.createElement(ObjectInspector, {
      roots: [root],
      autoExpandDepth: 1,
      autoReleaseObjectActors: false,
      mode: usesCustomFormatter ? MODE.LONG : MODE.SHORT,
      disableWrap: true,
      displayRootNodeAsHeader: true,
      focusable: false,
      openLink: this.props.openLink,
      defaultRep: Grip,
      createElement: this.createElement,
      onDOMNodeClick: grip => this.props.openElementInInspector(grip),
      onInspectIconClick: grip => this.props.openElementInInspector(grip),
      onDOMNodeMouseOver: grip => this.props.highlightDomElement(grip),
      onDOMNodeMouseOut: grip => this.props.unHighlightDomElement(grip),
      mayUseCustomFormatter: true,
      onViewSourceInDebugger: ({
        url,
        line,
        column
      }) => this.props.selectSourceURL(url, {
        line,
        column
      })
    }));
  }

  getPreviewType() {
    const {
      preview: {
        root,
        exception
      }
    } = this.props;

    if (exception || nodeIsPrimitive(root)) {
      return "tooltip";
    }

    return "popover";
  }

  render() {
    const {
      preview: {
        cursorPos,
        resultGrip,
        exception
      },
      editorRef
    } = this.props;

    if (!exception && (typeof resultGrip == "undefined" || resultGrip?.optimizedOut)) {
      return null;
    }

    const type = this.getPreviewType();
    return _react.default.createElement(_Popover.default, {
      targetPosition: cursorPos,
      type,
      editorRef,
      target: this.props.preview.target,
      mouseout: this.props.clearPreview
    }, this.renderPreview());
  }

}

exports.Popup = Popup;

function addHighlightToTargetSiblings(target, props) {
  // This function searches for related tokens that should also be highlighted when previewed.
  // Here is the process:
  // It conducts a search on the target's next siblings and then another search for the previous siblings.
  // If a sibling is not an element node (nodeType === 1), the highlight is not added and the search is short-circuited.
  // If the element sibling is the same token type as the target, and is also found in the preview expression, the highlight class is added.
  const tokenType = target.classList.item(0);
  const previewExpression = props.preview.expression;

  if (tokenType && previewExpression && target.innerHTML !== previewExpression) {
    let nextSibling = target.nextSibling;
    let nextElementSibling = target.nextElementSibling; // Note: Declaring previous/next ELEMENT siblings as well because
    // properties like innerHTML can't be checked on nextSibling
    // without creating a flow error even if the node is an element type.

    while (nextSibling && nextElementSibling && nextSibling.nodeType === 1 && nextElementSibling.className.includes(tokenType) && previewExpression.includes(nextElementSibling.innerHTML)) {
      // All checks passed, add highlight and continue the search.
      nextElementSibling.classList.add("preview-token");
      nextSibling = nextSibling.nextSibling;
      nextElementSibling = nextElementSibling.nextElementSibling;
    }

    let previousSibling = target.previousSibling;
    let previousElementSibling = target.previousElementSibling;

    while (previousSibling && previousElementSibling && previousSibling.nodeType === 1 && previousElementSibling.className.includes(tokenType) && previewExpression.includes(previousElementSibling.innerHTML)) {
      // All checks passed, add highlight and continue the search.
      previousElementSibling.classList.add("preview-token");
      previousSibling = previousSibling.previousSibling;
      previousElementSibling = previousElementSibling.previousElementSibling;
    }
  }
}

function removeHighlightForTargetSiblings(target) {
  // Look at target's previous and next token siblings.
  // If they also have the highlight class 'preview-token',
  // remove that class.
  let nextSibling = target.nextElementSibling;

  while (nextSibling && nextSibling.className.includes("preview-token")) {
    nextSibling.classList.remove("preview-token");
    nextSibling = nextSibling.nextElementSibling;
  }

  let previousSibling = target.previousElementSibling;

  while (previousSibling && previousSibling.className.includes("preview-token")) {
    previousSibling.classList.remove("preview-token");
    previousSibling = previousSibling.previousElementSibling;
  }
}

const mapDispatchToProps = {
  addExpression: _index2.default.addExpression,
  selectSourceURL: _index2.default.selectSourceURL,
  openLink: _index2.default.openLink,
  openElementInInspector: _index2.default.openElementInInspectorCommand,
  highlightDomElement: _index2.default.highlightDomElement,
  unHighlightDomElement: _index2.default.unHighlightDomElement
};

var _default = (0, _reactRedux.connect)(null, mapDispatchToProps)(Popup);

exports.default = _default;