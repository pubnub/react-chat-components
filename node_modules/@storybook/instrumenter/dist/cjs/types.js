"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CallStates = void 0;
var CallStates;
exports.CallStates = CallStates;

(function (CallStates) {
  CallStates["DONE"] = "done";
  CallStates["ERROR"] = "error";
  CallStates["ACTIVE"] = "active";
  CallStates["WAITING"] = "waiting";
})(CallStates || (exports.CallStates = CallStates = {}));