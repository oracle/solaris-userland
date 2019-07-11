"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBindingVariables = getBindingVariables;

var _lodash = require("devtools/client/shared/vendor/lodash");

// Create the tree nodes representing all the variables and arguments
// for the bindings from a scope.


// VarAndBindingsPair actually is [name: string, contents: BindingContents]


// Scope's bindings field which holds variables and arguments
function getBindingVariables(bindings, parentName) {
  if (!bindings) {
    return [];
  }

  const args = bindings.arguments.map(arg => (0, _lodash.toPairs)(arg)[0]);

  const variables = (0, _lodash.toPairs)(bindings.variables);

  return args.concat(variables).map(binding => {
    const name = binding[0];
    const contents = binding[1];
    return {
      name,
      path: `${parentName}/${name}`,
      contents
    };
  });
} /* eslint max-nested-callbacks: ["error", 4] */

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */