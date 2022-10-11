"use strict";

require("core-js/modules/es.symbol.js");

require("core-js/modules/es.symbol.description.js");

require("core-js/modules/es.symbol.iterator.js");

require("core-js/modules/es.array.iterator.js");

require("core-js/modules/es.string.iterator.js");

require("core-js/modules/web.dom-collections.iterator.js");

require("core-js/modules/es.array.slice.js");

require("core-js/modules/es.function.name.js");

require("core-js/modules/es.array.from.js");

require("core-js/modules/es.regexp.exec.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.WithLoaders = exports.WaitForElementToBeRemoved = exports.WaitFor = exports.VerificationSuccess = exports.VerificationPasswordMismatch = exports.VerificationPassword = exports.Verification = exports.StandardPasswordFailed = exports.StandardFailHover = exports.StandardEmailSuccess = exports.StandardEmailFilled = exports.StandardEmailFailed = exports.Standard = exports.FindBy = exports.Demo = void 0;

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.promise.js");

require("core-js/modules/es.object.assign.js");

require("regenerator-runtime/runtime.js");

var _jest = require("@storybook/jest");

var _testingLibrary = require("@storybook/testing-library");

var _react = _interopRequireDefault(require("react"));

var _AccountForm = require("./AccountForm");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _default = {
  title: 'Addons/Interactions/AccountForm',
  component: _AccountForm.AccountForm,
  parameters: {
    layout: 'centered',
    theme: 'light',
    options: {
      selectedPanel: 'storybook/interactions/panel'
    }
  },
  argTypes: {
    onSubmit: {
      action: true
    }
  }
};
exports.default = _default;

var Demo = function Demo(args) {
  return /*#__PURE__*/_react.default.createElement("button", {
    type: "button",
    onClick: function onClick() {
      return args.onSubmit('clicked');
    }
  }, "Click");
};

exports.Demo = Demo;

Demo.play = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref) {
    var args, canvasElement;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            args = _ref.args, canvasElement = _ref.canvasElement;
            _context.next = 3;
            return _testingLibrary.userEvent.click((0, _testingLibrary.within)(canvasElement).getByRole('button'));

          case 3:
            _context.next = 5;
            return (0, _jest.expect)(args.onSubmit).toHaveBeenCalledWith(_jest.expect.stringMatching(/([A-Z])\w+/gi));

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x) {
    return _ref2.apply(this, arguments);
  };
}();

var FindBy = function FindBy(args) {
  var _React$useState = _react.default.useState(true),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      isLoading = _React$useState2[0],
      setIsLoading = _React$useState2[1];

  _react.default.useEffect(function () {
    setTimeout(function () {
      return setIsLoading(false);
    }, 500);
  }, []);

  return isLoading ? /*#__PURE__*/_react.default.createElement("div", null, "Loading...") : /*#__PURE__*/_react.default.createElement("button", {
    type: "button"
  }, "Loaded!");
};

exports.FindBy = FindBy;

FindBy.play = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(_ref3) {
    var canvasElement, canvas;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            canvasElement = _ref3.canvasElement;
            canvas = (0, _testingLibrary.within)(canvasElement);
            _context2.next = 4;
            return canvas.findByRole('button');

          case 4:
            _context2.next = 6;
            return (0, _jest.expect)(true).toBe(true);

          case 6:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x2) {
    return _ref4.apply(this, arguments);
  };
}();

var WaitFor = function WaitFor(args) {
  return /*#__PURE__*/_react.default.createElement("button", {
    type: "button",
    onClick: function onClick() {
      return setTimeout(function () {
        return args.onSubmit('clicked');
      }, 100);
    }
  }, "Click");
};

exports.WaitFor = WaitFor;

WaitFor.play = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(_ref5) {
    var args, canvasElement;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            args = _ref5.args, canvasElement = _ref5.canvasElement;
            _context4.t0 = _testingLibrary.userEvent;
            _context4.next = 4;
            return (0, _testingLibrary.within)(canvasElement).findByText('Click');

          case 4:
            _context4.t1 = _context4.sent;
            _context4.next = 7;
            return _context4.t0.click.call(_context4.t0, _context4.t1);

          case 7:
            _context4.next = 9;
            return (0, _testingLibrary.waitFor)( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
              return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                  switch (_context3.prev = _context3.next) {
                    case 0:
                      _context3.next = 2;
                      return (0, _jest.expect)(args.onSubmit).toHaveBeenCalledWith(_jest.expect.stringMatching(/([A-Z])\w+/gi));

                    case 2:
                      _context3.next = 4;
                      return (0, _jest.expect)(true).toBe(true);

                    case 4:
                    case "end":
                      return _context3.stop();
                  }
                }
              }, _callee3);
            })));

          case 9:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function (_x3) {
    return _ref6.apply(this, arguments);
  };
}();

