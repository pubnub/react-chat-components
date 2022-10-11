var _global$FEATURES;

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }

function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }

import "core-js/modules/es.array.reduce.js";
import "core-js/modules/es.array.reduce-right.js";

/* eslint-disable no-underscore-dangle */
import { addons } from '@storybook/addons';
import { once } from '@storybook/client-logger';
import { FORCE_REMOUNT, IGNORED_EXCEPTION, SET_CURRENT_STORY, STORY_RENDER_PHASE_CHANGED } from '@storybook/core-events';
import global from 'global';
import { CallStates } from './types';
export const EVENTS = {
  CALL: 'instrumenter/call',
  SYNC: 'instrumenter/sync',
  START: 'instrumenter/start',
  BACK: 'instrumenter/back',
  GOTO: 'instrumenter/goto',
  NEXT: 'instrumenter/next',
  END: 'instrumenter/end'
};
const debuggerDisabled = ((_global$FEATURES = global.FEATURES) === null || _global$FEATURES === void 0 ? void 0 : _global$FEATURES.interactionsDebugger) !== true;
const controlsDisabled = {
  debugger: !debuggerDisabled,
  start: false,
  back: false,
  goto: false,
  next: false,
  end: false
};
const alreadyCompletedException = new Error(`This function ran after the play function completed. Did you forget to \`await\` it?`);

const isObject = o => Object.prototype.toString.call(o) === '[object Object]';

const isModule = o => Object.prototype.toString.call(o) === '[object Module]';

const isInstrumentable = o => {
  if (!isObject(o) && !isModule(o)) return false;
  if (o.constructor === undefined) return true;
  const proto = o.constructor.prototype;
  if (!isObject(proto)) return false;
  if (Object.prototype.hasOwnProperty.call(proto, 'isPrototypeOf') === false) return false;
  return true;
};

const construct = obj => {
  try {
    return new obj.constructor();
  } catch (e) {
    return {};
  }
};

const getInitialState = () => ({
  renderPhase: undefined,
  isDebugging: false,
  isPlaying: false,
  isLocked: false,
  cursor: 0,
  calls: [],
  shadowCalls: [],
  callRefsByResult: new Map(),
  chainedCallIds: new Set(),
  parentId: undefined,
  playUntil: undefined,
  resolvers: {},
  syncTimeout: undefined,
  forwardedException: undefined
});

const getRetainedState = (state, isDebugging = false) => {
  const calls = (isDebugging ? state.shadowCalls : state.calls).filter(call => call.retain);
  if (!calls.length) return undefined;
  const callRefsByResult = new Map(Array.from(state.callRefsByResult.entries()).filter(([, ref]) => ref.retain));
  return {
    cursor: calls.length,
    calls,
    callRefsByResult
  };
};
/**
 * This class is not supposed to be used directly. Use the `instrument` function below instead.
 */


