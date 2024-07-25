"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reactDomFactories = require("devtools/client/shared/vendor/react-dom-factories");

var _reactPropTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
const classnames = require("resource://devtools/client/shared/classnames.js");

const BracketArrow = ({
  orientation,
  left,
  top,
  bottom
}) => {
  return (0, _reactDomFactories.div)({
    className: classnames("bracket-arrow", orientation || "up"),
    style: {
      left,
      top,
      bottom
    }
  });
};

BracketArrow.propTypes = {
  bottom: _reactPropTypes.default.number,
  left: _reactPropTypes.default.number,
  orientation: _reactPropTypes.default.string.isRequired,
  top: _reactPropTypes.default.number
};
var _default = BracketArrow;
exports.default = _default;