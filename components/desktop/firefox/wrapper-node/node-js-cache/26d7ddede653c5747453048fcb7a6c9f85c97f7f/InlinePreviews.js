"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

var _InlinePreviewRow = _interopRequireDefault(require("./InlinePreviewRow"));

loader.lazyRequireGetter(this, "_connect", "devtools/client/debugger/src/utils/connect");
loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
function hasPreviews(previews) {
  return !!previews && Object.keys(previews).length > 0;
}

class InlinePreviews extends _react.Component {
  shouldComponentUpdate({
    previews
  }) {
    return hasPreviews(previews);
  }

  render() {
    const {
      editor,
      selectedFrame,
      selectedSource,
      previews
    } = this.props; // Render only if currently open file is the one where debugger is paused

    if (!selectedFrame || selectedFrame.location.sourceId !== selectedSource.id || !hasPreviews(previews)) {
      return null;
    }

    const previewsObj = previews;
    let inlinePreviewRows;
    editor.codeMirror.operation(() => {
      inlinePreviewRows = Object.keys(previewsObj).map(line => {
        const lineNum = parseInt(line, 10);
        return _react.default.createElement(_InlinePreviewRow.default, {
          editor: editor,
          key: line,
          line: lineNum,
          previews: previewsObj[line]
        });
      });
    });
    return _react.default.createElement("div", null, inlinePreviewRows);
  }

}

const mapStateToProps = state => {
  const thread = (0, _selectors.getCurrentThread)(state);
  const selectedFrame = (0, _selectors.getSelectedFrame)(state, thread);

  if (!selectedFrame) {
    return {
      selectedFrame: null,
      previews: null
    };
  }

  return {
    selectedFrame,
    previews: (0, _selectors.getInlinePreviews)(state, thread, selectedFrame.id)
  };
};

var _default = (0, _connect.connect)(mapStateToProps)(InlinePreviews);

exports.default = _default;