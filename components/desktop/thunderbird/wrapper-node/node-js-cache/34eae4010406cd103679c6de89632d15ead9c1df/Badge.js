"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("devtools/client/shared/vendor/react"));

var _reactPropTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
class Badge extends _react.default.Component {
  constructor(props) {
    super(props);
  }

  static get propTypes() {
    return {
      badgeText: _reactPropTypes.default.node.isRequired
    };
  }

  render() {
    return _react.default.createElement("span", {
      className: "badge text-white text-center"
    }, this.props.badgeText);
  }

}

var _default = Badge;
exports.default = _default;