export class Instrumenter {
  // State is tracked per story to deal with multiple stories on the same canvas (i.e. docs mode)
  constructor() {
    this.channel = void 0;
    this.initialized = false;
    this.state = void 0;
    this.channel = addons.getChannel(); // Restore state from the parent window in case the iframe was reloaded.

    this.state = global.window.parent.__STORYBOOK_ADDON_INTERACTIONS_INSTRUMENTER_STATE__ || {}; // When called from `start`, isDebugging will be true

    const resetState = ({
      storyId,
      isPlaying = true,
      isDebugging = false
    }) => {
      const state = this.getState(storyId);
      this.setState(storyId, Object.assign({}, getInitialState(), getRetainedState(state, isDebugging), {
        shadowCalls: isDebugging ? state.shadowCalls : [],
        chainedCallIds: isDebugging ? state.chainedCallIds : new Set(),
        playUntil: isDebugging ? state.playUntil : undefined,
        isPlaying,
        isDebugging
      })); // Don't sync while debugging, as it'll cause flicker.

      if (!isDebugging) this.sync(storyId);
    }; // A forceRemount might be triggered for debugging (on `start`), or elsewhere in Storybook.


    this.channel.on(FORCE_REMOUNT, resetState); // Start with a clean slate before playing after a remount, and stop debugging when done.

    this.channel.on(STORY_RENDER_PHASE_CHANGED, ({
      storyId,
      newPhase
    }) => {
      const {
        isDebugging,
        forwardedException
      } = this.getState(storyId);
      this.setState(storyId, {
        renderPhase: newPhase
      });

      if (newPhase === 'playing') {
        resetState({
          storyId,
          isDebugging
        });
      }

      if (newPhase === 'played') {
        this.setState(storyId, {
          isLocked: false,
          isPlaying: false,
          isDebugging: false,
          forwardedException: undefined
        }); // Rethrow any unhandled forwarded exception so it doesn't go unnoticed.

        if (forwardedException) throw forwardedException;
      }
    }); // Trash non-retained state and clear the log when switching stories, but not on initial boot.

    this.channel.on(SET_CURRENT_STORY, () => {
      if (this.initialized) this.cleanup();else this.initialized = true;
    });

    const start = ({
      storyId,
      playUntil
    }) => {
      if (!this.getState(storyId).isDebugging) {
        this.setState(storyId, ({
          calls
        }) => ({
          calls: [],
          shadowCalls: calls.map(call => Object.assign({}, call, {
            status: CallStates.WAITING
          })),
          isDebugging: true
        }));
      }

      const log = this.getLog(storyId);
      this.setState(storyId, ({
        shadowCalls
      }) => {
        var _shadowCalls$slice$fi;

        const firstRowIndex = shadowCalls.findIndex(call => call.id === log[0].callId);
        return {
          playUntil: playUntil || ((_shadowCalls$slice$fi = shadowCalls.slice(0, firstRowIndex).filter(call => call.interceptable).slice(-1)[0]) === null || _shadowCalls$slice$fi === void 0 ? void 0 : _shadowCalls$slice$fi.id)
        };
      }); // Force remount may trigger a page reload if the play function can't be aborted.

      this.channel.emit(FORCE_REMOUNT, {
        storyId,
        isDebugging: true
      });
    };

    const back = ({
      storyId
    }) => {
      var _log;

      const {
        isDebugging
      } = this.getState(storyId);
      const log = this.getLog(storyId);
      const next = isDebugging ? log.findIndex(({
        status
      }) => status === CallStates.WAITING) : log.length;
      start({
        storyId,
        playUntil: (_log = log[next - 2]) === null || _log === void 0 ? void 0 : _log.callId
      });
    };

    const goto = ({
      storyId,
      callId
    }) => {
      const {
        calls,
        shadowCalls,
        resolvers
      } = this.getState(storyId);
      const call = calls.find(({
        id
      }) => id === callId);
      const shadowCall = shadowCalls.find(({
        id
      }) => id === callId);

      if (!call && shadowCall && Object.values(resolvers).length > 0) {
        var _this$getLog$find;

        const nextId = (_this$getLog$find = this.getLog(storyId).find(c => c.status === CallStates.WAITING)) === null || _this$getLog$find === void 0 ? void 0 : _this$getLog$find.callId;
        if (shadowCall.id !== nextId) this.setState(storyId, {
          playUntil: shadowCall.id
        });
        Object.values(resolvers).forEach(resolve => resolve());
      } else {
        start({
          storyId,
          playUntil: callId
        });
      }
    };

    const next = ({
      storyId
    }) => {
      const {
        resolvers
      } = this.getState(storyId);

      if (Object.values(resolvers).length > 0) {
        Object.values(resolvers).forEach(resolve => resolve());
      } else {
        var _this$getLog$find2;

        const nextId = (_this$getLog$find2 = this.getLog(storyId).find(c => c.status === CallStates.WAITING)) === null || _this$getLog$find2 === void 0 ? void 0 : _this$getLog$find2.callId;
        if (nextId) start({
          storyId,
          playUntil: nextId
        });else end({
          storyId
        });
      }
    };

    const end = ({
      storyId
    }) => {
      this.setState(storyId, {
        playUntil: undefined,
        isDebugging: false
      });
      Object.values(this.getState(storyId).resolvers).forEach(resolve => resolve());
    };

    this.channel.on(EVENTS.START, start);
    this.channel.on(EVENTS.BACK, back);
    this.channel.on(EVENTS.GOTO, goto);
    this.channel.on(EVENTS.NEXT, next);
    this.channel.on(EVENTS.END, end);
  }

  getState(storyId) {
    return this.state[storyId] || getInitialState();
  }

  setState(storyId, update) {
    const state = this.getState(storyId);
    const patch = typeof update === 'function' ? update(state) : update;
    this.state = Object.assign({}, this.state, {
      [storyId]: Object.assign({}, state, patch)
    }); // Track state on the parent window so we can reload the iframe without losing state.

    global.window.parent.__STORYBOOK_ADDON_INTERACTIONS_INSTRUMENTER_STATE__ = this.state;
  }

  cleanup() {
    // Reset stories with retained state to their initial state, and drop the rest.
    this.state = Object.entries(this.state).reduce((acc, [storyId, state]) => {
      const retainedState = getRetainedState(state);
      if (!retainedState) return acc;
      acc[storyId] = Object.assign(getInitialState(), retainedState);
      return acc;
    }, {});
    this.channel.emit(EVENTS.SYNC, {
      controlStates: controlsDisabled,
      logItems: []
    });
    global.window.parent.__STORYBOOK_ADDON_INTERACTIONS_INSTRUMENTER_STATE__ = this.state;
  }

  getLog(storyId) {
    const {
      calls,
      shadowCalls
    } = this.getState(storyId);
    const merged = [...shadowCalls];
    calls.forEach((call, index) => {
      merged[index] = call;
    });
    const seen = new Set();
    return merged.reduceRight((acc, call) => {
      call.args.forEach(arg => {
        if (arg !== null && arg !== void 0 && arg.__callId__) {
          seen.add(arg.__callId__);
        }
      });
      call.path.forEach(node => {
        if (node.__callId__) {
          seen.add(node.__callId__);
        }
      });

      if (call.interceptable && !seen.has(call.id)) {
        acc.unshift({
          callId: call.id,
          status: call.status
        });
        seen.add(call.id);
      }

      return acc;
    }, []);
  } // Traverses the object structure to recursively patch all function properties.
  // Returns the original object, or a new object with the same constructor,
  // depending on whether it should mutate.


  instrument(obj, options) {
    if (!isInstrumentable(obj)) return obj;
    const {
      mutate = false,
      path = []
    } = options;
    return Object.keys(obj).reduce((acc, key) => {
      const value = obj[key]; // Nothing to patch, but might be instrumentable, so we recurse

      if (typeof value !== 'function') {
        acc[key] = this.instrument(value, Object.assign({}, options, {
          path: path.concat(key)
        }));
        return acc;
      } // Already patched, so we pass through unchanged


      if (typeof value.__originalFn__ === 'function') {
        acc[key] = value;
        return acc;
      } // Patch the function and mark it "patched" by adding a reference to the original function


      acc[key] = (...args) => this.track(key, value, args, options);

      acc[key].__originalFn__ = value; // Reuse the original name as the patched function's name

      Object.defineProperty(acc[key], 'name', {
        value: key,
        writable: false
      }); // Deal with functions that also act like an object

      if (Object.keys(value).length > 0) {
        Object.assign(acc[key], this.instrument(Object.assign({}, value), Object.assign({}, options, {
          path: path.concat(key)
        })));
      }

      return acc;
    }, mutate ? obj : construct(obj));
  } // Monkey patch an object method to record calls.
  // Returns a function that invokes the original function, records the invocation ("call") and
  // returns the original result.


  track(method, fn, args, options) {
    var _args$, _global$window$__STOR, _global$window$__STOR2, _global$window$__STOR3;

    const storyId = (args === null || args === void 0 ? void 0 : (_args$ = args[0]) === null || _args$ === void 0 ? void 0 : _args$.__storyId__) || ((_global$window$__STOR = global.window.__STORYBOOK_PREVIEW__) === null || _global$window$__STOR === void 0 ? void 0 : (_global$window$__STOR2 = _global$window$__STOR.urlStore) === null || _global$window$__STOR2 === void 0 ? void 0 : (_global$window$__STOR3 = _global$window$__STOR2.selection) === null || _global$window$__STOR3 === void 0 ? void 0 : _global$window$__STOR3.storyId);
    const {
      cursor,
      parentId
    } = this.getState(storyId);
    this.setState(storyId, {
      cursor: cursor + 1
    });
    const id = `${parentId || storyId} [${cursor}] ${method}`;
    const {
      path = [],
      intercept = false,
      retain = false
    } = options;
    const interceptable = typeof intercept === 'function' ? intercept(method, path) : intercept;
    const call = {
      id,
      parentId,
      storyId,
      cursor,
      path,
      method,
      args,
      interceptable,
      retain
    };
    const result = (interceptable ? this.intercept : this.invoke).call(this, fn, call, options);
    return this.instrument(result, Object.assign({}, options, {
      mutate: true,
      path: [{
        __callId__: call.id
      }]
    }));
  }

