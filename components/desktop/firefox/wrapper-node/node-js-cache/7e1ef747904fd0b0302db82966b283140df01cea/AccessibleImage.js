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
const classnames = require("resource://devtools/client/shared/classnames.js");

const AccessibleImage = props => {
  return _react.default.createElement("span", { ...props,
    className: classnames("img", props.className)
  });
};

AccessibleImage.propTypes = {
  className: _reactPropTypes.default.string.isRequired
};
var _default = AccessibleImage;
exports.default = _default;