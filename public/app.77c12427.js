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

var Content = /*#__PURE__*/function () {
  function Content(container) {
    _classCallCheck(this, Content);

    this.container = container;
    this.noteInfo = {};
    this.noteId = null;
    this.updateList = null;
    this.data = [];
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
      btnNode.setAttribute('data-target', '#exampleModal');
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

      this.data.forEach(function (item) {
        if (idOfNote == item.id) {
          titleField.value = item.title;
          containField.value = item.content;
        }
      }); // Обновление LocalStorage
      // localStorage.setItem('data', JSON.stringify(this.data));
    }
  }, {
    key: "_handleRemovingOfNote",
    value: function _handleRemovingOfNote(e) {
      var _this = this;

      this.container.innerHTML = '';
      var idOfNote = e.currentTarget.getAttribute('data-id'); // Поиск по Id заметки и удаление ее из данных

      this.data.forEach(function (item, index) {
        if (idOfNote == item.id) {
          _this.data.splice(index, 1);
        }
      }); // Обновление LocalStorage

      localStorage.setItem('data', JSON.stringify(this.data));
      this.updateList(this.data);
    }
  }, {
    key: "render",
    value: function render(noteInfo, updateList, data) {
      this.noteInfo = noteInfo;
      this.updateList = updateList;
      this.data = data;
      this.noteId = noteInfo.id;
      this.container.innerHTML = '';
      var template = "\n    <div>".concat(noteInfo.time, "</div>\n    <p>").concat(noteInfo.content, "</p>\n  ");
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

      // если это не добавить, не сохраняются данные this.data
      this.data = JSON.parse(localStorage.getItem('data')); // Удаление разметки

      var arrOfNotes = this.container.querySelectorAll('li');
      arrOfNotes.forEach(function (item) {
        item.classList.remove('active');
      }); // Добавление разметки

      if (!e.target.hasAttribute('id')) {
        this.noteId = e.target.parentNode.getAttribute('id');
      } else {
        this.noteId = e.target.getAttribute('id');
      }

      var choosenLi = document.getElementById(this.noteId);
      choosenLi.classList.add('active'); // Добавление описания заметки

      this.data.forEach(function (item) {
        if (_this.noteId == item.id) {
          localStorage.setItem('choosenNoteId', _this.noteId);

          _this.content.render(item, _this.render.bind(_this), _this.data);
        }
      });
    }
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

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Form = /*#__PURE__*/function () {
  function Form(form) {
    _classCallCheck(this, Form);

    this.form = form;
    this.inputTitle = document.querySelector('#title');
    this.inputContain = document.querySelector('#contain');
    this.idCounter = localStorage.getItem('id') || 0; // this.data = [];

    this.closeButton = document.querySelector('#closeModal');
    this.noteList = document.querySelector('#noteList');
    this.oneNoteContent = document.querySelector('#oneNoteContent');
    this.noteEditor = document.querySelector('.contentEditor');
    this.list = new _list.List(this.noteList);
    this.oneNoteContent = document.querySelector('#oneNoteContent');
    this.content = new _content.Content(this.oneNoteContent);

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
      var _this = this;

      e.preventDefault();
      var data = JSON.parse(localStorage.getItem('data')) || []; // Получение данных о времени

      var timeData = this._getDate();

      var noteId = localStorage.getItem('choosenNoteId'); // Проверка: редактирование или добавление заметки

      if (!this.oneNoteContent.classList.contains('underEdition')) {
        data.push({
          title: this.inputTitle.value,
          content: this.inputContain.value,
          time: timeData,
          id: this.idCounter
        });
        ++this.idCounter;
        localStorage.setItem('id', this.idCounter);
      } else {
        // Поиск заметки по Id и ее изменение
        data.forEach(function (item, index) {
          if (noteId == item.id) {
            data[index].title = _this.inputTitle.value;
            data[index].content = _this.inputContain.value;

            _this.content.render(item, null, data);
          }
        });
      }

      this.oneNoteContent.classList.remove('underEdition');
      localStorage.setItem('data', JSON.stringify(data));
      this.list.render(data);
      var choosenNote = document.getElementById(noteId);
      if (choosenNote) choosenNote.classList.add('active');

      this._resetForm(this.form);

      $('#exampleModal').modal('hide');
    }
  }, {
    key: "_resetForm",
    value: function _resetForm(form) {
      form.reset(); // Найдём все скрытые поля в форме и сбросим их значение

      _toConsumableArray(form.querySelectorAll('[type="hidden"]')).forEach(function (input) {
        input.value = '';
      });
    }
  }, {
    key: "_parseNumber",
    value: function _parseNumber(num) {
      var parsedNum = num;

      if (parsedNum < 10) {
        return '0' + parsedNum;
      } else {
        return parsedNum;
      }
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
    }
  }]);

  return Form;
}();

exports.Form = Form;
},{"./list":"src/js/list.js","./content":"src/js/content.js"}],"src/js/app.js":[function(require,module,exports) {
"use strict";

var _list = require("./list");

var _form = require("./form");

var data = JSON.parse(localStorage.getItem('data')) || [];
localStorage.setItem('choosenNoteId', null); // Обнулить ид выбранной заметки

var formNode = document.querySelector('form');
new _form.Form(formNode);
var listNode = document.querySelector('#noteList');
var list = new _list.List(listNode);
list.render(data); //-------------------------------------------------------
// import Note from './note.js';
// let data = JSON.parse(localStorage.getItem('data')) || [];
// const yourNote = new Note();
// yourNote.createNoteList(data);
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "49716" + '/');

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