"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

var _reactDom = _interopRequireDefault(require("devtools/client/shared/vendor/react-dom"));

var _index = _interopRequireDefault(require("../../actions/index"));

var _reactPropTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

var _InlinePreview = _interopRequireDefault(require("./InlinePreview"));

var _reactRedux = require("devtools/client/shared/vendor/react-redux");

loader.lazyRequireGetter(this, "_index2", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_constants", "devtools/client/debugger/src/constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
function hasPreviews(previews) {
  return !!previews && !!Object.keys(previews).length;
}

class InlinePreviews extends _react.Component {
  static get propTypes() {
    return {
      editor: _reactPropTypes.default.object.isRequired,
      previews: _reactPropTypes.default.object
    };
  }

  componentDidMount() {
    this.renderInlinePreviewMarker();
  }

  componentDidUpdate() {
    this.renderInlinePreviewMarker();
  }

  renderInlinePreviewMarker() {
    const {
      editor,
      previews,
      openElementInInspector,
      highlightDomElement,
      unHighlightDomElement
    } = this.props;

    if (!previews) {
      editor.removeLineContentMarker(_constants.markerTypes.INLINE_PREVIEW_MARKER);
      return;
    }

    editor.setLineContentMarker({
      id: _constants.markerTypes.INLINE_PREVIEW_MARKER,
      lines: Object.keys(previews).map(line => {
        // CM6 line is 1-based.
        // The preview keys line numbers as strings so cast to number to avoid string concatenation
        line = Number(line);
        return {
          line: line + 1,
          value: previews[line]
        };
      }),
      createLineElementNode: (line, value) => {
        const widgetNode = document.createElement("div");
        widgetNode.className = "inline-preview";

        _reactDom.default.render(_react.default.createElement(_react.default.Fragment, null, value.map(preview => _react.default.createElement(_InlinePreview.default, {
          line,
          key: `${line}-${preview.name}`,
          type: preview.type,
          variable: preview.name,
          value: preview.value,
          openElementInInspector,
          highlightDomElement,
          unHighlightDomElement
        }))), widgetNode);

        return widgetNode;
      }
    });
  }

  componentWillUnmount() {
    this.props.editor.removeLineContentMarker(_constants.markerTypes.INLINE_PREVIEW_MARKER);
  }

  render() {
    return null;
  }

}

const mapStateToProps = state => {
  const previews = (0, _index2.getInlinePreviews)(state);

  if (!hasPreviews(previews)) {
    return {
      previews: null
    };
  }

  return {
    previews
  };
};

var _default = (0, _reactRedux.connect)(mapStateToProps, {
  openElementInInspector: _index.default.openElementInInspectorCommand,
  highlightDomElement: _index.default.highlightDomElement,
  unHighlightDomElement: _index.default.unHighlightDomElement
})(InlinePreviews);

exports.default = _default;