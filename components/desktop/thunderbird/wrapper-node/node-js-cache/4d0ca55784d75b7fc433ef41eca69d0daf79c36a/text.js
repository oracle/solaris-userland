"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.truncateMiddleText = truncateMiddleText;

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

/**
 * Utils for keyboard command strings
 *
 * @module utils/text
 */

/**
 * Truncates the received text to the maxLength in the format:
 * Original: 'this is a very long text and ends here'
 * Truncated: 'this is a ver...and ends here'
 *
 * @param {string} sourceText - Source text
 * @param {number} maxLength - Max allowed length
 * @memberof utils/text
 * @static
 */
function truncateMiddleText(sourceText, maxLength) {
  let truncatedText = sourceText;

  if (sourceText.length > maxLength) {
    truncatedText = `${sourceText.substring(0, Math.round(maxLength / 2) - 2)}…${sourceText.substring(sourceText.length - Math.round(maxLength / 2 - 1))}`;
  }

  return truncatedText;
}