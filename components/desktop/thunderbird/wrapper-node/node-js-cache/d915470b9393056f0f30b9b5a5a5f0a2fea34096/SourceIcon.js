"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("devtools/client/shared/vendor/react");

var _react2 = _interopRequireDefault(_react);

var _connect = require("../../utils/connect");

var _AccessibleImage = require("./AccessibleImage");

var _AccessibleImage2 = _interopRequireDefault(_AccessibleImage);

var _source = require("../../utils/source");

var _tabs = require("../../utils/tabs");

var _selectors = require("../../selectors/index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

class SourceIcon extends _react.PureComponent {
  render() {
    const { shouldHide, source, symbols, framework } = this.props;
    const iconClass = framework ? framework.toLowerCase() : (0, _source.getSourceClassnames)(source, symbols);

    if (shouldHide && shouldHide(iconClass)) {
      return null;
    }

    return _react2.default.createElement(_AccessibleImage2.default, { className: `source-icon ${iconClass}` });
  }
}

exports.default = (0, _connect.connect)((state, props) => {
  return {
    symbols: (0, _selectors.getSymbols)(state, props.source),
    framework: (0, _tabs.getFramework)((0, _selectors.getTabs)(state), props.source.url)
  };
})(SourceIcon);