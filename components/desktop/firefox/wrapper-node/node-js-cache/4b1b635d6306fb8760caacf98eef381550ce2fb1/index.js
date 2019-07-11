"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("devtools/client/shared/vendor/react");

var _react2 = _interopRequireDefault(_react);

var _connect = require("../../../utils/connect");

var _Popup = require("./Popup");

var _Popup2 = _interopRequireDefault(_Popup);

var _selectors = require("../../../selectors/index");

var _actions = require("../../../actions/index");

var _actions2 = _interopRequireDefault(_actions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getElementFromPos(pos) {
  // We need to use element*s*AtPoint because the tooltip overlays
  // the token and thus an undesirable element may be returned
  const elementsAtPoint = [
  // $FlowIgnore
  ...document.elementsFromPoint(pos.x + pos.width / 2, pos.y + pos.height / 2)];

  return elementsAtPoint.find(el => el.className.startsWith("cm-"));
} /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

class Preview extends _react.PureComponent {
  constructor(props) {
    super(props);
    this.target = null;

    this.onTokenEnter = ({ target, tokenPos }) => {
      const { cx, editor, updatePreview, preview } = this.props;

      if (cx.isPaused || !preview || target !== preview.target) {
        updatePreview(cx, target, tokenPos, editor.codeMirror);
      }
    };

    this.onScroll = () => {
      if (this.props.cx.isPaused) {
        this.props.clearPreview(this.props.cx);
      }
    };

    this.onMouseUp = () => {
      if (this.props.cx.isPaused) {
        this.setState({ selecting: false });
        return true;
      }
    };

    this.onMouseDown = () => {
      if (this.props.cx.isPaused) {
        this.setState({ selecting: true });
        return true;
      }
    };

    this.state = { selecting: false };
  }

  componentDidMount() {
    this.updateListeners();
  }

  componentWillUnmount() {
    const { codeMirror } = this.props.editor;
    const codeMirrorWrapper = codeMirror.getWrapperElement();

    codeMirror.off("tokenenter", this.onTokenEnter);
    codeMirror.off("scroll", this.onScroll);
    codeMirrorWrapper.removeEventListener("mouseup", this.onMouseUp);
    codeMirrorWrapper.removeEventListener("mousedown", this.onMouseDown);
  }

  componentDidUpdate(prevProps) {
    this.updateHighlight(prevProps);
  }

  updateListeners(prevProps) {
    const { codeMirror } = this.props.editor;
    const codeMirrorWrapper = codeMirror.getWrapperElement();
    codeMirror.on("tokenenter", this.onTokenEnter);
    codeMirror.on("scroll", this.onScroll);
    codeMirrorWrapper.addEventListener("mouseup", this.onMouseUp);
    codeMirrorWrapper.addEventListener("mousedown", this.onMouseDown);
  }

  updateHighlight(prevProps) {
    const { preview } = this.props;

    if (preview && preview.target.matches(":hover")) {
      const target = getElementFromPos(preview.cursorPos);
      target && target.classList.add("preview-selection");
    }

    if (prevProps.preview && prevProps.preview !== preview) {
      const target = getElementFromPos(prevProps.preview.cursorPos);
      target && target.classList.remove("preview-selection");
    }
  }

  render() {
    const { preview } = this.props;
    if (!preview || this.state.selecting) {
      return null;
    }

    return _react2.default.createElement(_Popup2.default, {
      preview: preview,
      editor: this.props.editor,
      editorRef: this.props.editorRef
    });
  }
}

const mapStateToProps = state => ({
  cx: (0, _selectors.getThreadContext)(state),
  preview: (0, _selectors.getPreview)(state)
});

exports.default = (0, _connect.connect)(mapStateToProps, {
  clearPreview: _actions2.default.clearPreview,
  addExpression: _actions2.default.addExpression,
  updatePreview: _actions2.default.updatePreview
})(Preview);