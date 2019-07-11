"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.memoizeableAction = memoizeableAction;


/*
 * memoizableActon is a utility for actions that should only be performed
 * once per key. It is useful for loading sources, parsing symbols ...
 *
 * @exitEarly - if true, do not attempt to perform the action
 * @hasValue - checks to see if the result is in the redux store
 * @getValue - gets the result from the redux store
 * @createKey - creates a key for the requests map
 * @action - kicks off the async work for the action
 *
 *
 * For Example
 *
 * export const setItem = memoizeableAction(
 *   "setItem",
 *   {
 *     hasValue: ({ a }, { getState }) => hasItem(getState(), a),
 *     getValue: ({ a }, { getState }) => getItem(getState(), a),
 *     createKey: ({ a }) => a,
 *     action: ({ a }, thunkArgs) => doSetItem(a, thunkArgs)
 *   }
 * );
 *
 */
function memoizeableAction(name, {
  hasValue,
  getValue,
  createKey,
  action,
  exitEarly
}) {
  const requests = new Map();
  return args => async thunkArgs => {
    if (exitEarly && exitEarly(args, thunkArgs)) {
      return;
    }

    if (hasValue(args, thunkArgs)) {
      return getValue(args, thunkArgs);
    }

    const key = createKey(args, thunkArgs);
    if (!requests.has(key)) {
      requests.set(key, (async () => {
        try {
          await action(args, thunkArgs);
        } catch (e) {
          console.warn(`Action ${name} had an exception:`, e);
        } finally {
          requests.delete(key);
        }
      })());
    }

    await requests.get(key);
    return getValue(args, thunkArgs);
  };
} /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */