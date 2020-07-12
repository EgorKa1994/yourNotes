// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"src/js/content.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Content = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// import { response } from 'express';
var Content = /*#__PURE__*/function () {
  function Content(container) {
    _classCallCheck(this, Content);

    this.container = container;
    this.noteInfo = {};
    this.noteId = null;
    this.updateList = null;
  }

  _createClass(Content, [{
    key: "_createTrashButton",
    value: function _createTrashButton(id) {
      var btnNode = document.createElement('button');
      btnNode.classList.value = 'btn btn-outline-danger py-0';
      btnNode.textContent = 'Remove';
      btnNode.setAttribute('data-id', id);
      btnNode.addEventListener('click', this._handleRemovingOfNote.bind(this));
      return btnNode;
    }
  }, {
    key: "_createEditButton",
    value: function _createEditButton(id) {
      var btnNode = document.createElement('button');
      btnNode.classList.value = 'btn btn-outline-warning py-0';
      btnNode.textContent = 'Edit';
      btnNode.setAttribute('data-id', id);
      btnNode.setAttribute('data-toggle', 'modal');
      btnNode.setAttribute('data-target', '#formModal');
      btnNode.addEventListener('click', this._handleEditingOfNote.bind(this));
      return btnNode;
    }
  }, {
    key: "_handleEditingOfNote",
    value: function _handleEditingOfNote(e) {
      this.container.classList.add('underEdition');
      var idOfNote = e.currentTarget.getAttribute('data-id');
      var titleField = document.querySelector('#title');
      var containField = document.querySelector('#contain'); // Поиск по Id необходимой заметки и копирование в форму ее данных

      fetch('http://localhost:8080/api/data', {
        method: 'GET'
      }).then(function (response) {
        return response.json();
      }).then(function (data) {
        data.list.forEach(function (item) {
          if (item.id == idOfNote) {
            titleField.value = item.title;
            containField.value = item.contain;
            $('#formModal').modal('show');
          }
        });
      }).catch(function (error) {
        return console.error(error);
      });
    }
  }, {
    key: "_handleRemovingOfNote",
    value: function _handleRemovingOfNote(e) {
      var _this = this;

      var idOfNote = e.currentTarget.getAttribute('data-id');
      localStorage.setItem('choosenNoteId', null); // Обнуляем id после удаления заметки

      fetch("http://localhost:8080/api/data/".concat(idOfNote), {
        method: 'DELETE'
      }).then(function (response) {
        return response.json();
      }).then(function (data) {
        _this.container.innerHTML = '';

        if (_this.updateList) {
          _this.updateList(data.list);
        }
      });
    }
  }, {
    key: "render",
    value: function render(noteInfo, updateList) {
      this.noteInfo = noteInfo;
      this.updateList = updateList;
      this.noteId = noteInfo.id;
      this.container.innerHTML = '';
      var template = "\n    <div>".concat(noteInfo.time, "</div>\n    <p>").concat(noteInfo.contain, "</p>\n  ");
      this.container.innerHTML = this.container.innerHTML + template;
      var noteEditor = document.createElement('div');
      noteEditor.classList.value = 'contentEditor d-flex justify-content-center';
      noteEditor.append(this._createTrashButton(this.noteId));
      noteEditor.append(this._createEditButton(this.noteId));
      this.container.append(noteEditor);
    }
  }]);

  return Content;
}();

exports.Content = Content;
},{}],"src/js/list.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.List = void 0;

var _content = require("./content");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var List = /*#__PURE__*/function () {
  function List(container) {
    _classCallCheck(this, List);

    this.container = container;
    this.oneNoteContent = document.querySelector('#oneNoteContent');
    this.content = new _content.Content(this.oneNoteContent);
    this.noteId = null;
    this.data = [];

    this._init();
  }

  _createClass(List, [{
    key: "_init",
    value: function _init() {
      // Выбор определенной заметки
      this.container.addEventListener('click', this._handleChoosenNote.bind(this));
    }
  }, {
    key: "_handleChoosenNote",
    value: function _handleChoosenNote(e) {
      var _this = this;

      // Удаление разметки
      this._markUpRemoving(this.container.querySelectorAll('li'));

      var target = e.target;
      this.noteId = this._getIdOfNote(target); // Добавление разметки

      this._markUpAddition(this.noteId);

      localStorage.setItem('choosenNoteId', this.noteId); // Запоминаем id выбранной заметки
      // Добавление описания заметки

      fetch('http://localhost:8080/api/data', {
        method: 'GET'
      }).then(function (response) {
        return response.json();
      }).then(function (data) {
        data.list.forEach(function (item) {
          if (_this.noteId == item.id) {
            _this.content.render(item, _this.render.bind(_this));
          }
        });
      }).catch(function (error) {
        return console.error(error);
      });
    } // ----------------Вспомогательные функции-----------------------
    // Удаление разметки

  }, {
    key: "_markUpRemoving",
    value: function _markUpRemoving(noteList) {
      noteList.forEach(function (item) {
        item.classList.remove('active');
      });
    } // Добавление разметки

  }, {
    key: "_markUpAddition",
    value: function _markUpAddition(noteId) {
      var choosenLi = document.getElementById(noteId);
      choosenLi.classList.add('active');
    } // Получение id заметки

  }, {
    key: "_getIdOfNote",
    value: function _getIdOfNote(target) {
      var idOfnote;

      if (!target.hasAttribute('id')) {
        idOfnote = target.parentNode.getAttribute('id');
      } else {
        idOfnote = target.getAttribute('id');
      }

      return idOfnote;
    } //--------------------------------------------------------

  }, {
    key: "render",
    value: function render(data) {
      var _this2 = this;

      this.data = data;
      this.container.innerHTML = '';
      data.forEach(function (item) {
        var template = "<li id=".concat(item.id, ">\n      <h3>").concat(item.title, "</h3>\n      <div>").concat(item.time, "</div>\n      </li>");
        _this2.container.innerHTML = _this2.container.innerHTML + template;
      });
      var activeItemId = Number(localStorage.getItem('choosenNoteId'));

      if (activeItemId) {
        this._markUpAddition(activeItemId);

        fetch('http://localhost:8080/api/data', {
          method: 'GET'
        }).then(function (response) {
          return response.json();
        }).then(function (data) {
          data.list.forEach(function (item) {
            if (activeItemId == item.id) {
              _this2.content.render(item, _this2.render.bind(_this2));
            }
          });
        }).catch(function (error) {
          return console.error(error);
        });
      }
    }
  }]);

  return List;
}();