  intercept(fn, call, options) {
    const {
      chainedCallIds,
      isDebugging,
      playUntil
    } = this.getState(call.storyId); // For a "jump to step" action, continue playing until we hit a call by that ID.
    // For chained calls, we can only return a Promise for the last call in the chain.

    const isChainedUpon = chainedCallIds.has(call.id);

    if (!isDebugging || isChainedUpon || playUntil) {
      if (playUntil === call.id) {
        this.setState(call.storyId, {
          playUntil: undefined
        });
      }

      return this.invoke(fn, call, options);
    } // Instead of invoking the function, defer the function call until we continue playing.


    return new Promise(resolve => {
      this.setState(call.storyId, ({
        resolvers
      }) => ({
        isLocked: false,
        resolvers: Object.assign({}, resolvers, {
          [call.id]: resolve
        })
      }));
    }).then(() => {
      this.setState(call.storyId, state => {
        const _state$resolvers = state.resolvers,
              _call$id = call.id,
              resolvers = _objectWithoutPropertiesLoose(_state$resolvers, [_call$id].map(_toPropertyKey));

        return {
          isLocked: true,
          resolvers
        };
      });
      return this.invoke(fn, call, options);
    });
  }

  invoke(fn, call, options) {
    // TODO this doesnt work because the abortSignal we have here is the newly created one
    // const { abortSignal } = global.window.__STORYBOOK_PREVIEW__ || {};
    // if (abortSignal && abortSignal.aborted) throw IGNORED_EXCEPTION;
    const {
      callRefsByResult,
      forwardedException,
      renderPhase
    } = this.getState(call.storyId);
    const info = Object.assign({}, call, {
      // Map args that originate from a tracked function call to a call reference to enable nesting.
      // These values are often not fully serializable anyway (e.g. HTML elements).
      args: call.args.map(arg => {
        if (callRefsByResult.has(arg)) {
          return callRefsByResult.get(arg);
        }

        if (arg instanceof global.window.HTMLElement) {
          const {
            prefix,
            localName,
            id,
            classList,
            innerText
          } = arg;
          const classNames = Array.from(classList);
          return {
            __element__: {
              prefix,
              localName,
              id,
              classNames,
              innerText
            }
          };
        }

        return arg;
      })
    }); // Mark any ancestor calls as "chained upon" so we won't attempt to defer it later.

    call.path.forEach(ref => {
      if (ref !== null && ref !== void 0 && ref.__callId__) {
        this.setState(call.storyId, ({
          chainedCallIds
        }) => ({
          chainedCallIds: new Set(Array.from(chainedCallIds).concat(ref.__callId__))
        }));
      }
    });

    const handleException = e => {
      if (e instanceof Error) {
        const {
          name,
          message,
          stack
        } = e;
        const exception = {
          name,
          message,
          stack
        };
        this.update(Object.assign({}, info, {
          status: CallStates.ERROR,
          exception
        })); // Always track errors to their originating call.

        this.setState(call.storyId, state => ({
          callRefsByResult: new Map([...Array.from(state.callRefsByResult.entries()), [e, {
            __callId__: call.id,
            retain: call.retain
          }]])
        })); // We need to throw to break out of the play function, but we don't want to trigger a redbox
        // so we throw an ignoredException, which is caught and silently ignored by Storybook.

        if (call.interceptable && e !== alreadyCompletedException) {
          throw IGNORED_EXCEPTION;
        } // Non-interceptable calls need their exceptions forwarded to the next interceptable call.
        // In case no interceptable call picks it up, it'll get rethrown in the "completed" phase.


        this.setState(call.storyId, {
          forwardedException: e
        });
        return e;
      }

      throw e;
    };

    try {
      // An earlier, non-interceptable call might have forwarded an exception.
      if (forwardedException) {
        this.setState(call.storyId, {
          forwardedException: undefined
        });
        throw forwardedException;
      }

      if (renderPhase === 'played' && !call.retain) {
        throw alreadyCompletedException;
      }

      const finalArgs = options.getArgs ? options.getArgs(call, this.getState(call.storyId)) : call.args;
      const result = fn( // Wrap any callback functions to provide a way to access their "parent" call.
      // This is picked up in the `track` function and used for call metadata.
      ...finalArgs.map(arg => {
        if (typeof arg !== 'function' || Object.keys(arg).length) return arg;
        return (...args) => {
          const {
            cursor,
            parentId
          } = this.getState(call.storyId);
          this.setState(call.storyId, {
            cursor: 0,
            parentId: call.id
          });

          const restore = () => this.setState(call.storyId, {
            cursor,
            parentId
          });

          const res = arg(...args);
          if (res instanceof Promise) res.then(restore, restore);else restore();
          return res;
        };
      })); // Track the result so we can trace later uses of it back to the originating call.
      // Primitive results (undefined, null, boolean, string, number, BigInt) are ignored.

      if (result && ['object', 'function', 'symbol'].includes(typeof result)) {
        this.setState(call.storyId, state => ({
          callRefsByResult: new Map([...Array.from(state.callRefsByResult.entries()), [result, {
            __callId__: call.id,
            retain: call.retain
          }]])
        }));
      }

      this.update(Object.assign({}, info, {
        status: result instanceof Promise ? CallStates.ACTIVE : CallStates.DONE
      }));

      if (result instanceof Promise) {
        return result.then(value => {
          this.update(Object.assign({}, info, {
            status: CallStates.DONE
          }));
          return value;
        }, handleException);
      }

      return result;
    } catch (e) {
      return handleException(e);
    }
  } // Sends the call info and log to the manager.
  // Uses a 0ms debounce because this might get called many times in one tick.


