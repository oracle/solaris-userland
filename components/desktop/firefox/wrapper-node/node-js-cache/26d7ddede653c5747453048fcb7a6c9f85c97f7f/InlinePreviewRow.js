"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

var _reactDom = _interopRequireDefault(require("devtools/client/shared/vendor/react-dom"));

var _actions = _interopRequireDefault(require("../../actions/index"));

var _assert = _interopRequireDefault(require("../../utils/assert"));

loader.lazyRequireGetter(this, "_connect", "devtools/client/debugger/src/utils/connect");

var _InlinePreview = _interopRequireDefault(require("./InlinePreview"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
// Handles rendering for each line ( row )
// * Renders single widget for each line in codemirror
// * Renders InlinePreview for each preview inside the widget
class InlinePreviewRow extends _react.PureComponent {
  componentDidMount() {
    this.updatePreviewWidget(this.props, null);
  }

  componentDidUpdate(prevProps) {
    this.updatePreviewWidget(this.props, prevProps);
  }

  componentWillUnmount() {
    this.updatePreviewWidget(null, this.props);
  }

  updatePreviewWidget(props, prevProps) {
    if (this.bookmark && prevProps && (!props || prevProps.editor !== props.editor || prevProps.line !== props.line)) {
      this.bookmark.clear();
      this.bookmark = null;
      this.widgetNode = null;
    }

    if (!props) {
      return (0, _assert.default)(!this.bookmark, "Inline Preview widget shouldn't be present.");
    }

    const {
      editor,
      line,
      previews,
      openElementInInspector,
      highlightDomElement,
      unHighlightDomElement
    } = props;

    if (!this.bookmark) {
      this.widgetNode = document.createElement("div");
      this.widgetNode.classList.add("inline-preview");
    }

    _reactDom.default.render(_react.default.createElement(_react.default.Fragment, null, previews.map(preview => _react.default.createElement(_InlinePreview.default, {
      line: line,
      key: `${line}-${preview.name}`,
      variable: preview.name,
      value: preview.value,
      openElementInInspector: openElementInInspector,
      highlightDomElement: highlightDomElement,
      unHighlightDomElement: unHighlightDomElement
    }))), this.widgetNode);

    this.bookmark = editor.codeMirror.setBookmark({
      line,
      ch: Infinity
    }, this.widgetNode);
  }

  render() {
    return null;
  }

}

var _default = (0, _connect.connect)(() => ({}), {
  openElementInInspector: _actions.default.openElementInInspectorCommand,
  highlightDomElement: _actions.default.highlightDomElement,
  unHighlightDomElement: _actions.default.unHighlightDomElement
})(InlinePreviewRow);

exports.default = _default;