var WaitForElementToBeRemoved = function WaitForElementToBeRemoved() {
  var _React$useState3 = _react.default.useState(true),
      _React$useState4 = _slicedToArray(_React$useState3, 2),
      isLoading = _React$useState4[0],
      setIsLoading = _React$useState4[1];

  _react.default.useEffect(function () {
    setTimeout(function () {
      return setIsLoading(false);
    }, 1500);
  }, []);

  return isLoading ? /*#__PURE__*/_react.default.createElement("div", null, "Loading...") : /*#__PURE__*/_react.default.createElement("button", {
    type: "button"
  }, "Loaded!");
};

exports.WaitForElementToBeRemoved = WaitForElementToBeRemoved;

WaitForElementToBeRemoved.play = /*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(_ref8) {
    var canvasElement, canvas, button;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            canvasElement = _ref8.canvasElement;
            canvas = (0, _testingLibrary.within)(canvasElement);
            _context5.t0 = _testingLibrary.waitForElementToBeRemoved;
            _context5.next = 5;
            return canvas.findByText('Loading...');

          case 5:
            _context5.t1 = _context5.sent;
            _context5.t2 = {
              timeout: 2000
            };
            _context5.next = 9;
            return (0, _context5.t0)(_context5.t1, _context5.t2);

          case 9:
            _context5.next = 11;
            return canvas.findByText('Loaded!');

          case 11:
            button = _context5.sent;
            _context5.next = 14;
            return (0, _jest.expect)(button).not.toBeNull();

          case 14:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function (_x4) {
    return _ref9.apply(this, arguments);
  };
}();

var WithLoaders = function WithLoaders(args, _ref10) {
  var todo = _ref10.loaded.todo;
  return /*#__PURE__*/_react.default.createElement("button", {
    type: "button",
    onClick: args.onSubmit(todo.title)
  }, "Todo: ", todo.title);
};

exports.WithLoaders = WithLoaders;
WithLoaders.loaders = [/*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
  return regeneratorRuntime.wrap(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 2;
          return new Promise(function (resolve) {
            return setTimeout(resolve, 2000);
          });

        case 2:
          return _context6.abrupt("return", {
            todo: {
              userId: 1,
              id: 1,
              title: 'delectus aut autem',
              completed: false
            }
          });

        case 3:
        case "end":
          return _context6.stop();
      }
    }
  }, _callee6);
}))];

WithLoaders.play = /*#__PURE__*/function () {
  var _ref13 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(_ref12) {
    var args, canvasElement, canvas, todoItem;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            args = _ref12.args, canvasElement = _ref12.canvasElement;
            canvas = (0, _testingLibrary.within)(canvasElement);
            _context7.next = 4;
            return canvas.findByText('Todo: delectus aut autem');

          case 4:
            todoItem = _context7.sent;
            _context7.next = 7;
            return _testingLibrary.userEvent.click(todoItem);

          case 7:
            _context7.next = 9;
            return (0, _jest.expect)(args.onSubmit).toHaveBeenCalledWith('delectus aut autem');

          case 9:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));

  return function (_x5) {
    return _ref13.apply(this, arguments);
  };
}();