exports.List = List;
},{"./content":"src/js/content.js"}],"src/js/form.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Form = void 0;

var _list = require("./list");

var _content = require("./content");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// import { response } from 'express';
// import { response } from 'express';
var Form = /*#__PURE__*/function () {
  function Form(form) {
    _classCallCheck(this, Form);

    this.form = form;
    this.inputTitle = document.querySelector('#title');
    this.inputContain = document.querySelector('#contain');
    this.closeButton = document.querySelector('#closeModal');
    this.idCounter = localStorage.getItem('id') || 0; // счетчик id

    this.noteList = document.querySelector('#noteList');
    this.list = new _list.List(this.noteList);
    this.oneNoteContent = document.querySelector('#oneNoteContent');

    this._init();
  }

  _createClass(Form, [{
    key: "_init",
    value: function _init() {
      this.form.addEventListener('submit', this._handleSubmit.bind(this));
      this.closeButton.addEventListener('click', this._handleCloseModal.bind(this));
    }
  }, {
    key: "_handleCloseModal",
    value: function _handleCloseModal() {
      this.oneNoteContent.classList.remove('underEdition'); // Индикатор добавления или изменения заметки

      this._resetForm(this.form);
    }
  }, {
    key: "_handleSubmit",
    value: function _handleSubmit(e) {
      e.preventDefault();
      var url = 'http://localhost:8080/api/data'; // Получение данных о времени

      var timeData = this._getDate(); // Проверка: редактирование или добавление заметки


      if (!this.oneNoteContent.classList.contains('underEdition')) {
        var newNoteData = this._сreateNoteData(timeData, this.idCounter); // Создание объекта


        this._editListOfNotes(url, 'POST', newNoteData);

        localStorage.setItem('id', ++this.idCounter); // Обновляем счетчик id
      } else {
        var noteId = localStorage.getItem('choosenNoteId');
        url += "/".concat(noteId);

        var _newNoteData = this._сreateNoteData(timeData, noteId); // Создание объекта


        this._editListOfNotes(url, 'PUT', _newNoteData);

        this.oneNoteContent.classList.remove('underEdition');
      }

      this._resetForm(this.form);

      $('#formModal').modal('hide');
    }
  }, {
    key: "_resetForm",
    value: function _resetForm(form) {
      form.reset();

      _toConsumableArray(form.querySelectorAll('[type="hidden"]')).forEach(function (input) {
        input.value = '';
      });
    }
  }, {
    key: "_parseNumber",
    value: function _parseNumber(num) {
      var parsedNum = num;

      if (parsedNum < 10) {
        return "0".concat(parsedNum);
      }

      return parsedNum;
    }
  }, {
    key: "_getDate",
    value: function _getDate() {
      var now = new Date();

      var month = this._parseNumber(now.getMonth() + 1);

      var year = now.getFullYear();

      var day = this._parseNumber(now.getDate());

      var hours = this._parseNumber(now.getHours());

      var minutes = this._parseNumber(now.getMinutes());

      return "".concat(day, ".").concat(month, ".").concat(year, " ").concat(hours, ":").concat(minutes);
    } // Создание или редактирование заметки

  }, {
    key: "_editListOfNotes",
    value: function _editListOfNotes(url, verb, newObj) {
      var _this = this;

      fetch(url, {
        method: verb,
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(newObj)
      }).then(function (response) {
        return response.json();
      }).then(function (data) {
        return _this.list.render(data.list);
      }).catch(function (error) {
        return console.error(error);
      });
    } // Создание заметки

  }, {
    key: "_\u0441reateNoteData",
    value: function _ReateNoteData(time, noteId) {
      var newNote = {};
      var formDa = new FormData(this.form);

      var _iterator = _createForOfIteratorHelper(formDa),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _step$value = _slicedToArray(_step.value, 2),
              name = _step$value[0],
              value = _step$value[1];

          newNote[name] = value;
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      newNote.time = time;
      newNote.id = noteId;
      return newNote;
    }
  }]);

  return Form;
}();

exports.Form = Form;
},{"./list":"src/js/list.js","./content":"src/js/content.js"}],"src/js/app.js":[function(require,module,exports) {
"use strict";

var _list = require("./list");

var _form = require("./form");

localStorage.setItem('choosenNoteId', null); // Обнулить ид выбранной заметки в списке

var formNode = document.querySelector('form');
new _form.Form(formNode);
var addBtn = document.querySelector('#addNote');
addBtn.addEventListener('click', function () {
  $('#formModal').modal('show');
});
var listNode = document.querySelector('#noteList');
var list = new _list.List(listNode);
fetch('http://localhost:8080/api/data', {
  method: 'GET'
}).then(function (response) {
  return response.json();
}).then(function (data) {
  list.render(data.list);
}).catch(function (error) {
  return console.error(error);
});
},{"./list":"src/js/list.js","./form":"src/js/form.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "63081" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/js/app.js"], null)
//# sourceMappingURL=app.77c12427.js.map