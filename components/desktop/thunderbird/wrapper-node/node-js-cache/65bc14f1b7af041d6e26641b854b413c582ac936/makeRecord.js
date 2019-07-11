"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _immutable = require("devtools/client/shared/vendor/immutable");

var I = _interopRequireWildcard(_immutable);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * Make an immutable record type
 *
 * @param spec - the keys and their default values
 * @return a state record factory function
 * @memberof utils/makeRecord
 * @static
 */


/**
 * @memberof utils/makeRecord
 * @static
 */
function makeRecord(spec) {
  return I.Record(spec);
} /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

/**
 * When Flow 0.29 is released (very soon), we can use this Record type
 * instead of the builtin immutable.js Record type. This is better
 * because all the fields are actually typed, unlike the builtin one.
 * This depends on a performance fix that will go out in 0.29 though;
 * @module utils/makeRecord
 */

exports.default = makeRecord;