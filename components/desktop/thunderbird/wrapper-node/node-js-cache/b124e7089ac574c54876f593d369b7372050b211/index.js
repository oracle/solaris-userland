"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reactPropTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

var _reactRedux = require("devtools/client/shared/vendor/react-redux");

var _Popup = _interopRequireDefault(require("./Popup"));

loader.lazyRequireGetter(this, "_index", "devtools/client/debugger/src/selectors/index");

var _index2 = _interopRequireDefault(require("../../../actions/index"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const EXCEPTION_MARKER = "mark-text-exception";
const LOADING_CLASS = "preview-loading-token";

class Preview extends _react.PureComponent {
  constructor(props) {
    super(props);

    _defineProperty(this, "target", null);

    _defineProperty(this, "onTokenEnter", async ({
      target,
      tokenPos
    }) => {
      // Use a temporary object to uniquely identify the asynchronous processing of this user event
      // and bail out if we started hovering another token.
      const tokenId = {};
      this.currentTokenId = tokenId; // Immediately highlight the hovered token as "loading"

      this.setState({
        loading: target
      });
      const {
        editor,
        getPausedPreview,
        getTracerPreview,
        getExceptionPreview,
        isPaused,
        hasSelectedTrace
      } = this.props;
      const isTargetException = target.closest(`.${EXCEPTION_MARKER}`);
      let preview;

      try {
        if (isTargetException) {
          preview = await getExceptionPreview(target, tokenPos, editor);
        }

        if (!preview && (hasSelectedTrace || isPaused) && !this.state.selecting) {
          if (hasSelectedTrace) {
            preview = await getTracerPreview(target, tokenPos, editor);
          }

          if (!preview && isPaused) {
            preview = await getPausedPreview(target, tokenPos, editor);
          }
        }
      } catch (e) {} // Ignore any exception and dismiss the popup (as preview will be null)
      // Prevent modifying state and showing this preview if we started hovering another token


      if (this.currentTokenId !== tokenId) {
        return;
      }

      this.setState({
        loading: null,
        preview
      });
    });

    _defineProperty(this, "onMouseUp", () => {
      if (this.props.isPaused || this.props.hasSelectedTrace) {
        this.setState({
          selecting: false
        });
      }
    });

    _defineProperty(this, "onMouseDown", () => {
      if (this.props.isPaused || this.props.hasSelectedTrace) {
        this.setState({
          selecting: true
        });
      }
    });

    _defineProperty(this, "onScroll", () => {
      if (this.props.isPaused || this.props.hasSelectedTrace) {
        this.clearPreview();
      }
    });

    _defineProperty(this, "clearPreview", () => {
      this.setState({
        loading: null,
        preview: null
      });
    });

    this.state = {
      selecting: false,
      loading: null
    };
  }

  static get propTypes() {
    return {
      editor: _reactPropTypes.default.object.isRequired,
      editorRef: _reactPropTypes.default.object.isRequired,
      isPaused: _reactPropTypes.default.bool.isRequired,
      hasSelectedTrace: _reactPropTypes.default.bool.isRequired,
      getExceptionPreview: _reactPropTypes.default.func.isRequired,
      getPreview: _reactPropTypes.default.func
    };
  }

  componentDidMount() {
    this.props.editor.on("tokenenter", this.onTokenEnter);
    this.props.editor.addEditorDOMEventListeners({
      mouseup: this.onMouseUp,
      mousedown: this.onMouseDown,
      scroll: this.onScroll
    });
  }

  componentWillUnmount() {
    this.props.editor.off("tokenenter", this.onTokenEnter);
    this.props.editor.removeEditorDOMEventListeners({
      mouseup: this.onMouseUp,
      mousedown: this.onMouseDown,
      scroll: this.onScroll
    });
  }

  componentDidUpdate(_prevProps, prevState) {
    // Ensure that only one token is highlighted as "loading"
    const previous = prevState.loading;

    if (previous) {
      previous.classList.remove(LOADING_CLASS);
    }

    const {
      loading
    } = this.state;

    if (loading) {
      loading.classList.add(LOADING_CLASS);
    }
  } // Note that these events are emitted by utils/editor/tokens.js


  render() {
    if (this.state.selecting) {
      return null;
    }

    const {
      preview
    } = this.state;

    if (!preview) {
      return null;
    }

    return _react.default.createElement(_Popup.default, {
      preview,
      editor: this.props.editor,
      editorRef: this.props.editorRef,
      clearPreview: this.clearPreview
    });
  }

}

const mapStateToProps = state => {
  return {
    isPaused: (0, _index.getIsCurrentThreadPaused)(state),
    hasSelectedTrace: (0, _index.getSelectedTraceIndex)(state) != null
  };
};

var _default = (0, _reactRedux.connect)(mapStateToProps, {
  addExpression: _index2.default.addExpression,
  getPausedPreview: _index2.default.getPausedPreview,
  getTracerPreview: _index2.default.getTracerPreview,
  getExceptionPreview: _index2.default.getExceptionPreview
})(Preview);

exports.default = _default;