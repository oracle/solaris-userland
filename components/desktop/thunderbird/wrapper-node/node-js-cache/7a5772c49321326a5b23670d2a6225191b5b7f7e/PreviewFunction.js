"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = require("devtools/client/shared/vendor/react");

var _reactDomFactories = require("devtools/client/shared/vendor/react-dom-factories");

var _reactPropTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

loader.lazyRequireGetter(this, "_index", "devtools/client/debugger/src/utils/pause/frames/index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
const IGNORED_SOURCE_URLS = ["debugger eval code"];

class PreviewFunction extends _react.Component {
  static get propTypes() {
    return {
      func: _reactPropTypes.default.object.isRequired
    };
  }

  renderFunctionName(func) {
    const {
      l10n
    } = this.context;
    const name = (0, _index.formatDisplayName)(func, undefined, l10n);
    return (0, _reactDomFactories.span)({
      className: "function-name"
    }, name);
  }

  renderParams(func) {
    const {
      parameterNames = []
    } = func;
    return parameterNames.filter(Boolean).map((param, i, arr) => {
      const elements = [(0, _reactDomFactories.span)({
        className: "param",
        key: param
      }, param)]; // if this isn't the last param, add a comma

      if (i !== arr.length - 1) {
        elements.push((0, _reactDomFactories.span)({
          className: "delimiter",
          key: i
        }, ", "));
      }

      return elements;
    }).flat();
  }

  jumpToDefinitionButton(func) {
    const {
      location
    } = func;

    if (!location?.url || IGNORED_SOURCE_URLS.includes(location.url)) {
      return null;
    }

    const lastIndex = location.url.lastIndexOf("/");
    return (0, _reactDomFactories.button)({
      className: "jump-definition",
      draggable: "false",
      title: `${location.url.slice(lastIndex + 1)}:${location.line}`
    });
  }

  render() {
    const {
      func
    } = this.props;
    return (0, _reactDomFactories.span)({
      className: "function-signature"
    }, this.renderFunctionName(func), (0, _reactDomFactories.span)({
      className: "paren"
    }, "("), this.renderParams(func), (0, _reactDomFactories.span)({
      className: "paren"
    }, ")"), this.jumpToDefinitionButton(func));
  }

}

exports.default = PreviewFunction;
PreviewFunction.contextTypes = {
  l10n: _reactPropTypes.default.object
};