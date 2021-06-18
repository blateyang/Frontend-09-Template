/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./animation-demo.js":
/*!***************************!*\
  !*** ./animation-demo.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _animation_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./animation.js */ \"./animation.js\");\n\nvar tl = new _animation_js__WEBPACK_IMPORTED_MODULE_0__.Timeline();\ntl.add(new _animation_js__WEBPACK_IMPORTED_MODULE_0__.Animation({\n  set a(v) {\n    console.log(v);\n  }\n\n}, \"a\", 0, 100, 1000, 0, null, function (v) {\n  return v;\n}));\ntl.add(new _animation_js__WEBPACK_IMPORTED_MODULE_0__.Animation(document.querySelector(\"#el\").style, \"transform\", 0, 100, 1000, 0, null, function (v) {\n  return \"translateX(\".concat(v, \"px)\");\n}));\ntl.start();\n\n//# sourceURL=webpack://jsx/./animation-demo.js?");

/***/ }),

/***/ "./animation.js":
/*!**********************!*\
  !*** ./animation.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Timeline\": () => (/* binding */ Timeline),\n/* harmony export */   \"Animation\": () => (/* binding */ Animation)\n/* harmony export */ });\nfunction _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== \"undefined\" && o[Symbol.iterator] || o[\"@@iterator\"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === \"number\") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError(\"Invalid attempt to iterate non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.\"); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it[\"return\"] != null) it[\"return\"](); } finally { if (didErr) throw err; } } }; }\n\nfunction _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === \"string\") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === \"Object\" && o.constructor) n = o.constructor.name; if (n === \"Map\" || n === \"Set\") return Array.from(o); if (n === \"Arguments\" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }\n\nfunction _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nvar TICK = Symbol(\"tick\");\nvar TICK_HANDLER = Symbol(\"tick-handler\");\nvar ANIMATIONS = Symbol(\"animations\");\nvar START_TIME = Symbol(\"start-time\");\nvar Timeline = /*#__PURE__*/function () {\n  function Timeline() {\n    _classCallCheck(this, Timeline);\n\n    this[ANIMATIONS] = new Set(); //使用Symbol作为属性可以防止外部私自访问\n\n    this[START_TIME] = new Map();\n  }\n\n  _createClass(Timeline, [{\n    key: \"add\",\n    value: function add(animation) {\n      this[ANIMATIONS].add(animation);\n      this[START_TIME].set(animation, Date.now() + animation.delay);\n    }\n  }, {\n    key: \"start\",\n    value: function start() {\n      var _this = this;\n\n      var startTime = Date.now();\n\n      this[TICK] = function () {\n        // console.log(\"tick\")\n        var now = Date.now(); //      let t = Date.now() - startTime\n\n        var _iterator = _createForOfIteratorHelper(_this[ANIMATIONS]),\n            _step;\n\n        try {\n          for (_iterator.s(); !(_step = _iterator.n()).done;) {\n            var animation = _step.value;\n            var t = void 0; // 确定时间流逝的参照系\n\n            if (_this[START_TIME].get(animation) < startTime) t = now - startTime;else t = now - _this[START_TIME].get(animation);\n\n            if (animation.duration < t) {\n              _this[ANIMATIONS][\"delete\"](animation);\n\n              t = animation.duration;\n            }\n\n            animation.receive(t);\n          }\n        } catch (err) {\n          _iterator.e(err);\n        } finally {\n          _iterator.f();\n        }\n\n        _this[TICK_HANDLER] = requestAnimationFrame(_this[TICK]);\n      };\n\n      this[TICK]();\n    }\n  }, {\n    key: \"pause\",\n    value: function pause() {\n      if (this[TICK_HANDLER]) cancelAnimationFrame(this[TICK_HANDLER]);\n    }\n  }, {\n    key: \"resume\",\n    value: function resume() {\n      this[TICK]();\n    }\n  }, {\n    key: \"reset\",\n    value: function reset() {}\n  }]);\n\n  return Timeline;\n}();\nvar Animation = /*#__PURE__*/function () {\n  function Animation(object, property, startVal, endVal, duration, delay, timingFunction, template) {\n    _classCallCheck(this, Animation);\n\n    this.object = object;\n    this.property = property;\n    this.startVal = startVal;\n    this.endVal = endVal;\n    this.duration = duration;\n    this.delay = delay;\n    this.timingFunction = timingFunction;\n    this.template = template;\n  } // 执行属性根据时间变化\n\n\n  _createClass(Animation, [{\n    key: \"receive\",\n    value: function receive(time) {\n      var range = this.endVal - this.startVal;\n      this.object[this.property] = this.template(this.startVal + range * time / this.duration);\n    }\n  }]);\n\n  return Animation;\n}();\n\n//# sourceURL=webpack://jsx/./animation.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./animation-demo.js");
/******/ 	
/******/ })()
;