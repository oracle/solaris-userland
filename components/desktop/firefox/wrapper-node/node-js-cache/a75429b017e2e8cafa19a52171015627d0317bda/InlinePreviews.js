"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

var _reactDom = _interopRequireDefault(require("devtools/client/shared/vendor/react-dom"));

var _index = _interopRequireDefault(require("../../actions/index"));

var _reactDomFactories = require("devtools/client/shared/vendor/react-dom-factories");

var _reactPropTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

var _InlinePreviewRow = _interopRequireDefault(require("./InlinePreviewRow"));

var _InlinePreview = _interopRequireDefault(require("./InlinePreview"));

var _reactRedux = require("devtools/client/shared/vendor/react-redux");

loader.lazyRequireGetter(this, "_index2", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_prefs", "devtools/client/debugger/src/utils/prefs");

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
      previews: _reactPropTypes.default.object,
      selectedFrame: _reactPropTypes.default.object.isRequired,
      selectedSource: _reactPropTypes.default.object.isRequired
    };
  }

  shouldComponentUpdate({
    previews
  }) {
    return hasPreviews(previews);
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
      selectedFrame,
      selectedSource,
      previews,
      openElementInInspector,
      highlightDomElement,
      unHighlightDomElement
    } = this.props;

    if (!_prefs.features.codemirrorNext) {
      return;
    }

    if (!editor || !selectedFrame || selectedFrame.location.source.id !== selectedSource.id || !hasPreviews(previews)) {
      editor.removeLineContentMarker("inline-preview-marker");
      return;
    }

    editor.setLineContentMarker({
      id: "inline-preview-marker",
      condition: line => {
        // CM6 line is 1-based unlike CM5 which is 0-based.
        return !!previews[line - 1];
      },
      createLineElementNode: line => {
        const widgetNode = document.createElement("div");
        widgetNode.className = "inline-preview";

        _reactDom.default.render(_react.default.createElement(_react.default.Fragment, null, previews[line - 1].map(preview => _react.default.createElement(_InlinePreview.default, {
          line,
          key: `${line}-${preview.name}`,
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
    if (!_prefs.features.codemirrorNext) {
      return;
    }

    this.props.editor.removeLineContentMarker("inline-preview-marker");
  }

  render() {
    const {
      editor,
      selectedFrame,
      selectedSource,
      previews
    } = this.props;

    if (_prefs.features.codemirrorNext) {
      return null;
    } // Render only if currently open file is the one where debugger is paused


    if (!selectedFrame || selectedFrame.location.source.id !== selectedSource.id || !hasPreviews(previews)) {
      return null;
    }

    const previewsObj = previews;
    let inlinePreviewRows;
    editor.codeMirror.operation(() => {
      inlinePreviewRows = Object.keys(previewsObj).map(line => {
        const lineNum = parseInt(line, 10);
        return _react.default.createElement(_InlinePreviewRow.default, {
          editor,
          key: line,
          line: lineNum,
          previews: previewsObj[line]
        });
      });
    });
    return (0, _reactDomFactories.div)(null, inlinePreviewRows);
  }

}

const mapStateToProps = state => {
  const thread = (0, _index2.getCurrentThread)(state);
  const selectedFrame = (0, _index2.getSelectedFrame)(state, thread);

  if (!selectedFrame) {
    return {
      selectedFrame: null,
      previews: null
    };
  }

  return {
    selectedFrame,
    previews: (0, _index2.getInlinePreviews)(state, thread, selectedFrame.id)
  };
};

var _default = (0, _reactRedux.connect)(mapStateToProps, {
  openElementInInspector: _index.default.openElementInInspectorCommand,
  highlightDomElement: _index.default.highlightDomElement,
  unHighlightDomElement: _index.default.unHighlightDomElement
})(InlinePreviews);

exports.default = _default;