  update(call) {
    clearTimeout(this.getState(call.storyId).syncTimeout);
    this.channel.emit(EVENTS.CALL, call);
    this.setState(call.storyId, ({
      calls
    }) => {
      // Omit earlier calls for the same ID, which may have been superceded by a later invocation.
      // This typically happens when calls are part of a callback which runs multiple times.
      const callsById = calls.concat(call).reduce((a, c) => Object.assign(a, {
        [c.id]: c
      }), {});
      return {
        // Calls are sorted to ensure parent calls always come before calls in their callback.
        calls: Object.values(callsById).sort((a, b) => a.id.localeCompare(b.id, undefined, {
          numeric: true
        })),
        syncTimeout: setTimeout(() => this.sync(call.storyId), 0)
      };
    });
  }

  sync(storyId) {
    const {
      isLocked,
      isPlaying
    } = this.getState(storyId);
    const logItems = this.getLog(storyId);
    const hasActive = logItems.some(item => item.status === CallStates.ACTIVE);

    if (debuggerDisabled || isLocked || hasActive || logItems.length === 0) {
      this.channel.emit(EVENTS.SYNC, {
        controlStates: controlsDisabled,
        logItems
      });
      return;
    }

    const hasPrevious = logItems.some(item => [CallStates.DONE, CallStates.ERROR].includes(item.status));
    const controlStates = {
      debugger: true,
      start: hasPrevious,
      back: hasPrevious,
      goto: true,
      next: isPlaying,
      end: isPlaying
    };
    this.channel.emit(EVENTS.SYNC, {
      controlStates,
      logItems
    });
  }

}
/**
 * Instruments an object or module by traversing its properties, patching any functions (methods)
 * to enable debugging. Patched functions will emit a `call` event when invoked.
 * When intercept = true, patched functions will return a Promise when the debugger stops before
 * this function. As such, "interceptable" functions will have to be `await`-ed.
 */

export function instrument(obj, options = {}) {
  try {
    var _global$window$locati, _global$window$locati2, _global$window$locati3, _global$window$locati4;

    let forceInstrument = false;
    let skipInstrument = false;

    if (((_global$window$locati = global.window.location) === null || _global$window$locati === void 0 ? void 0 : (_global$window$locati2 = _global$window$locati.search) === null || _global$window$locati2 === void 0 ? void 0 : _global$window$locati2.indexOf('instrument=true')) !== -1) {
      forceInstrument = true;
    } else if (((_global$window$locati3 = global.window.location) === null || _global$window$locati3 === void 0 ? void 0 : (_global$window$locati4 = _global$window$locati3.search) === null || _global$window$locati4 === void 0 ? void 0 : _global$window$locati4.indexOf('instrument=false')) !== -1) {
      skipInstrument = true;
    } // Don't do any instrumentation if not loaded in an iframe unless it's forced - instrumentation can also be skipped.


    if (global.window.parent === global.window && !forceInstrument || skipInstrument) {
      return obj;
    } // Only create an instance if we don't have one (singleton) yet.


    if (!global.window.__STORYBOOK_ADDON_INTERACTIONS_INSTRUMENTER__) {
      global.window.__STORYBOOK_ADDON_INTERACTIONS_INSTRUMENTER__ = new Instrumenter();
    }

    const instrumenter = global.window.__STORYBOOK_ADDON_INTERACTIONS_INSTRUMENTER__;
    return instrumenter.instrument(obj, options);
  } catch (e) {
    // Access to the parent window might fail due to CORS restrictions.
    once.warn(e);
    return obj;
  }
}