var Standard = {
  args: {
    passwordVerification: false
  }
};
exports.Standard = Standard;
var StandardEmailFilled = Object.assign({}, Standard, {
  play: function () {
    var _play = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(_ref14) {
      var canvasElement, canvas;
      return regeneratorRuntime.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              canvasElement = _ref14.canvasElement;
              canvas = (0, _testingLibrary.within)(canvasElement);
              _context8.next = 4;
              return _testingLibrary.fireEvent.change(canvas.getByTestId('email'), {
                target: {
                  value: 'michael@chromatic.com'
                }
              });

            case 4:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee8);
    }));

    function play(_x6) {
      return _play.apply(this, arguments);
    }

    return play;
  }()
});
exports.StandardEmailFilled = StandardEmailFilled;
var StandardEmailFailed = Object.assign({}, Standard, {
  play: function () {
    var _play2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(_ref15) {
      var args, canvasElement, canvas;
      return regeneratorRuntime.wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              args = _ref15.args, canvasElement = _ref15.canvasElement;
              canvas = (0, _testingLibrary.within)(canvasElement);
              _context9.next = 4;
              return _testingLibrary.userEvent.type(canvas.getByTestId('email'), 'gert@chromatic');

            case 4:
              _context9.next = 6;
              return _testingLibrary.userEvent.type(canvas.getByTestId('password1'), 'supersecret');

            case 6:
              _context9.next = 8;
              return _testingLibrary.userEvent.click(canvas.getByRole('button', {
                name: /create account/i
              }));

            case 8:
              _context9.next = 10;
              return canvas.findByText('Please enter a correctly formatted email address');

            case 10:
              (0, _jest.expect)(args.onSubmit).not.toHaveBeenCalled();

            case 11:
            case "end":
              return _context9.stop();
          }
        }
      }, _callee9);
    }));

    function play(_x7) {
      return _play2.apply(this, arguments);
    }

    return play;
  }()
});
exports.StandardEmailFailed = StandardEmailFailed;
var StandardEmailSuccess = Object.assign({}, Standard, {
  play: function () {
    var _play3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(_ref16) {
      var args, canvasElement, canvas;
      return regeneratorRuntime.wrap(function _callee11$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              args = _ref16.args, canvasElement = _ref16.canvasElement;
              canvas = (0, _testingLibrary.within)(canvasElement);
              _context11.next = 4;
              return _testingLibrary.userEvent.type(canvas.getByTestId('email'), 'michael@chromatic.com');

            case 4:
              _context11.next = 6;
              return _testingLibrary.userEvent.type(canvas.getByTestId('password1'), 'testpasswordthatwontfail');

            case 6:
              _context11.next = 8;
              return _testingLibrary.userEvent.click(canvas.getByTestId('submit'));

            case 8:
              _context11.next = 10;
              return (0, _testingLibrary.waitFor)( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10() {
                return regeneratorRuntime.wrap(function _callee10$(_context10) {
                  while (1) {
                    switch (_context10.prev = _context10.next) {
                      case 0:
                        _context10.next = 2;
                        return (0, _jest.expect)(args.onSubmit).toHaveBeenCalledTimes(1);

                      case 2:
                        _context10.next = 4;
                        return (0, _jest.expect)(args.onSubmit).toHaveBeenCalledWith({
                          email: 'michael@chromatic.com',
                          password: 'testpasswordthatwontfail'
                        });

                      case 4:
                      case "end":
                        return _context10.stop();
                    }
                  }
                }, _callee10);
              })));

            case 10:
            case "end":
              return _context11.stop();
          }
        }
      }, _callee11);
    }));

    function play(_x8) {
      return _play3.apply(this, arguments);
    }

    return play;
  }()
});
exports.StandardEmailSuccess = StandardEmailSuccess;
var StandardPasswordFailed = Object.assign({}, Standard, {
  play: function () {
    var _play4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(context) {
      var canvas;
      return regeneratorRuntime.wrap(function _callee12$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              canvas = (0, _testingLibrary.within)(context.canvasElement);
              _context12.next = 3;
              return StandardEmailFilled.play(context);

            case 3:
              _context12.next = 5;
              return _testingLibrary.userEvent.type(canvas.getByTestId('password1'), 'asdf');

            case 5:
              _context12.next = 7;
              return _testingLibrary.userEvent.click(canvas.getByTestId('submit'));

            case 7:
            case "end":
              return _context12.stop();
          }
        }
      }, _callee12);
    }));

    function play(_x9) {
      return _play4.apply(this, arguments);
    }

    return play;
  }()
});
exports.StandardPasswordFailed = StandardPasswordFailed;
var StandardFailHover = Object.assign({}, StandardPasswordFailed, {
  play: function () {
    var _play5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14(context) {
      var canvas;
      return regeneratorRuntime.wrap(function _callee14$(_context14) {
        while (1) {
          switch (_context14.prev = _context14.next) {
            case 0:
              canvas = (0, _testingLibrary.within)(context.canvasElement);
              _context14.next = 3;
              return StandardPasswordFailed.play(context);

            case 3:
              _context14.next = 5;
              return (0, _testingLibrary.waitFor)( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13() {
                return regeneratorRuntime.wrap(function _callee13$(_context13) {
                  while (1) {
                    switch (_context13.prev = _context13.next) {
                      case 0:
                        _context13.next = 2;
                        return _testingLibrary.userEvent.hover(canvas.getByTestId('password-error-info'));

                      case 2:
                      case "end":
                        return _context13.stop();
                    }
                  }
                }, _callee13);
              })));

            case 5:
            case "end":
              return _context14.stop();
          }
        }
      }, _callee14);
    }));

    function play(_x10) {
      return _play5.apply(this, arguments);
    }

    return play;
  }()
});
exports.StandardFailHover = StandardFailHover;
var Verification = {
  args: {
    passwordVerification: true
  },
  argTypes: {
    onSubmit: {
      action: 'clicked'
    }
  }
};
exports.Verification = Verification;
var VerificationPassword = Object.assign({}, Verification, {
  play: function () {
    var _play6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15(context) {
      var canvas;
      return regeneratorRuntime.wrap(function _callee15$(_context15) {
        while (1) {
          switch (_context15.prev = _context15.next) {
            case 0:
              canvas = (0, _testingLibrary.within)(context.canvasElement);
              _context15.next = 3;
              return StandardEmailFilled.play(context);

            case 3:
              _context15.next = 5;
              return _testingLibrary.userEvent.type(canvas.getByTestId('password1'), 'asdfasdf');

            case 5:
              _context15.next = 7;
              return _testingLibrary.userEvent.click(canvas.getByTestId('submit'));

            case 7:
            case "end":
              return _context15.stop();
          }
        }
      }, _callee15);
    }));

    function play(_x11) {
      return _play6.apply(this, arguments);
    }

    return play;
  }()
});
exports.VerificationPassword = VerificationPassword;
var VerificationPasswordMismatch = Object.assign({}, Verification, {
  play: function () {
    var _play7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee16(context) {
      var canvas;
      return regeneratorRuntime.wrap(function _callee16$(_context16) {
        while (1) {
          switch (_context16.prev = _context16.next) {
            case 0:
              canvas = (0, _testingLibrary.within)(context.canvasElement);
              _context16.next = 3;
              return StandardEmailFilled.play(context);

            case 3:
              _context16.next = 5;
              return _testingLibrary.userEvent.type(canvas.getByTestId('password1'), 'asdfasdf');

            case 5:
              _context16.next = 7;
              return _testingLibrary.userEvent.type(canvas.getByTestId('password2'), 'asdf1234');

            case 7:
              _context16.next = 9;
              return _testingLibrary.userEvent.click(canvas.getByTestId('submit'));

            case 9:
            case "end":
              return _context16.stop();
          }
        }
      }, _callee16);
    }));

    function play(_x12) {
      return _play7.apply(this, arguments);
    }

    return play;
  }()
});
exports.VerificationPasswordMismatch = VerificationPasswordMismatch;
var VerificationSuccess = Object.assign({}, Verification, {
  play: function () {
    var _play8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee17(context) {
      var canvas;
      return regeneratorRuntime.wrap(function _callee17$(_context17) {
        while (1) {
          switch (_context17.prev = _context17.next) {
            case 0:
              canvas = (0, _testingLibrary.within)(context.canvasElement);
              _context17.next = 3;
              return StandardEmailFilled.play(context);

            case 3:
              _context17.next = 5;
              return new Promise(function (resolve) {
                return setTimeout(resolve, 1000);
              });

            case 5:
              _context17.next = 7;
              return _testingLibrary.userEvent.type(canvas.getByTestId('password1'), 'helloyou', {
                delay: 50
              });

            case 7:
              _context17.next = 9;
              return new Promise(function (resolve) {
                return setTimeout(resolve, 1000);
              });

            case 9:
              _context17.next = 11;
              return _testingLibrary.userEvent.type(canvas.getByTestId('password2'), 'helloyou', {
                delay: 50
              });

            case 11:
              _context17.next = 13;
              return new Promise(function (resolve) {
                return setTimeout(resolve, 1000);
              });

            case 13:
              _context17.next = 15;
              return _testingLibrary.userEvent.click(canvas.getByTestId('submit'));

            case 15:
            case "end":
              return _context17.stop();
          }
        }
      }, _callee17);
    }));

    function play(_x13) {
      return _play8.apply(this, arguments);
    }

    return play;
  }()
});
exports.VerificationSuccess = VerificationSuccess;