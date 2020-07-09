"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toggleJavaScriptEnabled = toggleJavaScriptEnabled;
exports.setupCommands = setupCommands;
exports.clientCommands = void 0;
loader.lazyRequireGetter(this, "_create", "devtools/client/debugger/src/client/firefox/create");
loader.lazyRequireGetter(this, "_targets", "devtools/client/debugger/src/client/firefox/targets");
loader.lazyRequireGetter(this, "_events", "devtools/client/debugger/src/client/firefox/events");

var _devtoolsReps = _interopRequireDefault(require("devtools/client/shared/components/reps/reps.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
let targets;
let devToolsClient;
let targetList;
let sourceActors;
let breakpoints;
let eventBreakpoints;
const CALL_STACK_PAGE_SIZE = 1000;

function setupCommands(dependencies) {
  devToolsClient = dependencies.devToolsClient;
  targetList = dependencies.targetList;
  targets = {};
  sourceActors = {};
  breakpoints = {};
}

function currentTarget() {
  return targetList.targetFront;
}

function currentThreadFront() {
  return currentTarget().threadFront;
}

function createObjectFront(grip) {
  if (!grip.actor) {
    throw new Error("Actor is missing");
  }

  return devToolsClient.createObjectFront(grip, currentThreadFront());
}

async function loadObjectProperties(root) {
  const {
    utils
  } = _devtoolsReps.default.objectInspector;
  const properties = await utils.loadProperties.loadItemProperties(root, devToolsClient);
  return utils.node.getChildren({
    item: root,
    loadedProperties: new Map([[root.path, properties]])
  });
}

function releaseActor(actor) {
  if (!actor) {
    return;
  }

  const objFront = devToolsClient.getFrontByID(actor);

  if (objFront) {
    return objFront.release().catch(() => {});
  }
}

function sendPacket(packet) {
  return devToolsClient.request(packet);
} // Get a copy of the current targets.


function getTargetsMap() {
  return Object.assign({}, targets);
}

function lookupTarget(thread) {
  if (thread == currentThreadFront().actor) {
    return currentTarget();
  }

  const targetsMap = getTargetsMap();

  if (!targetsMap[thread]) {
    throw new Error(`Unknown thread front: ${thread}`);
  }

  return targetsMap[thread];
}

function lookupThreadFront(thread) {
  const target = lookupTarget(thread);
  return target.threadFront;
}

function listThreadFronts() {
  const list = Object.values(getTargetsMap());
  return list.map(target => target.threadFront).filter(t => !!t);
}

function forEachThread(iteratee) {
  // We have to be careful here to atomically initiate the operation on every
  // thread, with no intervening await. Otherwise, other code could run and
  // trigger additional thread operations. Requests on server threads will
  // resolve in FIFO order, and this could result in client and server state
  // going out of sync.
  const promises = [currentThreadFront(), ...listThreadFronts()].map( // If a thread shuts down while sending the message then it will
  // throw. Ignore these exceptions.
  t => iteratee(t).catch(e => console.log(e)));
  return Promise.all(promises);
}

function resume(thread, frameId) {
  return lookupThreadFront(thread).resume();
}

function stepIn(thread, frameId) {
  return lookupThreadFront(thread).stepIn(frameId);
}

function stepOver(thread, frameId) {
  return lookupThreadFront(thread).stepOver(frameId);
}

function stepOut(thread, frameId) {
  return lookupThreadFront(thread).stepOut(frameId);
}

function breakOnNext(thread) {
  return lookupThreadFront(thread).breakOnNext();
}

async function sourceContents({
  actor,
  thread
}) {
  const sourceThreadFront = lookupThreadFront(thread);
  const sourceFront = sourceThreadFront.source({
    actor
  });
  const {
    source,
    contentType
  } = await sourceFront.source();
  return {
    source,
    contentType
  };
}

function setXHRBreakpoint(path, method) {
  return currentThreadFront().setXHRBreakpoint(path, method);
}

function removeXHRBreakpoint(path, method) {
  return currentThreadFront().removeXHRBreakpoint(path, method);
}

function toggleJavaScriptEnabled(enabled) {
  return currentTarget().reconfigure({
    options: {
      javascriptEnabled: enabled
    }
  });
}

function addWatchpoint(object, property, label, watchpointType) {
  if (currentTarget().traits.watchpoints) {
    const objectFront = createObjectFront(object);
    return objectFront.addWatchpoint(property, label, watchpointType);
  }
}

async function removeWatchpoint(object, property) {
  if (currentTarget().traits.watchpoints) {
    const objectFront = createObjectFront(object);
    await objectFront.removeWatchpoint(property);
  }
} // Get the string key to use for a breakpoint location.
// See also duplicate code in breakpoint-actor-map.js :(


function locationKey(location) {
  const {
    sourceUrl,
    line,
    column
  } = location;
  const sourceId = location.sourceId || ""; // $FlowIgnore

  return `${sourceUrl}:${sourceId}:${line}:${column}`;
}

function hasBreakpoint(location) {
  return !!breakpoints[locationKey(location)];
}

function setBreakpoint(location, options) {
  breakpoints[locationKey(location)] = {
    location,
    options
  };
  return forEachThread(thread => thread.setBreakpoint(location, options));
}

function removeBreakpoint(location) {
  delete breakpoints[locationKey(location)];
  return forEachThread(thread => thread.removeBreakpoint(location));
}

function evaluateInFrame(script, options) {
  return evaluate(script, options);
}

async function evaluateExpressions(scripts, options) {
  return Promise.all(scripts.map(script => evaluate(script, options)));
}

async function evaluate(script, {
  thread,
  frameId
} = {}) {
  const params = {
    thread,
    frameActor: frameId
  };

  if (!currentTarget() || !script) {
    return {
      result: null
    };
  }

  const target = thread ? lookupTarget(thread) : currentTarget();
  const consoleFront = await target.getFront("console");

  if (!consoleFront) {
    return {
      result: null
    };
  }

  return consoleFront.evaluateJSAsync(script, params);
}

async function autocomplete(input, cursor, frameId) {
  if (!currentTarget() || !input) {
    return {};
  }

  const consoleFront = await currentTarget().getFront("console");

  if (!consoleFront) {
    return {};
  }

  return new Promise(resolve => {
    consoleFront.autocomplete(input, cursor, result => resolve(result), frameId);
  });
}

function navigate(url) {
  return currentTarget().navigateTo({
    url
  });
}

function reload() {
  return currentTarget().reload();
}

function getProperties(thread, grip) {
  const objClient = lookupThreadFront(thread).pauseGrip(grip);
  return objClient.getPrototypeAndProperties().then(resp => {
    const {
      ownProperties,
      safeGetterValues
    } = resp;

    for (const name in safeGetterValues) {
      const {
        enumerable,
        writable,
        getterValue
      } = safeGetterValues[name];
      ownProperties[name] = {
        enumerable,
        writable,
        value: getterValue
      };
    }

    return resp;
  });
}

async function getFrames(thread) {
  const threadFront = lookupThreadFront(thread);
  const response = await threadFront.getFrames(0, CALL_STACK_PAGE_SIZE);
  return response.frames.map((frame, i) => (0, _create.createFrame)(thread, frame, i));
}

async function getFrameScopes(frame) {
  const frameFront = lookupThreadFront(frame.thread).get(frame.id);
  return frameFront.getEnvironment();
}

function pauseOnExceptions(shouldPauseOnExceptions, shouldPauseOnCaughtExceptions) {
  return forEachThread(thread => thread.pauseOnExceptions(shouldPauseOnExceptions, // Providing opposite value because server
  // uses "shouldIgnoreCaughtExceptions"
  !shouldPauseOnCaughtExceptions));
}

async function blackBox(sourceActor, isBlackBoxed, range) {
  const sourceFront = currentThreadFront().source({
    actor: sourceActor.actor
  });

  if (isBlackBoxed) {
    await sourceFront.unblackBox(range);
  } else {
    await sourceFront.blackBox(range);
  }
}

function setSkipPausing(shouldSkip) {
  return forEachThread(thread => thread.skipBreakpoints(shouldSkip));
}

function interrupt(thread) {
  return lookupThreadFront(thread).interrupt();
}

function setEventListenerBreakpoints(ids) {
  eventBreakpoints = ids;
  return forEachThread(thread => thread.setActiveEventBreakpoints(ids));
} // eslint-disable-next-line


async function getEventListenerBreakpointTypes() {
  let categories;

  try {
    categories = await currentThreadFront().getAvailableEventBreakpoints();

    if (!Array.isArray(categories)) {
      // When connecting to older browser that had our placeholder
      // implementation of the 'getAvailableEventBreakpoints' endpoint, we
      // actually get back an object with a 'value' property containing
      // the categories. Since that endpoint wasn't actually backed with a
      // functional implementation, we just bail here instead of storing the
      // 'value' property into the categories.
      categories = null;
    }
  } catch (err) {// Event bps aren't supported on this firefox version.
  }

  return categories || [];
}

function pauseGrip(thread, func) {
  return lookupThreadFront(thread).pauseGrip(func);
}

function registerSourceActor(sourceActorId, sourceId) {
  sourceActors[sourceActorId] = sourceId;
}

async function getSources(client) {
  const {
    sources
  } = await client.getSources();
  return sources.map(source => (0, _create.prepareSourcePayload)(client, source));
}

async function toggleEventLogging(logEventBreakpoints) {
  return forEachThread(thread => thread.toggleEventLogging(logEventBreakpoints));
}

function getAllThreadFronts() {
  const fronts = [currentThreadFront()];

  for (const {
    threadFront
  } of Object.values(targets)) {
    fronts.push(threadFront);
  }

  return fronts;
} // Fetch the sources for all the targets


async function fetchSources() {
  let sources = [];

  for (const threadFront of getAllThreadFronts()) {
    sources = sources.concat((await getSources(threadFront)));
  }

  return sources;
}

async function fetchThreadSources(thread) {
  return getSources(lookupThreadFront(thread));
} // Check if any of the targets were paused before we opened
// the debugger. If one is paused. Fake a `pause` RDP event
// by directly calling the client event listener.


async function checkIfAlreadyPaused() {
  for (const threadFront of getAllThreadFronts()) {
    const pausedPacket = threadFront.getLastPausePacket();

    if (pausedPacket) {
      _events.clientEvents.paused(threadFront, pausedPacket);
    }
  }
}

function getSourceForActor(actor) {
  if (!sourceActors[actor]) {
    throw new Error(`Unknown source actor: ${actor}`);
  }

  return sourceActors[actor];
}

async function fetchThreads() {
  const options = {
    breakpoints,
    eventBreakpoints,
    observeAsmJS: true
  };
  await (0, _targets.updateTargets)({
    devToolsClient,
    targets,
    options,
    targetList
  }); // eslint-disable-next-line

  return Object.entries(targets).map(([actor, target]) => (0, _create.createThread)(actor, target));
}

async function attachThread(targetFront) {
  const options = {
    breakpoints,
    eventBreakpoints,
    observeAsmJS: true
  };
  await (0, _targets.attachTarget)(targetFront, targets, options);
  const threadFront = await targetFront.getFront("thread");
  return (0, _create.createThread)(threadFront.actorID, targetFront);
}

function getMainThread() {
  return currentThreadFront().actor;
}

async function getSourceActorBreakpointPositions({
  thread,
  actor
}, range) {
  const sourceThreadFront = lookupThreadFront(thread);
  const sourceFront = sourceThreadFront.source({
    actor
  });
  return sourceFront.getBreakpointPositionsCompressed(range);
}

async function getSourceActorBreakableLines({
  thread,
  actor
}) {
  let sourceFront;
  let actorLines = [];

  try {
    const sourceThreadFront = lookupThreadFront(thread);
    sourceFront = sourceThreadFront.source({
      actor
    });
    actorLines = await sourceFront.getBreakableLines();
  } catch (e) {
    // Handle backward compatibility
    if (e.message && e.message.match(/does not recognize the packet type getBreakableLines/)) {
      const pos = await sourceFront.getBreakpointPositionsCompressed();
      actorLines = Object.keys(pos).map(line => Number(line));
    } else {
      // Other exceptions could be due to the target thread being shut down.
      console.warn(`getSourceActorBreakableLines failed: ${e}`);
    }
  }

  return actorLines;
}

function getFrontByID(actorID) {
  return devToolsClient.getFrontByID(actorID);
}

function fetchAncestorFramePositions(index) {
  currentThreadFront().fetchAncestorFramePositions(index);
}

const clientCommands = {
  autocomplete,
  blackBox,
  createObjectFront,
  loadObjectProperties,
  releaseActor,
  interrupt,
  pauseGrip,
  resume,
  stepIn,
  stepOut,
  stepOver,
  breakOnNext,
  sourceContents,
  getSourceForActor,
  getSourceActorBreakpointPositions,
  getSourceActorBreakableLines,
  hasBreakpoint,
  setBreakpoint,
  setXHRBreakpoint,
  removeXHRBreakpoint,
  addWatchpoint,
  removeWatchpoint,
  removeBreakpoint,
  evaluate,
  evaluateInFrame,
  evaluateExpressions,
  navigate,
  reload,
  getProperties,
  getFrameScopes,
  getFrames,
  pauseOnExceptions,
  toggleEventLogging,
  fetchSources,
  fetchThreadSources,
  checkIfAlreadyPaused,
  registerSourceActor,
  fetchThreads,
  attachThread,
  getMainThread,
  sendPacket,
  setSkipPausing,
  setEventListenerBreakpoints,
  getEventListenerBreakpointTypes,
  lookupTarget,
  getFrontByID,
  fetchAncestorFramePositions,
  toggleJavaScriptEnabled
};
exports.clientCommands = clientCommands;