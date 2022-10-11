export let CallStates;

(function (CallStates) {
  CallStates["DONE"] = "done";
  CallStates["ERROR"] = "error";
  CallStates["ACTIVE"] = "active";
  CallStates["WAITING"] = "waiting";
})(CallStates || (CallStates = {}));