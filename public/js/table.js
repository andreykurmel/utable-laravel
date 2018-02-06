/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 44);
/******/ })
/************************************************************************/
/******/ ({

/***/ 1:
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ 10:
/***/ (function(module, exports) {

/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {/* globals __webpack_amd_options__ */
module.exports = __webpack_amd_options__;

/* WEBPACK VAR INJECTION */}.call(exports, {}))

/***/ }),

/***/ 2:
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),

/***/ 44:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(45);
__webpack_require__(46);
__webpack_require__(47);
__webpack_require__(48);
__webpack_require__(49);
__webpack_require__(50);
__webpack_require__(51);
__webpack_require__(52);
__webpack_require__(53);
module.exports = __webpack_require__(54);


/***/ }),

/***/ 45:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, module) {var __WEBPACK_AMD_DEFINE_RESULT__;var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * @license
 * Lodash lodash.com/license | Underscore.js 1.8.3 underscorejs.org/LICENSE
 */
;(function () {
  function n(n, t) {
    return n.set(t[0], t[1]), n;
  }function t(n, t) {
    return n.add(t), n;
  }function r(n, t, r) {
    switch (r.length) {case 0:
        return n.call(t);case 1:
        return n.call(t, r[0]);case 2:
        return n.call(t, r[0], r[1]);case 3:
        return n.call(t, r[0], r[1], r[2]);}return n.apply(t, r);
  }function e(n, t, r, e) {
    for (var u = -1, i = null == n ? 0 : n.length; ++u < i;) {
      var o = n[u];t(e, o, r(o), n);
    }return e;
  }function u(n, t) {
    for (var r = -1, e = null == n ? 0 : n.length; ++r < e && false !== t(n[r], r, n);) {}return n;
  }function i(n, t) {
    for (var r = null == n ? 0 : n.length; r-- && false !== t(n[r], r, n);) {}
    return n;
  }function o(n, t) {
    for (var r = -1, e = null == n ? 0 : n.length; ++r < e;) {
      if (!t(n[r], r, n)) return false;
    }return true;
  }function f(n, t) {
    for (var r = -1, e = null == n ? 0 : n.length, u = 0, i = []; ++r < e;) {
      var o = n[r];t(o, r, n) && (i[u++] = o);
    }return i;
  }function c(n, t) {
    return !(null == n || !n.length) && -1 < d(n, t, 0);
  }function a(n, t, r) {
    for (var e = -1, u = null == n ? 0 : n.length; ++e < u;) {
      if (r(t, n[e])) return true;
    }return false;
  }function l(n, t) {
    for (var r = -1, e = null == n ? 0 : n.length, u = Array(e); ++r < e;) {
      u[r] = t(n[r], r, n);
    }return u;
  }function s(n, t) {
    for (var r = -1, e = t.length, u = n.length; ++r < e;) {
      n[u + r] = t[r];
    }return n;
  }function h(n, t, r, e) {
    var u = -1,
        i = null == n ? 0 : n.length;for (e && i && (r = n[++u]); ++u < i;) {
      r = t(r, n[u], u, n);
    }return r;
  }function p(n, t, r, e) {
    var u = null == n ? 0 : n.length;for (e && u && (r = n[--u]); u--;) {
      r = t(r, n[u], u, n);
    }return r;
  }function _(n, t) {
    for (var r = -1, e = null == n ? 0 : n.length; ++r < e;) {
      if (t(n[r], r, n)) return true;
    }return false;
  }function v(n, t, r) {
    var e;return r(n, function (n, r, u) {
      if (t(n, r, u)) return e = r, false;
    }), e;
  }function g(n, t, r, e) {
    var u = n.length;for (r += e ? 1 : -1; e ? r-- : ++r < u;) {
      if (t(n[r], r, n)) return r;
    }return -1;
  }function d(n, t, r) {
    if (t === t) n: {
      --r;for (var e = n.length; ++r < e;) {
        if (n[r] === t) {
          n = r;break n;
        }
      }n = -1;
    } else n = g(n, b, r);return n;
  }function y(n, t, r, e) {
    --r;for (var u = n.length; ++r < u;) {
      if (e(n[r], t)) return r;
    }return -1;
  }function b(n) {
    return n !== n;
  }function x(n, t) {
    var r = null == n ? 0 : n.length;return r ? k(n, t) / r : P;
  }function j(n) {
    return function (t) {
      return null == t ? F : t[n];
    };
  }function w(n) {
    return function (t) {
      return null == n ? F : n[t];
    };
  }function m(n, t, r, e, u) {
    return u(n, function (n, u, i) {
      r = e ? (e = false, n) : t(r, n, u, i);
    }), r;
  }function A(n, t) {
    var r = n.length;for (n.sort(t); r--;) {
      n[r] = n[r].c;
    }return n;
  }function k(n, t) {
    for (var r, e = -1, u = n.length; ++e < u;) {
      var i = t(n[e]);i !== F && (r = r === F ? i : r + i);
    }return r;
  }function E(n, t) {
    for (var r = -1, e = Array(n); ++r < n;) {
      e[r] = t(r);
    }return e;
  }function O(n, t) {
    return l(t, function (t) {
      return [t, n[t]];
    });
  }function S(n) {
    return function (t) {
      return n(t);
    };
  }function I(n, t) {
    return l(t, function (t) {
      return n[t];
    });
  }function R(n, t) {
    return n.has(t);
  }function z(n, t) {
    for (var r = -1, e = n.length; ++r < e && -1 < d(t, n[r], 0);) {}return r;
  }function W(n, t) {
    for (var r = n.length; r-- && -1 < d(t, n[r], 0);) {}return r;
  }function B(n) {
    return "\\" + Tn[n];
  }function L(n) {
    var t = -1,
        r = Array(n.size);return n.forEach(function (n, e) {
      r[++t] = [e, n];
    }), r;
  }function U(n, t) {
    return function (r) {
      return n(t(r));
    };
  }function C(n, t) {
    for (var r = -1, e = n.length, u = 0, i = []; ++r < e;) {
      var o = n[r];o !== t && "__lodash_placeholder__" !== o || (n[r] = "__lodash_placeholder__", i[u++] = r);
    }return i;
  }function D(n) {
    var t = -1,
        r = Array(n.size);return n.forEach(function (n) {
      r[++t] = n;
    }), r;
  }function M(n) {
    var t = -1,
        r = Array(n.size);return n.forEach(function (n) {
      r[++t] = [n, n];
    }), r;
  }function T(n) {
    if (Bn.test(n)) {
      for (var t = zn.lastIndex = 0; zn.test(n);) {
        ++t;
      }n = t;
    } else n = tt(n);return n;
  }function $(n) {
    return Bn.test(n) ? n.match(zn) || [] : n.split("");
  }var F,
      N = 1 / 0,
      P = NaN,
      Z = [["ary", 128], ["bind", 1], ["bindKey", 2], ["curry", 8], ["curryRight", 16], ["flip", 512], ["partial", 32], ["partialRight", 64], ["rearg", 256]],
      q = /\b__p\+='';/g,
      V = /\b(__p\+=)''\+/g,
      K = /(__e\(.*?\)|\b__t\))\+'';/g,
      G = /&(?:amp|lt|gt|quot|#39);/g,
      H = /[&<>"']/g,
      J = RegExp(G.source),
      Y = RegExp(H.source),
      Q = /<%-([\s\S]+?)%>/g,
      X = /<%([\s\S]+?)%>/g,
      nn = /<%=([\s\S]+?)%>/g,
      tn = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
      rn = /^\w*$/,
      en = /^\./,
      un = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,
      on = /[\\^$.*+?()[\]{}|]/g,
      fn = RegExp(on.source),
      cn = /^\s+|\s+$/g,
      an = /^\s+/,
      ln = /\s+$/,
      sn = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/,
      hn = /\{\n\/\* \[wrapped with (.+)\] \*/,
      pn = /,? & /,
      _n = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g,
      vn = /\\(\\)?/g,
      gn = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g,
      dn = /\w*$/,
      yn = /^[-+]0x[0-9a-f]+$/i,
      bn = /^0b[01]+$/i,
      xn = /^\[object .+?Constructor\]$/,
      jn = /^0o[0-7]+$/i,
      wn = /^(?:0|[1-9]\d*)$/,
      mn = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g,
      An = /($^)/,
      kn = /['\n\r\u2028\u2029\\]/g,
      En = "[\\ufe0e\\ufe0f]?(?:[\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff]|\\ud83c[\\udffb-\\udfff])?(?:\\u200d(?:[^\\ud800-\\udfff]|(?:\\ud83c[\\udde6-\\uddff]){2}|[\\ud800-\\udbff][\\udc00-\\udfff])[\\ufe0e\\ufe0f]?(?:[\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff]|\\ud83c[\\udffb-\\udfff])?)*",
      On = "(?:[\\u2700-\\u27bf]|(?:\\ud83c[\\udde6-\\uddff]){2}|[\\ud800-\\udbff][\\udc00-\\udfff])" + En,
      Sn = "(?:[^\\ud800-\\udfff][\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff]?|[\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff]|(?:\\ud83c[\\udde6-\\uddff]){2}|[\\ud800-\\udbff][\\udc00-\\udfff]|[\\ud800-\\udfff])",
      In = RegExp("['\u2019]", "g"),
      Rn = RegExp("[\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff]", "g"),
      zn = RegExp("\\ud83c[\\udffb-\\udfff](?=\\ud83c[\\udffb-\\udfff])|" + Sn + En, "g"),
      Wn = RegExp(["[A-Z\\xc0-\\xd6\\xd8-\\xde]?[a-z\\xdf-\\xf6\\xf8-\\xff]+(?:['\u2019](?:d|ll|m|re|s|t|ve))?(?=[\\xac\\xb1\\xd7\\xf7\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf\\u2000-\\u206f \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000]|[A-Z\\xc0-\\xd6\\xd8-\\xde]|$)|(?:[A-Z\\xc0-\\xd6\\xd8-\\xde]|[^\\ud800-\\udfff\\xac\\xb1\\xd7\\xf7\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf\\u2000-\\u206f \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000\\d+\\u2700-\\u27bfa-z\\xdf-\\xf6\\xf8-\\xffA-Z\\xc0-\\xd6\\xd8-\\xde])+(?:['\u2019](?:D|LL|M|RE|S|T|VE))?(?=[\\xac\\xb1\\xd7\\xf7\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf\\u2000-\\u206f \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000]|[A-Z\\xc0-\\xd6\\xd8-\\xde](?:[a-z\\xdf-\\xf6\\xf8-\\xff]|[^\\ud800-\\udfff\\xac\\xb1\\xd7\\xf7\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf\\u2000-\\u206f \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000\\d+\\u2700-\\u27bfa-z\\xdf-\\xf6\\xf8-\\xffA-Z\\xc0-\\xd6\\xd8-\\xde])|$)|[A-Z\\xc0-\\xd6\\xd8-\\xde]?(?:[a-z\\xdf-\\xf6\\xf8-\\xff]|[^\\ud800-\\udfff\\xac\\xb1\\xd7\\xf7\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf\\u2000-\\u206f \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000\\d+\\u2700-\\u27bfa-z\\xdf-\\xf6\\xf8-\\xffA-Z\\xc0-\\xd6\\xd8-\\xde])+(?:['\u2019](?:d|ll|m|re|s|t|ve))?|[A-Z\\xc0-\\xd6\\xd8-\\xde]+(?:['\u2019](?:D|LL|M|RE|S|T|VE))?|\\d*(?:(?:1ST|2ND|3RD|(?![123])\\dTH)\\b)|\\d*(?:(?:1st|2nd|3rd|(?![123])\\dth)\\b)|\\d+", On].join("|"), "g"),
      Bn = RegExp("[\\u200d\\ud800-\\udfff\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff\\ufe0e\\ufe0f]"),
      Ln = /[a-z][A-Z]|[A-Z]{2,}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/,
      Un = "Array Buffer DataView Date Error Float32Array Float64Array Function Int8Array Int16Array Int32Array Map Math Object Promise RegExp Set String Symbol TypeError Uint8Array Uint8ClampedArray Uint16Array Uint32Array WeakMap _ clearTimeout isFinite parseInt setTimeout".split(" "),
      Cn = {};
  Cn["[object Float32Array]"] = Cn["[object Float64Array]"] = Cn["[object Int8Array]"] = Cn["[object Int16Array]"] = Cn["[object Int32Array]"] = Cn["[object Uint8Array]"] = Cn["[object Uint8ClampedArray]"] = Cn["[object Uint16Array]"] = Cn["[object Uint32Array]"] = true, Cn["[object Arguments]"] = Cn["[object Array]"] = Cn["[object ArrayBuffer]"] = Cn["[object Boolean]"] = Cn["[object DataView]"] = Cn["[object Date]"] = Cn["[object Error]"] = Cn["[object Function]"] = Cn["[object Map]"] = Cn["[object Number]"] = Cn["[object Object]"] = Cn["[object RegExp]"] = Cn["[object Set]"] = Cn["[object String]"] = Cn["[object WeakMap]"] = false;
  var Dn = {};Dn["[object Arguments]"] = Dn["[object Array]"] = Dn["[object ArrayBuffer]"] = Dn["[object DataView]"] = Dn["[object Boolean]"] = Dn["[object Date]"] = Dn["[object Float32Array]"] = Dn["[object Float64Array]"] = Dn["[object Int8Array]"] = Dn["[object Int16Array]"] = Dn["[object Int32Array]"] = Dn["[object Map]"] = Dn["[object Number]"] = Dn["[object Object]"] = Dn["[object RegExp]"] = Dn["[object Set]"] = Dn["[object String]"] = Dn["[object Symbol]"] = Dn["[object Uint8Array]"] = Dn["[object Uint8ClampedArray]"] = Dn["[object Uint16Array]"] = Dn["[object Uint32Array]"] = true, Dn["[object Error]"] = Dn["[object Function]"] = Dn["[object WeakMap]"] = false;var Mn,
      Tn = { "\\": "\\", "'": "'", "\n": "n", "\r": "r", "\u2028": "u2028", "\u2029": "u2029" },
      $n = parseFloat,
      Fn = parseInt,
      Nn = (typeof global === "undefined" ? "undefined" : _typeof(global)) == "object" && global && global.Object === Object && global,
      Pn = (typeof self === "undefined" ? "undefined" : _typeof(self)) == "object" && self && self.Object === Object && self,
      Zn = Nn || Pn || Function("return this")(),
      qn = ( false ? "undefined" : _typeof(exports)) == "object" && exports && !exports.nodeType && exports,
      Vn = qn && ( false ? "undefined" : _typeof(module)) == "object" && module && !module.nodeType && module,
      Kn = Vn && Vn.exports === qn,
      Gn = Kn && Nn.process;
  n: {
    try {
      Mn = Gn && Gn.binding && Gn.binding("util");break n;
    } catch (n) {}Mn = void 0;
  }var Hn = Mn && Mn.isArrayBuffer,
      Jn = Mn && Mn.isDate,
      Yn = Mn && Mn.isMap,
      Qn = Mn && Mn.isRegExp,
      Xn = Mn && Mn.isSet,
      nt = Mn && Mn.isTypedArray,
      tt = j("length"),
      rt = w({ "\xc0": "A", "\xc1": "A", "\xc2": "A", "\xc3": "A", "\xc4": "A", "\xc5": "A", "\xe0": "a", "\xe1": "a", "\xe2": "a", "\xe3": "a", "\xe4": "a", "\xe5": "a", "\xc7": "C", "\xe7": "c", "\xd0": "D", "\xf0": "d", "\xc8": "E", "\xc9": "E", "\xca": "E", "\xcb": "E", "\xe8": "e", "\xe9": "e", "\xea": "e", "\xeb": "e", "\xcc": "I", "\xcd": "I", "\xce": "I",
    "\xcf": "I", "\xec": "i", "\xed": "i", "\xee": "i", "\xef": "i", "\xd1": "N", "\xf1": "n", "\xd2": "O", "\xd3": "O", "\xd4": "O", "\xd5": "O", "\xd6": "O", "\xd8": "O", "\xf2": "o", "\xf3": "o", "\xf4": "o", "\xf5": "o", "\xf6": "o", "\xf8": "o", "\xd9": "U", "\xda": "U", "\xdb": "U", "\xdc": "U", "\xf9": "u", "\xfa": "u", "\xfb": "u", "\xfc": "u", "\xdd": "Y", "\xfd": "y", "\xff": "y", "\xc6": "Ae", "\xe6": "ae", "\xde": "Th", "\xfe": "th", "\xdf": "ss", "\u0100": "A", "\u0102": "A", "\u0104": "A", "\u0101": "a", "\u0103": "a", "\u0105": "a", "\u0106": "C", "\u0108": "C", "\u010A": "C",
    "\u010C": "C", "\u0107": "c", "\u0109": "c", "\u010B": "c", "\u010D": "c", "\u010E": "D", "\u0110": "D", "\u010F": "d", "\u0111": "d", "\u0112": "E", "\u0114": "E", "\u0116": "E", "\u0118": "E", "\u011A": "E", "\u0113": "e", "\u0115": "e", "\u0117": "e", "\u0119": "e", "\u011B": "e", "\u011C": "G", "\u011E": "G", "\u0120": "G", "\u0122": "G", "\u011D": "g", "\u011F": "g", "\u0121": "g", "\u0123": "g", "\u0124": "H", "\u0126": "H", "\u0125": "h", "\u0127": "h", "\u0128": "I", "\u012A": "I", "\u012C": "I", "\u012E": "I", "\u0130": "I", "\u0129": "i", "\u012B": "i", "\u012D": "i",
    "\u012F": "i", "\u0131": "i", "\u0134": "J", "\u0135": "j", "\u0136": "K", "\u0137": "k", "\u0138": "k", "\u0139": "L", "\u013B": "L", "\u013D": "L", "\u013F": "L", "\u0141": "L", "\u013A": "l", "\u013C": "l", "\u013E": "l", "\u0140": "l", "\u0142": "l", "\u0143": "N", "\u0145": "N", "\u0147": "N", "\u014A": "N", "\u0144": "n", "\u0146": "n", "\u0148": "n", "\u014B": "n", "\u014C": "O", "\u014E": "O", "\u0150": "O", "\u014D": "o", "\u014F": "o", "\u0151": "o", "\u0154": "R", "\u0156": "R", "\u0158": "R", "\u0155": "r", "\u0157": "r", "\u0159": "r", "\u015A": "S", "\u015C": "S",
    "\u015E": "S", "\u0160": "S", "\u015B": "s", "\u015D": "s", "\u015F": "s", "\u0161": "s", "\u0162": "T", "\u0164": "T", "\u0166": "T", "\u0163": "t", "\u0165": "t", "\u0167": "t", "\u0168": "U", "\u016A": "U", "\u016C": "U", "\u016E": "U", "\u0170": "U", "\u0172": "U", "\u0169": "u", "\u016B": "u", "\u016D": "u", "\u016F": "u", "\u0171": "u", "\u0173": "u", "\u0174": "W", "\u0175": "w", "\u0176": "Y", "\u0177": "y", "\u0178": "Y", "\u0179": "Z", "\u017B": "Z", "\u017D": "Z", "\u017A": "z", "\u017C": "z", "\u017E": "z", "\u0132": "IJ", "\u0133": "ij", "\u0152": "Oe", "\u0153": "oe",
    "\u0149": "'n", "\u017F": "s" }),
      et = w({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }),
      ut = w({ "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#39;": "'" }),
      it = function w(En) {
    function On(n) {
      if (xu(n) && !af(n) && !(n instanceof Mn)) {
        if (n instanceof zn) return n;if (ci.call(n, "__wrapped__")) return Pe(n);
      }return new zn(n);
    }function Sn() {}function zn(n, t) {
      this.__wrapped__ = n, this.__actions__ = [], this.__chain__ = !!t, this.__index__ = 0, this.__values__ = F;
    }function Mn(n) {
      this.__wrapped__ = n, this.__actions__ = [], this.__dir__ = 1, this.__filtered__ = false, this.__iteratees__ = [], this.__takeCount__ = 4294967295, this.__views__ = [];
    }function Tn(n) {
      var t = -1,
          r = null == n ? 0 : n.length;for (this.clear(); ++t < r;) {
        var e = n[t];this.set(e[0], e[1]);
      }
    }function Nn(n) {
      var t = -1,
          r = null == n ? 0 : n.length;for (this.clear(); ++t < r;) {
        var e = n[t];this.set(e[0], e[1]);
      }
    }function Pn(n) {
      var t = -1,
          r = null == n ? 0 : n.length;for (this.clear(); ++t < r;) {
        var e = n[t];this.set(e[0], e[1]);
      }
    }function qn(n) {
      var t = -1,
          r = null == n ? 0 : n.length;for (this.__data__ = new Pn(); ++t < r;) {
        this.add(n[t]);
      }
    }function Vn(n) {
      this.size = (this.__data__ = new Nn(n)).size;
    }function Gn(n, t) {
      var r,
          e = af(n),
          u = !e && cf(n),
          i = !e && !u && sf(n),
          o = !e && !u && !i && gf(n),
          u = (e = e || u || i || o) ? E(n.length, ri) : [],
          f = u.length;for (r in n) {
        !t && !ci.call(n, r) || e && ("length" == r || i && ("offset" == r || "parent" == r) || o && ("buffer" == r || "byteLength" == r || "byteOffset" == r) || Re(r, f)) || u.push(r);
      }return u;
    }function tt(n) {
      var t = n.length;return t ? n[cr(0, t - 1)] : F;
    }function ot(n, t) {
      return Te(Mr(n), gt(t, 0, n.length));
    }function ft(n) {
      return Te(Mr(n));
    }function ct(n, t, r) {
      (r === F || hu(n[t], r)) && (r !== F || t in n) || _t(n, t, r);
    }function at(n, t, r) {
      var e = n[t];ci.call(n, t) && hu(e, r) && (r !== F || t in n) || _t(n, t, r);
    }function lt(n, t) {
      for (var r = n.length; r--;) {
        if (hu(n[r][0], t)) return r;
      }return -1;
    }function st(n, t, r, e) {
      return oo(n, function (n, u, i) {
        t(e, n, r(n), i);
      }), e;
    }function ht(n, t) {
      return n && Tr(t, Lu(t), n);
    }function pt(n, t) {
      return n && Tr(t, Uu(t), n);
    }function _t(n, t, r) {
      "__proto__" == t && Ei ? Ei(n, t, { configurable: true, enumerable: true, value: r, writable: true }) : n[t] = r;
    }function vt(n, t) {
      for (var r = -1, e = t.length, u = Hu(e), i = null == n; ++r < e;) {
        u[r] = i ? F : Wu(n, t[r]);
      }return u;
    }function gt(n, t, r) {
      return n === n && (r !== F && (n = n <= r ? n : r), t !== F && (n = n >= t ? n : t)), n;
    }function dt(n, t, r, e, i, o) {
      var f,
          c = 1 & t,
          a = 2 & t,
          l = 4 & t;if (r && (f = i ? r(n, e, i, o) : r(n)), f !== F) return f;if (!bu(n)) return n;if (e = af(n)) {
        if (f = Ee(n), !c) return Mr(n, f);
      } else {
        var s = yo(n),
            h = "[object Function]" == s || "[object GeneratorFunction]" == s;if (sf(n)) return Wr(n, c);if ("[object Object]" == s || "[object Arguments]" == s || h && !i) {
          if (f = a || h ? {} : Oe(n), !c) return a ? Fr(n, pt(f, n)) : $r(n, ht(f, n));
        } else {
          if (!Dn[s]) return i ? n : {};f = Se(n, s, dt, c);
        }
      }if (o || (o = new Vn()), i = o.get(n)) return i;o.set(n, f);var a = l ? a ? ye : de : a ? Uu : Lu,
          p = e ? F : a(n);return u(p || n, function (e, u) {
        p && (u = e, e = n[u]), at(f, u, dt(e, t, r, u, n, o));
      }), f;
    }function yt(n) {
      var t = Lu(n);return function (r) {
        return bt(r, n, t);
      };
    }function bt(n, t, r) {
      var e = r.length;if (null == n) return !e;for (n = ni(n); e--;) {
        var u = r[e],
            i = t[u],
            o = n[u];if (o === F && !(u in n) || !i(o)) return false;
      }return true;
    }function xt(n, t, r) {
      if (typeof n != "function") throw new ei("Expected a function");return jo(function () {
        n.apply(F, r);
      }, t);
    }function jt(n, t, r, e) {
      var u = -1,
          i = c,
          o = true,
          f = n.length,
          s = [],
          h = t.length;
      if (!f) return s;r && (t = l(t, S(r))), e ? (i = a, o = false) : 200 <= t.length && (i = R, o = false, t = new qn(t));n: for (; ++u < f;) {
        var p = n[u],
            _ = null == r ? p : r(p),
            p = e || 0 !== p ? p : 0;if (o && _ === _) {
          for (var v = h; v--;) {
            if (t[v] === _) continue n;
          }s.push(p);
        } else i(t, _, e) || s.push(p);
      }return s;
    }function wt(n, t) {
      var r = true;return oo(n, function (n, e, u) {
        return r = !!t(n, e, u);
      }), r;
    }function mt(n, t, r) {
      for (var e = -1, u = n.length; ++e < u;) {
        var i = n[e],
            o = t(i);if (null != o && (f === F ? o === o && !Au(o) : r(o, f))) var f = o,
            c = i;
      }return c;
    }function At(n, t) {
      var r = [];return oo(n, function (n, e, u) {
        t(n, e, u) && r.push(n);
      }), r;
    }function kt(n, t, r, e, u) {
      var i = -1,
          o = n.length;for (r || (r = Ie), u || (u = []); ++i < o;) {
        var f = n[i];0 < t && r(f) ? 1 < t ? kt(f, t - 1, r, e, u) : s(u, f) : e || (u[u.length] = f);
      }return u;
    }function Et(n, t) {
      return n && co(n, t, Lu);
    }function Ot(n, t) {
      return n && ao(n, t, Lu);
    }function St(n, t) {
      return f(t, function (t) {
        return gu(n[t]);
      });
    }function It(n, t) {
      t = Rr(t, n);for (var r = 0, e = t.length; null != n && r < e;) {
        n = n[$e(t[r++])];
      }return r && r == e ? n : F;
    }function Rt(n, t, r) {
      return t = t(n), af(n) ? t : s(t, r(n));
    }function zt(n) {
      if (null == n) n = n === F ? "[object Undefined]" : "[object Null]";else if (ki && ki in ni(n)) {
        var t = ci.call(n, ki),
            r = n[ki];try {
          n[ki] = F;var e = true;
        } catch (n) {}var u = si.call(n);e && (t ? n[ki] = r : delete n[ki]), n = u;
      } else n = si.call(n);return n;
    }function Wt(n, t) {
      return n > t;
    }function Bt(n, t) {
      return null != n && ci.call(n, t);
    }function Lt(n, t) {
      return null != n && t in ni(n);
    }function Ut(n, t, r) {
      for (var e = r ? a : c, u = n[0].length, i = n.length, o = i, f = Hu(i), s = 1 / 0, h = []; o--;) {
        var p = n[o];o && t && (p = l(p, S(t))), s = Mi(p.length, s), f[o] = !r && (t || 120 <= u && 120 <= p.length) ? new qn(o && p) : F;
      }var p = n[0],
          _ = -1,
          v = f[0];n: for (; ++_ < u && h.length < s;) {
        var g = p[_],
            d = t ? t(g) : g,
            g = r || 0 !== g ? g : 0;
        if (v ? !R(v, d) : !e(h, d, r)) {
          for (o = i; --o;) {
            var y = f[o];if (y ? !R(y, d) : !e(n[o], d, r)) continue n;
          }v && v.push(d), h.push(g);
        }
      }return h;
    }function Ct(n, t, r) {
      var e = {};return Et(n, function (n, u, i) {
        t(e, r(n), u, i);
      }), e;
    }function Dt(n, t, e) {
      return t = Rr(t, n), n = 2 > t.length ? n : It(n, vr(t, 0, -1)), t = null == n ? n : n[$e(Ge(t))], null == t ? F : r(t, n, e);
    }function Mt(n) {
      return xu(n) && "[object Arguments]" == zt(n);
    }function Tt(n) {
      return xu(n) && "[object ArrayBuffer]" == zt(n);
    }function $t(n) {
      return xu(n) && "[object Date]" == zt(n);
    }function Ft(n, t, r, e, u) {
      if (n === t) t = true;else if (null == n || null == t || !xu(n) && !xu(t)) t = n !== n && t !== t;else n: {
        var i = af(n),
            o = af(t),
            f = i ? "[object Array]" : yo(n),
            c = o ? "[object Array]" : yo(t),
            f = "[object Arguments]" == f ? "[object Object]" : f,
            c = "[object Arguments]" == c ? "[object Object]" : c,
            a = "[object Object]" == f,
            o = "[object Object]" == c;if ((c = f == c) && sf(n)) {
          if (!sf(t)) {
            t = false;break n;
          }i = true, a = false;
        }if (c && !a) u || (u = new Vn()), t = i || gf(n) ? _e(n, t, r, e, Ft, u) : ve(n, t, f, r, e, Ft, u);else {
          if (!(1 & r) && (i = a && ci.call(n, "__wrapped__"), f = o && ci.call(t, "__wrapped__"), i || f)) {
            n = i ? n.value() : n, t = f ? t.value() : t, u || (u = new Vn()), t = Ft(n, t, r, e, u);break n;
          }if (c) {
            t: if (u || (u = new Vn()), i = 1 & r, f = de(n), o = f.length, c = de(t).length, o == c || i) {
              for (a = o; a--;) {
                var l = f[a];if (!(i ? l in t : ci.call(t, l))) {
                  t = false;break t;
                }
              }if ((c = u.get(n)) && u.get(t)) t = c == t;else {
                c = true, u.set(n, t), u.set(t, n);for (var s = i; ++a < o;) {
                  var l = f[a],
                      h = n[l],
                      p = t[l];if (e) var _ = i ? e(p, h, l, t, n, u) : e(h, p, l, n, t, u);if (_ === F ? h !== p && !Ft(h, p, r, e, u) : !_) {
                    c = false;break;
                  }s || (s = "constructor" == l);
                }c && !s && (r = n.constructor, e = t.constructor, r != e && "constructor" in n && "constructor" in t && !(typeof r == "function" && r instanceof r && typeof e == "function" && e instanceof e) && (c = false)), u.delete(n), u.delete(t), t = c;
              }
            } else t = false;
          } else t = false;
        }
      }return t;
    }function Nt(n) {
      return xu(n) && "[object Map]" == yo(n);
    }function Pt(n, t, r, e) {
      var u = r.length,
          i = u,
          o = !e;if (null == n) return !i;for (n = ni(n); u--;) {
        var f = r[u];if (o && f[2] ? f[1] !== n[f[0]] : !(f[0] in n)) return false;
      }for (; ++u < i;) {
        var f = r[u],
            c = f[0],
            a = n[c],
            l = f[1];if (o && f[2]) {
          if (a === F && !(c in n)) return false;
        } else {
          if (f = new Vn(), e) var s = e(a, l, c, n, t, f);if (s === F ? !Ft(l, a, 3, e, f) : !s) return false;
        }
      }return true;
    }function Zt(n) {
      return !(!bu(n) || li && li in n) && (gu(n) ? _i : xn).test(Fe(n));
    }function qt(n) {
      return xu(n) && "[object RegExp]" == zt(n);
    }function Vt(n) {
      return xu(n) && "[object Set]" == yo(n);
    }function Kt(n) {
      return xu(n) && yu(n.length) && !!Cn[zt(n)];
    }function Gt(n) {
      return typeof n == "function" ? n : null == n ? Nu : (typeof n === "undefined" ? "undefined" : _typeof(n)) == "object" ? af(n) ? Xt(n[0], n[1]) : Qt(n) : Vu(n);
    }function Ht(n) {
      if (!Le(n)) return Ci(n);var t,
          r = [];for (t in ni(n)) {
        ci.call(n, t) && "constructor" != t && r.push(t);
      }return r;
    }function Jt(n, t) {
      return n < t;
    }function Yt(n, t) {
      var r = -1,
          e = pu(n) ? Hu(n.length) : [];return oo(n, function (n, u, i) {
        e[++r] = t(n, u, i);
      }), e;
    }function Qt(n) {
      var t = me(n);return 1 == t.length && t[0][2] ? Ue(t[0][0], t[0][1]) : function (r) {
        return r === n || Pt(r, n, t);
      };
    }function Xt(n, t) {
      return We(n) && t === t && !bu(t) ? Ue($e(n), t) : function (r) {
        var e = Wu(r, n);return e === F && e === t ? Bu(r, n) : Ft(t, e, 3);
      };
    }function nr(n, t, r, e, u) {
      n !== t && co(t, function (i, o) {
        if (bu(i)) {
          u || (u = new Vn());var f = u,
              c = n[o],
              a = t[o],
              l = f.get(a);if (l) ct(n, o, l);else {
            var l = e ? e(c, a, o + "", n, t, f) : F,
                s = l === F;if (s) {
              var h = af(a),
                  p = !h && sf(a),
                  _ = !h && !p && gf(a),
                  l = a;h || p || _ ? af(c) ? l = c : _u(c) ? l = Mr(c) : p ? (s = false, l = Wr(a, true)) : _ ? (s = false, l = Lr(a, true)) : l = [] : wu(a) || cf(a) ? (l = c, cf(c) ? l = Ru(c) : (!bu(c) || r && gu(c)) && (l = Oe(a))) : s = false;
            }s && (f.set(a, l), nr(l, a, r, e, f), f.delete(a)), ct(n, o, l);
          }
        } else f = e ? e(n[o], i, o + "", n, t, u) : F, f === F && (f = i), ct(n, o, f);
      }, Uu);
    }function tr(n, t) {
      var r = n.length;if (r) return t += 0 > t ? r : 0, Re(t, r) ? n[t] : F;
    }function rr(n, t, r) {
      var e = -1;return t = l(t.length ? t : [Nu], S(je())), n = Yt(n, function (n) {
        return { a: l(t, function (t) {
            return t(n);
          }), b: ++e, c: n };
      }), A(n, function (n, t) {
        var e;n: {
          e = -1;for (var u = n.a, i = t.a, o = u.length, f = r.length; ++e < o;) {
            var c = Ur(u[e], i[e]);if (c) {
              e = e >= f ? c : c * ("desc" == r[e] ? -1 : 1);
              break n;
            }
          }e = n.b - t.b;
        }return e;
      });
    }function er(n, t) {
      return ur(n, t, function (t, r) {
        return Bu(n, r);
      });
    }function ur(n, t, r) {
      for (var e = -1, u = t.length, i = {}; ++e < u;) {
        var o = t[e],
            f = It(n, o);r(f, o) && pr(i, Rr(o, n), f);
      }return i;
    }function ir(n) {
      return function (t) {
        return It(t, n);
      };
    }function or(n, t, r, e) {
      var u = e ? y : d,
          i = -1,
          o = t.length,
          f = n;for (n === t && (t = Mr(t)), r && (f = l(n, S(r))); ++i < o;) {
        for (var c = 0, a = t[i], a = r ? r(a) : a; -1 < (c = u(f, a, c, e));) {
          f !== n && wi.call(f, c, 1), wi.call(n, c, 1);
        }
      }return n;
    }function fr(n, t) {
      for (var r = n ? t.length : 0, e = r - 1; r--;) {
        var u = t[r];
        if (r == e || u !== i) {
          var i = u;Re(u) ? wi.call(n, u, 1) : mr(n, u);
        }
      }
    }function cr(n, t) {
      return n + zi(Fi() * (t - n + 1));
    }function ar(n, t) {
      var r = "";if (!n || 1 > t || 9007199254740991 < t) return r;do {
        t % 2 && (r += n), (t = zi(t / 2)) && (n += n);
      } while (t);return r;
    }function lr(n, t) {
      return wo(Ce(n, t, Nu), n + "");
    }function sr(n) {
      return tt(Du(n));
    }function hr(n, t) {
      var r = Du(n);return Te(r, gt(t, 0, r.length));
    }function pr(n, t, r, e) {
      if (!bu(n)) return n;t = Rr(t, n);for (var u = -1, i = t.length, o = i - 1, f = n; null != f && ++u < i;) {
        var c = $e(t[u]),
            a = r;if (u != o) {
          var l = f[c],
              a = e ? e(l, c, f) : F;
          a === F && (a = bu(l) ? l : Re(t[u + 1]) ? [] : {});
        }at(f, c, a), f = f[c];
      }return n;
    }function _r(n) {
      return Te(Du(n));
    }function vr(n, t, r) {
      var e = -1,
          u = n.length;for (0 > t && (t = -t > u ? 0 : u + t), r = r > u ? u : r, 0 > r && (r += u), u = t > r ? 0 : r - t >>> 0, t >>>= 0, r = Hu(u); ++e < u;) {
        r[e] = n[e + t];
      }return r;
    }function gr(n, t) {
      var r;return oo(n, function (n, e, u) {
        return r = t(n, e, u), !r;
      }), !!r;
    }function dr(n, t, r) {
      var e = 0,
          u = null == n ? e : n.length;if (typeof t == "number" && t === t && 2147483647 >= u) {
        for (; e < u;) {
          var i = e + u >>> 1,
              o = n[i];null !== o && !Au(o) && (r ? o <= t : o < t) ? e = i + 1 : u = i;
        }return u;
      }return yr(n, t, Nu, r);
    }function yr(n, t, r, e) {
      t = r(t);for (var u = 0, i = null == n ? 0 : n.length, o = t !== t, f = null === t, c = Au(t), a = t === F; u < i;) {
        var l = zi((u + i) / 2),
            s = r(n[l]),
            h = s !== F,
            p = null === s,
            _ = s === s,
            v = Au(s);(o ? e || _ : a ? _ && (e || h) : f ? _ && h && (e || !p) : c ? _ && h && !p && (e || !v) : p || v ? 0 : e ? s <= t : s < t) ? u = l + 1 : i = l;
      }return Mi(i, 4294967294);
    }function br(n, t) {
      for (var r = -1, e = n.length, u = 0, i = []; ++r < e;) {
        var o = n[r],
            f = t ? t(o) : o;if (!r || !hu(f, c)) {
          var c = f;i[u++] = 0 === o ? 0 : o;
        }
      }return i;
    }function xr(n) {
      return typeof n == "number" ? n : Au(n) ? P : +n;
    }function jr(n) {
      if (typeof n == "string") return n;
      if (af(n)) return l(n, jr) + "";if (Au(n)) return uo ? uo.call(n) : "";var t = n + "";return "0" == t && 1 / n == -N ? "-0" : t;
    }function wr(n, t, r) {
      var e = -1,
          u = c,
          i = n.length,
          o = true,
          f = [],
          l = f;if (r) o = false, u = a;else if (200 <= i) {
        if (u = t ? null : po(n)) return D(u);o = false, u = R, l = new qn();
      } else l = t ? [] : f;n: for (; ++e < i;) {
        var s = n[e],
            h = t ? t(s) : s,
            s = r || 0 !== s ? s : 0;if (o && h === h) {
          for (var p = l.length; p--;) {
            if (l[p] === h) continue n;
          }t && l.push(h), f.push(s);
        } else u(l, h, r) || (l !== f && l.push(h), f.push(s));
      }return f;
    }function mr(n, t) {
      return t = Rr(t, n), n = 2 > t.length ? n : It(n, vr(t, 0, -1)), null == n || delete n[$e(Ge(t))];
    }function Ar(n, t, r, e) {
      for (var u = n.length, i = e ? u : -1; (e ? i-- : ++i < u) && t(n[i], i, n);) {}return r ? vr(n, e ? 0 : i, e ? i + 1 : u) : vr(n, e ? i + 1 : 0, e ? u : i);
    }function kr(n, t) {
      var r = n;return r instanceof Mn && (r = r.value()), h(t, function (n, t) {
        return t.func.apply(t.thisArg, s([n], t.args));
      }, r);
    }function Er(n, t, r) {
      var e = n.length;if (2 > e) return e ? wr(n[0]) : [];for (var u = -1, i = Hu(e); ++u < e;) {
        for (var o = n[u], f = -1; ++f < e;) {
          f != u && (i[u] = jt(i[u] || o, n[f], t, r));
        }
      }return wr(kt(i, 1), t, r);
    }function Or(n, t, r) {
      for (var e = -1, u = n.length, i = t.length, o = {}; ++e < u;) {
        r(o, n[e], e < i ? t[e] : F);
      }return o;
    }function Sr(n) {
      return _u(n) ? n : [];
    }function Ir(n) {
      return typeof n == "function" ? n : Nu;
    }function Rr(n, t) {
      return af(n) ? n : We(n, t) ? [n] : mo(zu(n));
    }function zr(n, t, r) {
      var e = n.length;return r = r === F ? e : r, !t && r >= e ? n : vr(n, t, r);
    }function Wr(n, t) {
      if (t) return n.slice();var r = n.length,
          r = yi ? yi(r) : new n.constructor(r);return n.copy(r), r;
    }function Br(n) {
      var t = new n.constructor(n.byteLength);return new di(t).set(new di(n)), t;
    }function Lr(n, t) {
      return new n.constructor(t ? Br(n.buffer) : n.buffer, n.byteOffset, n.length);
    }function Ur(n, t) {
      if (n !== t) {
        var r = n !== F,
            e = null === n,
            u = n === n,
            i = Au(n),
            o = t !== F,
            f = null === t,
            c = t === t,
            a = Au(t);if (!f && !a && !i && n > t || i && o && c && !f && !a || e && o && c || !r && c || !u) return 1;if (!e && !i && !a && n < t || a && r && u && !e && !i || f && r && u || !o && u || !c) return -1;
      }return 0;
    }function Cr(n, t, r, e) {
      var u = -1,
          i = n.length,
          o = r.length,
          f = -1,
          c = t.length,
          a = Di(i - o, 0),
          l = Hu(c + a);for (e = !e; ++f < c;) {
        l[f] = t[f];
      }for (; ++u < o;) {
        (e || u < i) && (l[r[u]] = n[u]);
      }for (; a--;) {
        l[f++] = n[u++];
      }return l;
    }function Dr(n, t, r, e) {
      var u = -1,
          i = n.length,
          o = -1,
          f = r.length,
          c = -1,
          a = t.length,
          l = Di(i - f, 0),
          s = Hu(l + a);
      for (e = !e; ++u < l;) {
        s[u] = n[u];
      }for (l = u; ++c < a;) {
        s[l + c] = t[c];
      }for (; ++o < f;) {
        (e || u < i) && (s[l + r[o]] = n[u++]);
      }return s;
    }function Mr(n, t) {
      var r = -1,
          e = n.length;for (t || (t = Hu(e)); ++r < e;) {
        t[r] = n[r];
      }return t;
    }function Tr(n, t, r, e) {
      var u = !r;r || (r = {});for (var i = -1, o = t.length; ++i < o;) {
        var f = t[i],
            c = e ? e(r[f], n[f], f, r, n) : F;c === F && (c = n[f]), u ? _t(r, f, c) : at(r, f, c);
      }return r;
    }function $r(n, t) {
      return Tr(n, vo(n), t);
    }function Fr(n, t) {
      return Tr(n, go(n), t);
    }function Nr(n, t) {
      return function (r, u) {
        var i = af(r) ? e : st,
            o = t ? t() : {};return i(r, n, je(u, 2), o);
      };
    }function Pr(n) {
      return lr(function (t, r) {
        var e = -1,
            u = r.length,
            i = 1 < u ? r[u - 1] : F,
            o = 2 < u ? r[2] : F,
            i = 3 < n.length && typeof i == "function" ? (u--, i) : F;for (o && ze(r[0], r[1], o) && (i = 3 > u ? F : i, u = 1), t = ni(t); ++e < u;) {
          (o = r[e]) && n(t, o, e, i);
        }return t;
      });
    }function Zr(n, t) {
      return function (r, e) {
        if (null == r) return r;if (!pu(r)) return n(r, e);for (var u = r.length, i = t ? u : -1, o = ni(r); (t ? i-- : ++i < u) && false !== e(o[i], i, o);) {}return r;
      };
    }function qr(n) {
      return function (t, r, e) {
        var u = -1,
            i = ni(t);e = e(t);for (var o = e.length; o--;) {
          var f = e[n ? o : ++u];if (false === r(i[f], f, i)) break;
        }return t;
      };
    }function Vr(n, t, r) {
      function e() {
        return (this && this !== Zn && this instanceof e ? i : n).apply(u ? r : this, arguments);
      }var u = 1 & t,
          i = Hr(n);return e;
    }function Kr(n) {
      return function (t) {
        t = zu(t);var r = Bn.test(t) ? $(t) : F,
            e = r ? r[0] : t.charAt(0);return t = r ? zr(r, 1).join("") : t.slice(1), e[n]() + t;
      };
    }function Gr(n) {
      return function (t) {
        return h($u(Tu(t).replace(In, "")), n, "");
      };
    }function Hr(n) {
      return function () {
        var t = arguments;switch (t.length) {case 0:
            return new n();case 1:
            return new n(t[0]);case 2:
            return new n(t[0], t[1]);case 3:
            return new n(t[0], t[1], t[2]);case 4:
            return new n(t[0], t[1], t[2], t[3]);case 5:
            return new n(t[0], t[1], t[2], t[3], t[4]);case 6:
            return new n(t[0], t[1], t[2], t[3], t[4], t[5]);case 7:
            return new n(t[0], t[1], t[2], t[3], t[4], t[5], t[6]);}var r = io(n.prototype),
            t = n.apply(r, t);return bu(t) ? t : r;
      };
    }function Jr(n, t, e) {
      function u() {
        for (var o = arguments.length, f = Hu(o), c = o, a = xe(u); c--;) {
          f[c] = arguments[c];
        }return c = 3 > o && f[0] !== a && f[o - 1] !== a ? [] : C(f, a), o -= c.length, o < e ? fe(n, t, Xr, u.placeholder, F, f, c, F, F, e - o) : r(this && this !== Zn && this instanceof u ? i : n, this, f);
      }var i = Hr(n);return u;
    }function Yr(n) {
      return function (t, r, e) {
        var u = ni(t);if (!pu(t)) {
          var i = je(r, 3);t = Lu(t), r = function r(n) {
            return i(u[n], n, u);
          };
        }return r = n(t, r, e), -1 < r ? u[i ? t[r] : r] : F;
      };
    }function Qr(n) {
      return ge(function (t) {
        var r = t.length,
            e = r,
            u = zn.prototype.thru;for (n && t.reverse(); e--;) {
          var i = t[e];if (typeof i != "function") throw new ei("Expected a function");if (u && !o && "wrapper" == be(i)) var o = new zn([], true);
        }for (e = o ? e : r; ++e < r;) {
          var i = t[e],
              u = be(i),
              f = "wrapper" == u ? _o(i) : F,
              o = f && Be(f[0]) && 424 == f[1] && !f[4].length && 1 == f[9] ? o[be(f[0])].apply(o, f[3]) : 1 == i.length && Be(i) ? o[u]() : o.thru(i);
        }return function () {
          var n = arguments,
              e = n[0];if (o && 1 == n.length && af(e)) return o.plant(e).value();for (var u = 0, n = r ? t[u].apply(this, n) : e; ++u < r;) {
            n = t[u].call(this, n);
          }return n;
        };
      });
    }function Xr(n, t, r, e, u, i, o, f, c, a) {
      function l() {
        for (var d = arguments.length, y = Hu(d), b = d; b--;) {
          y[b] = arguments[b];
        }if (_) {
          var x,
              j = xe(l),
              b = y.length;for (x = 0; b--;) {
            y[b] === j && ++x;
          }
        }if (e && (y = Cr(y, e, u, _)), i && (y = Dr(y, i, o, _)), d -= x, _ && d < a) return j = C(y, j), fe(n, t, Xr, l.placeholder, r, y, j, f, c, a - d);if (j = h ? r : this, b = p ? j[n] : n, d = y.length, f) {
          x = y.length;for (var w = Mi(f.length, x), m = Mr(y); w--;) {
            var A = f[w];y[w] = Re(A, x) ? m[A] : F;
          }
        } else v && 1 < d && y.reverse();return s && c < d && (y.length = c), this && this !== Zn && this instanceof l && (b = g || Hr(b)), b.apply(j, y);
      }var s = 128 & t,
          h = 1 & t,
          p = 2 & t,
          _ = 24 & t,
          v = 512 & t,
          g = p ? F : Hr(n);return l;
    }function ne(n, t) {
      return function (r, e) {
        return Ct(r, n, t(e));
      };
    }function te(n, t) {
      return function (r, e) {
        var u;if (r === F && e === F) return t;if (r !== F && (u = r), e !== F) {
          if (u === F) return e;typeof r == "string" || typeof e == "string" ? (r = jr(r), e = jr(e)) : (r = xr(r), e = xr(e)), u = n(r, e);
        }return u;
      };
    }function re(n) {
      return ge(function (t) {
        return t = l(t, S(je())), lr(function (e) {
          var u = this;return n(t, function (n) {
            return r(n, u, e);
          });
        });
      });
    }function ee(n, t) {
      t = t === F ? " " : jr(t);var r = t.length;return 2 > r ? r ? ar(t, n) : t : (r = ar(t, Ri(n / T(t))), Bn.test(t) ? zr($(r), 0, n).join("") : r.slice(0, n));
    }function ue(n, t, e, u) {
      function i() {
        for (var t = -1, c = arguments.length, a = -1, l = u.length, s = Hu(l + c), h = this && this !== Zn && this instanceof i ? f : n; ++a < l;) {
          s[a] = u[a];
        }for (; c--;) {
          s[a++] = arguments[++t];
        }return r(h, o ? e : this, s);
      }var o = 1 & t,
          f = Hr(n);return i;
    }function ie(n) {
      return function (t, r, e) {
        e && typeof e != "number" && ze(t, r, e) && (r = e = F), t = Eu(t), r === F ? (r = t, t = 0) : r = Eu(r), e = e === F ? t < r ? 1 : -1 : Eu(e);var u = -1;r = Di(Ri((r - t) / (e || 1)), 0);for (var i = Hu(r); r--;) {
          i[n ? r : ++u] = t, t += e;
        }return i;
      };
    }function oe(n) {
      return function (t, r) {
        return typeof t == "string" && typeof r == "string" || (t = Iu(t), r = Iu(r)), n(t, r);
      };
    }function fe(n, t, r, e, u, i, o, f, c, a) {
      var l = 8 & t,
          s = l ? o : F;o = l ? F : o;var h = l ? i : F;return i = l ? F : i, t = (t | (l ? 32 : 64)) & ~(l ? 64 : 32), 4 & t || (t &= -4), u = [n, t, u, h, s, i, o, f, c, a], r = r.apply(F, u), Be(n) && xo(r, u), r.placeholder = e, De(r, n, t);
    }function ce(n) {
      var t = Xu[n];return function (n, r) {
        if (n = Iu(n), r = null == r ? 0 : Mi(Ou(r), 292)) {
          var e = (zu(n) + "e").split("e"),
              e = t(e[0] + "e" + (+e[1] + r)),
              e = (zu(e) + "e").split("e");return +(e[0] + "e" + (+e[1] - r));
        }return t(n);
      };
    }function ae(n) {
      return function (t) {
        var r = yo(t);return "[object Map]" == r ? L(t) : "[object Set]" == r ? M(t) : O(t, n(t));
      };
    }function le(n, t, r, e, u, i, o, f) {
      var c = 2 & t;if (!c && typeof n != "function") throw new ei("Expected a function");var a = e ? e.length : 0;if (a || (t &= -97, e = u = F), o = o === F ? o : Di(Ou(o), 0), f = f === F ? f : Ou(f), a -= u ? u.length : 0, 64 & t) {
        var l = e,
            s = u;e = u = F;
      }var h = c ? F : _o(n);return i = [n, t, r, e, u, l, s, i, o, f], h && (r = i[1], n = h[1], t = r | n, e = 128 == n && 8 == r || 128 == n && 256 == r && i[7].length <= h[8] || 384 == n && h[7].length <= h[8] && 8 == r, 131 > t || e) && (1 & n && (i[2] = h[2], t |= 1 & r ? 0 : 4), (r = h[3]) && (e = i[3], i[3] = e ? Cr(e, r, h[4]) : r, i[4] = e ? C(i[3], "__lodash_placeholder__") : h[4]), (r = h[5]) && (e = i[5], i[5] = e ? Dr(e, r, h[6]) : r, i[6] = e ? C(i[5], "__lodash_placeholder__") : h[6]), (r = h[7]) && (i[7] = r), 128 & n && (i[8] = null == i[8] ? h[8] : Mi(i[8], h[8])), null == i[9] && (i[9] = h[9]), i[0] = h[0], i[1] = t), n = i[0], t = i[1], r = i[2], e = i[3], u = i[4], f = i[9] = i[9] === F ? c ? 0 : n.length : Di(i[9] - a, 0), !f && 24 & t && (t &= -25), De((h ? lo : xo)(t && 1 != t ? 8 == t || 16 == t ? Jr(n, t, f) : 32 != t && 33 != t || u.length ? Xr.apply(F, i) : ue(n, t, r, e) : Vr(n, t, r), i), n, t);
    }function se(n, t, r, e) {
      return n === F || hu(n, ii[r]) && !ci.call(e, r) ? t : n;
    }function he(n, t, r, e, u, i) {
      return bu(n) && bu(t) && (i.set(t, n), nr(n, t, F, he, i), i.delete(t)), n;
    }function pe(n) {
      return wu(n) ? F : n;
    }function _e(n, t, r, e, u, i) {
      var o = 1 & r,
          f = n.length,
          c = t.length;if (f != c && !(o && c > f)) return false;if ((c = i.get(n)) && i.get(t)) return c == t;var c = -1,
          a = true,
          l = 2 & r ? new qn() : F;
      for (i.set(n, t), i.set(t, n); ++c < f;) {
        var s = n[c],
            h = t[c];if (e) var p = o ? e(h, s, c, t, n, i) : e(s, h, c, n, t, i);if (p !== F) {
          if (p) continue;a = false;break;
        }if (l) {
          if (!_(t, function (n, t) {
            if (!R(l, t) && (s === n || u(s, n, r, e, i))) return l.push(t);
          })) {
            a = false;break;
          }
        } else if (s !== h && !u(s, h, r, e, i)) {
          a = false;break;
        }
      }return i.delete(n), i.delete(t), a;
    }function ve(n, t, r, e, u, i, o) {
      switch (r) {case "[object DataView]":
          if (n.byteLength != t.byteLength || n.byteOffset != t.byteOffset) break;n = n.buffer, t = t.buffer;case "[object ArrayBuffer]":
          if (n.byteLength != t.byteLength || !i(new di(n), new di(t))) break;
          return true;case "[object Boolean]":case "[object Date]":case "[object Number]":
          return hu(+n, +t);case "[object Error]":
          return n.name == t.name && n.message == t.message;case "[object RegExp]":case "[object String]":
          return n == t + "";case "[object Map]":
          var f = L;case "[object Set]":
          if (f || (f = D), n.size != t.size && !(1 & e)) break;return (r = o.get(n)) ? r == t : (e |= 2, o.set(n, t), t = _e(f(n), f(t), e, u, i, o), o.delete(n), t);case "[object Symbol]":
          if (eo) return eo.call(n) == eo.call(t);}return false;
    }function ge(n) {
      return wo(Ce(n, F, Ve), n + "");
    }function de(n) {
      return Rt(n, Lu, vo);
    }function ye(n) {
      return Rt(n, Uu, go);
    }function be(n) {
      for (var t = n.name + "", r = Ji[t], e = ci.call(Ji, t) ? r.length : 0; e--;) {
        var u = r[e],
            i = u.func;if (null == i || i == n) return u.name;
      }return t;
    }function xe(n) {
      return (ci.call(On, "placeholder") ? On : n).placeholder;
    }function je() {
      var n = On.iteratee || Pu,
          n = n === Pu ? Gt : n;return arguments.length ? n(arguments[0], arguments[1]) : n;
    }function we(n, t) {
      var r = n.__data__,
          e = typeof t === "undefined" ? "undefined" : _typeof(t);return ("string" == e || "number" == e || "symbol" == e || "boolean" == e ? "__proto__" !== t : null === t) ? r[typeof t == "string" ? "string" : "hash"] : r.map;
    }function me(n) {
      for (var t = Lu(n), r = t.length; r--;) {
        var e = t[r],
            u = n[e];t[r] = [e, u, u === u && !bu(u)];
      }return t;
    }function Ae(n, t) {
      var r = null == n ? F : n[t];return Zt(r) ? r : F;
    }function ke(n, t, r) {
      t = Rr(t, n);for (var e = -1, u = t.length, i = false; ++e < u;) {
        var o = $e(t[e]);if (!(i = null != n && r(n, o))) break;n = n[o];
      }return i || ++e != u ? i : (u = null == n ? 0 : n.length, !!u && yu(u) && Re(o, u) && (af(n) || cf(n)));
    }function Ee(n) {
      var t = n.length,
          r = n.constructor(t);return t && "string" == typeof n[0] && ci.call(n, "index") && (r.index = n.index, r.input = n.input), r;
    }function Oe(n) {
      return typeof n.constructor != "function" || Le(n) ? {} : io(bi(n));
    }function Se(r, e, u, i) {
      var o = r.constructor;switch (e) {case "[object ArrayBuffer]":
          return Br(r);case "[object Boolean]":case "[object Date]":
          return new o(+r);case "[object DataView]":
          return e = i ? Br(r.buffer) : r.buffer, new r.constructor(e, r.byteOffset, r.byteLength);case "[object Float32Array]":case "[object Float64Array]":case "[object Int8Array]":case "[object Int16Array]":case "[object Int32Array]":case "[object Uint8Array]":case "[object Uint8ClampedArray]":
        case "[object Uint16Array]":case "[object Uint32Array]":
          return Lr(r, i);case "[object Map]":
          return e = i ? u(L(r), 1) : L(r), h(e, n, new r.constructor());case "[object Number]":case "[object String]":
          return new o(r);case "[object RegExp]":
          return e = new r.constructor(r.source, dn.exec(r)), e.lastIndex = r.lastIndex, e;case "[object Set]":
          return e = i ? u(D(r), 1) : D(r), h(e, t, new r.constructor());case "[object Symbol]":
          return eo ? ni(eo.call(r)) : {};}
    }function Ie(n) {
      return af(n) || cf(n) || !!(mi && n && n[mi]);
    }function Re(n, t) {
      return t = null == t ? 9007199254740991 : t, !!t && (typeof n == "number" || wn.test(n)) && -1 < n && 0 == n % 1 && n < t;
    }function ze(n, t, r) {
      if (!bu(r)) return false;var e = typeof t === "undefined" ? "undefined" : _typeof(t);return !!("number" == e ? pu(r) && Re(t, r.length) : "string" == e && t in r) && hu(r[t], n);
    }function We(n, t) {
      if (af(n)) return false;var r = typeof n === "undefined" ? "undefined" : _typeof(n);return !("number" != r && "symbol" != r && "boolean" != r && null != n && !Au(n)) || rn.test(n) || !tn.test(n) || null != t && n in ni(t);
    }function Be(n) {
      var t = be(n),
          r = On[t];return typeof r == "function" && t in Mn.prototype && (n === r || (t = _o(r), !!t && n === t[0]));
    }function Le(n) {
      var t = n && n.constructor;
      return n === (typeof t == "function" && t.prototype || ii);
    }function Ue(n, t) {
      return function (r) {
        return null != r && r[n] === t && (t !== F || n in ni(r));
      };
    }function Ce(n, t, e) {
      return t = Di(t === F ? n.length - 1 : t, 0), function () {
        for (var u = arguments, i = -1, o = Di(u.length - t, 0), f = Hu(o); ++i < o;) {
          f[i] = u[t + i];
        }for (i = -1, o = Hu(t + 1); ++i < t;) {
          o[i] = u[i];
        }return o[t] = e(f), r(n, this, o);
      };
    }function De(n, t, r) {
      var e = t + "";t = wo;var u,
          i = Ne;return u = (u = e.match(hn)) ? u[1].split(pn) : [], r = i(u, r), (i = r.length) && (u = i - 1, r[u] = (1 < i ? "& " : "") + r[u], r = r.join(2 < i ? ", " : " "), e = e.replace(sn, "{\n/* [wrapped with " + r + "] */\n")), t(n, e);
    }function Me(n) {
      var t = 0,
          r = 0;return function () {
        var e = Ti(),
            u = 16 - (e - r);if (r = e, 0 < u) {
          if (800 <= ++t) return arguments[0];
        } else t = 0;return n.apply(F, arguments);
      };
    }function Te(n, t) {
      var r = -1,
          e = n.length,
          u = e - 1;for (t = t === F ? e : t; ++r < t;) {
        var e = cr(r, u),
            i = n[e];n[e] = n[r], n[r] = i;
      }return n.length = t, n;
    }function $e(n) {
      if (typeof n == "string" || Au(n)) return n;var t = n + "";return "0" == t && 1 / n == -N ? "-0" : t;
    }function Fe(n) {
      if (null != n) {
        try {
          return fi.call(n);
        } catch (n) {}return n + "";
      }return "";
    }function Ne(n, t) {
      return u(Z, function (r) {
        var e = "_." + r[0];t & r[1] && !c(n, e) && n.push(e);
      }), n.sort();
    }function Pe(n) {
      if (n instanceof Mn) return n.clone();var t = new zn(n.__wrapped__, n.__chain__);return t.__actions__ = Mr(n.__actions__), t.__index__ = n.__index__, t.__values__ = n.__values__, t;
    }function Ze(n, t, r) {
      var e = null == n ? 0 : n.length;return e ? (r = null == r ? 0 : Ou(r), 0 > r && (r = Di(e + r, 0)), g(n, je(t, 3), r)) : -1;
    }function qe(n, t, r) {
      var e = null == n ? 0 : n.length;if (!e) return -1;var u = e - 1;return r !== F && (u = Ou(r), u = 0 > r ? Di(e + u, 0) : Mi(u, e - 1)), g(n, je(t, 3), u, true);
    }function Ve(n) {
      return (null == n ? 0 : n.length) ? kt(n, 1) : [];
    }function Ke(n) {
      return n && n.length ? n[0] : F;
    }function Ge(n) {
      var t = null == n ? 0 : n.length;return t ? n[t - 1] : F;
    }function He(n, t) {
      return n && n.length && t && t.length ? or(n, t) : n;
    }function Je(n) {
      return null == n ? n : Ni.call(n);
    }function Ye(n) {
      if (!n || !n.length) return [];var t = 0;return n = f(n, function (n) {
        if (_u(n)) return t = Di(n.length, t), true;
      }), E(t, function (t) {
        return l(n, j(t));
      });
    }function Qe(n, t) {
      if (!n || !n.length) return [];var e = Ye(n);return null == t ? e : l(e, function (n) {
        return r(t, F, n);
      });
    }function Xe(n) {
      return n = On(n), n.__chain__ = true, n;
    }function nu(n, t) {
      return t(n);
    }function tu() {
      return this;
    }function ru(n, t) {
      return (af(n) ? u : oo)(n, je(t, 3));
    }function eu(n, t) {
      return (af(n) ? i : fo)(n, je(t, 3));
    }function uu(n, t) {
      return (af(n) ? l : Yt)(n, je(t, 3));
    }function iu(n, t, r) {
      return t = r ? F : t, t = n && null == t ? n.length : t, le(n, 128, F, F, F, F, t);
    }function ou(n, t) {
      var r;if (typeof t != "function") throw new ei("Expected a function");return n = Ou(n), function () {
        return 0 < --n && (r = t.apply(this, arguments)), 1 >= n && (t = F), r;
      };
    }function fu(n, t, r) {
      return t = r ? F : t, n = le(n, 8, F, F, F, F, F, t), n.placeholder = fu.placeholder, n;
    }function cu(n, t, r) {
      return t = r ? F : t, n = le(n, 16, F, F, F, F, F, t), n.placeholder = cu.placeholder, n;
    }function au(n, t, r) {
      function e(t) {
        var r = c,
            e = a;return c = a = F, _ = t, s = n.apply(e, r);
      }function u(n) {
        var r = n - p;return n -= _, p === F || r >= t || 0 > r || g && n >= l;
      }function i() {
        var n = Jo();if (u(n)) return o(n);var r,
            e = jo;r = n - _, n = t - (n - p), r = g ? Mi(n, l - r) : n, h = e(i, r);
      }function o(n) {
        return h = F, d && c ? e(n) : (c = a = F, s);
      }function f() {
        var n = Jo(),
            r = u(n);if (c = arguments, a = this, p = n, r) {
          if (h === F) return _ = n = p, h = jo(i, t), v ? e(n) : s;if (g) return h = jo(i, t), e(p);
        }return h === F && (h = jo(i, t)), s;
      }var c,
          a,
          l,
          s,
          h,
          p,
          _ = 0,
          v = false,
          g = false,
          d = true;if (typeof n != "function") throw new ei("Expected a function");return t = Iu(t) || 0, bu(r) && (v = !!r.leading, l = (g = "maxWait" in r) ? Di(Iu(r.maxWait) || 0, t) : l, d = "trailing" in r ? !!r.trailing : d), f.cancel = function () {
        h !== F && ho(h), _ = 0, c = p = a = h = F;
      }, f.flush = function () {
        return h === F ? s : o(Jo());
      }, f;
    }function lu(n, t) {
      function r() {
        var e = arguments,
            u = t ? t.apply(this, e) : e[0],
            i = r.cache;return i.has(u) ? i.get(u) : (e = n.apply(this, e), r.cache = i.set(u, e) || i, e);
      }if (typeof n != "function" || null != t && typeof t != "function") throw new ei("Expected a function");return r.cache = new (lu.Cache || Pn)(), r;
    }function su(n) {
      if (typeof n != "function") throw new ei("Expected a function");return function () {
        var t = arguments;switch (t.length) {case 0:
            return !n.call(this);case 1:
            return !n.call(this, t[0]);case 2:
            return !n.call(this, t[0], t[1]);case 3:
            return !n.call(this, t[0], t[1], t[2]);}return !n.apply(this, t);
      };
    }function hu(n, t) {
      return n === t || n !== n && t !== t;
    }function pu(n) {
      return null != n && yu(n.length) && !gu(n);
    }function _u(n) {
      return xu(n) && pu(n);
    }function vu(n) {
      if (!xu(n)) return false;var t = zt(n);return "[object Error]" == t || "[object DOMException]" == t || typeof n.message == "string" && typeof n.name == "string" && !wu(n);
    }function gu(n) {
      return !!bu(n) && (n = zt(n), "[object Function]" == n || "[object GeneratorFunction]" == n || "[object AsyncFunction]" == n || "[object Proxy]" == n);
    }function du(n) {
      return typeof n == "number" && n == Ou(n);
    }function yu(n) {
      return typeof n == "number" && -1 < n && 0 == n % 1 && 9007199254740991 >= n;
    }function bu(n) {
      var t = typeof n === "undefined" ? "undefined" : _typeof(n);return null != n && ("object" == t || "function" == t);
    }function xu(n) {
      return null != n && (typeof n === "undefined" ? "undefined" : _typeof(n)) == "object";
    }function ju(n) {
      return typeof n == "number" || xu(n) && "[object Number]" == zt(n);
    }function wu(n) {
      return !(!xu(n) || "[object Object]" != zt(n)) && (n = bi(n), null === n || (n = ci.call(n, "constructor") && n.constructor, typeof n == "function" && n instanceof n && fi.call(n) == hi));
    }function mu(n) {
      return typeof n == "string" || !af(n) && xu(n) && "[object String]" == zt(n);
    }function Au(n) {
      return (typeof n === "undefined" ? "undefined" : _typeof(n)) == "symbol" || xu(n) && "[object Symbol]" == zt(n);
    }function ku(n) {
      if (!n) return [];if (pu(n)) return mu(n) ? $(n) : Mr(n);
      if (Ai && n[Ai]) {
        n = n[Ai]();for (var t, r = []; !(t = n.next()).done;) {
          r.push(t.value);
        }return r;
      }return t = yo(n), ("[object Map]" == t ? L : "[object Set]" == t ? D : Du)(n);
    }function Eu(n) {
      return n ? (n = Iu(n), n === N || n === -N ? 1.7976931348623157e308 * (0 > n ? -1 : 1) : n === n ? n : 0) : 0 === n ? n : 0;
    }function Ou(n) {
      n = Eu(n);var t = n % 1;return n === n ? t ? n - t : n : 0;
    }function Su(n) {
      return n ? gt(Ou(n), 0, 4294967295) : 0;
    }function Iu(n) {
      if (typeof n == "number") return n;if (Au(n)) return P;if (bu(n) && (n = typeof n.valueOf == "function" ? n.valueOf() : n, n = bu(n) ? n + "" : n), typeof n != "string") return 0 === n ? n : +n;
      n = n.replace(cn, "");var t = bn.test(n);return t || jn.test(n) ? Fn(n.slice(2), t ? 2 : 8) : yn.test(n) ? P : +n;
    }function Ru(n) {
      return Tr(n, Uu(n));
    }function zu(n) {
      return null == n ? "" : jr(n);
    }function Wu(n, t, r) {
      return n = null == n ? F : It(n, t), n === F ? r : n;
    }function Bu(n, t) {
      return null != n && ke(n, t, Lt);
    }function Lu(n) {
      return pu(n) ? Gn(n) : Ht(n);
    }function Uu(n) {
      if (pu(n)) n = Gn(n, true);else if (bu(n)) {
        var t,
            r = Le(n),
            e = [];for (t in n) {
          ("constructor" != t || !r && ci.call(n, t)) && e.push(t);
        }n = e;
      } else {
        if (t = [], null != n) for (r in ni(n)) {
          t.push(r);
        }n = t;
      }return n;
    }function Cu(n, t) {
      if (null == n) return {};var r = l(ye(n), function (n) {
        return [n];
      });return t = je(t), ur(n, r, function (n, r) {
        return t(n, r[0]);
      });
    }function Du(n) {
      return null == n ? [] : I(n, Lu(n));
    }function Mu(n) {
      return Nf(zu(n).toLowerCase());
    }function Tu(n) {
      return (n = zu(n)) && n.replace(mn, rt).replace(Rn, "");
    }function $u(n, t, r) {
      return n = zu(n), t = r ? F : t, t === F ? Ln.test(n) ? n.match(Wn) || [] : n.match(_n) || [] : n.match(t) || [];
    }function Fu(n) {
      return function () {
        return n;
      };
    }function Nu(n) {
      return n;
    }function Pu(n) {
      return Gt(typeof n == "function" ? n : dt(n, 1));
    }function Zu(n, t, r) {
      var e = Lu(t),
          i = St(t, e);null != r || bu(t) && (i.length || !e.length) || (r = t, t = n, n = this, i = St(t, Lu(t)));var o = !(bu(r) && "chain" in r && !r.chain),
          f = gu(n);return u(i, function (r) {
        var e = t[r];n[r] = e, f && (n.prototype[r] = function () {
          var t = this.__chain__;if (o || t) {
            var r = n(this.__wrapped__);return (r.__actions__ = Mr(this.__actions__)).push({ func: e, args: arguments, thisArg: n }), r.__chain__ = t, r;
          }return e.apply(n, s([this.value()], arguments));
        });
      }), n;
    }function qu() {}function Vu(n) {
      return We(n) ? j($e(n)) : ir(n);
    }function Ku() {
      return [];
    }function Gu() {
      return false;
    }En = null == En ? Zn : it.defaults(Zn.Object(), En, it.pick(Zn, Un));var Hu = En.Array,
        Ju = En.Date,
        Yu = En.Error,
        Qu = En.Function,
        Xu = En.Math,
        ni = En.Object,
        ti = En.RegExp,
        ri = En.String,
        ei = En.TypeError,
        ui = Hu.prototype,
        ii = ni.prototype,
        oi = En["__core-js_shared__"],
        fi = Qu.prototype.toString,
        ci = ii.hasOwnProperty,
        ai = 0,
        li = function () {
      var n = /[^.]+$/.exec(oi && oi.keys && oi.keys.IE_PROTO || "");return n ? "Symbol(src)_1." + n : "";
    }(),
        si = ii.toString,
        hi = fi.call(ni),
        pi = Zn._,
        _i = ti("^" + fi.call(ci).replace(on, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"),
        vi = Kn ? En.Buffer : F,
        gi = En.Symbol,
        di = En.Uint8Array,
        yi = vi ? vi.f : F,
        bi = U(ni.getPrototypeOf, ni),
        xi = ni.create,
        ji = ii.propertyIsEnumerable,
        wi = ui.splice,
        mi = gi ? gi.isConcatSpreadable : F,
        Ai = gi ? gi.iterator : F,
        ki = gi ? gi.toStringTag : F,
        Ei = function () {
      try {
        var n = Ae(ni, "defineProperty");return n({}, "", {}), n;
      } catch (n) {}
    }(),
        Oi = En.clearTimeout !== Zn.clearTimeout && En.clearTimeout,
        Si = Ju && Ju.now !== Zn.Date.now && Ju.now,
        Ii = En.setTimeout !== Zn.setTimeout && En.setTimeout,
        Ri = Xu.ceil,
        zi = Xu.floor,
        Wi = ni.getOwnPropertySymbols,
        Bi = vi ? vi.isBuffer : F,
        Li = En.isFinite,
        Ui = ui.join,
        Ci = U(ni.keys, ni),
        Di = Xu.max,
        Mi = Xu.min,
        Ti = Ju.now,
        $i = En.parseInt,
        Fi = Xu.random,
        Ni = ui.reverse,
        Pi = Ae(En, "DataView"),
        Zi = Ae(En, "Map"),
        qi = Ae(En, "Promise"),
        Vi = Ae(En, "Set"),
        Ki = Ae(En, "WeakMap"),
        Gi = Ae(ni, "create"),
        Hi = Ki && new Ki(),
        Ji = {},
        Yi = Fe(Pi),
        Qi = Fe(Zi),
        Xi = Fe(qi),
        no = Fe(Vi),
        to = Fe(Ki),
        ro = gi ? gi.prototype : F,
        eo = ro ? ro.valueOf : F,
        uo = ro ? ro.toString : F,
        io = function () {
      function n() {}return function (t) {
        return bu(t) ? xi ? xi(t) : (n.prototype = t, t = new n(), n.prototype = F, t) : {};
      };
    }();On.templateSettings = { escape: Q, evaluate: X, interpolate: nn, variable: "", imports: { _: On } }, On.prototype = Sn.prototype, On.prototype.constructor = On, zn.prototype = io(Sn.prototype), zn.prototype.constructor = zn, Mn.prototype = io(Sn.prototype), Mn.prototype.constructor = Mn, Tn.prototype.clear = function () {
      this.__data__ = Gi ? Gi(null) : {}, this.size = 0;
    }, Tn.prototype.delete = function (n) {
      return n = this.has(n) && delete this.__data__[n], this.size -= n ? 1 : 0, n;
    }, Tn.prototype.get = function (n) {
      var t = this.__data__;return Gi ? (n = t[n], "__lodash_hash_undefined__" === n ? F : n) : ci.call(t, n) ? t[n] : F;
    }, Tn.prototype.has = function (n) {
      var t = this.__data__;return Gi ? t[n] !== F : ci.call(t, n);
    }, Tn.prototype.set = function (n, t) {
      var r = this.__data__;return this.size += this.has(n) ? 0 : 1, r[n] = Gi && t === F ? "__lodash_hash_undefined__" : t, this;
    }, Nn.prototype.clear = function () {
      this.__data__ = [], this.size = 0;
    }, Nn.prototype.delete = function (n) {
      var t = this.__data__;return n = lt(t, n), !(0 > n) && (n == t.length - 1 ? t.pop() : wi.call(t, n, 1), --this.size, true);
    }, Nn.prototype.get = function (n) {
      var t = this.__data__;return n = lt(t, n), 0 > n ? F : t[n][1];
    }, Nn.prototype.has = function (n) {
      return -1 < lt(this.__data__, n);
    }, Nn.prototype.set = function (n, t) {
      var r = this.__data__,
          e = lt(r, n);return 0 > e ? (++this.size, r.push([n, t])) : r[e][1] = t, this;
    }, Pn.prototype.clear = function () {
      this.size = 0, this.__data__ = { hash: new Tn(), map: new (Zi || Nn)(), string: new Tn() };
    }, Pn.prototype.delete = function (n) {
      return n = we(this, n).delete(n), this.size -= n ? 1 : 0, n;
    }, Pn.prototype.get = function (n) {
      return we(this, n).get(n);
    }, Pn.prototype.has = function (n) {
      return we(this, n).has(n);
    }, Pn.prototype.set = function (n, t) {
      var r = we(this, n),
          e = r.size;return r.set(n, t), this.size += r.size == e ? 0 : 1, this;
    }, qn.prototype.add = qn.prototype.push = function (n) {
      return this.__data__.set(n, "__lodash_hash_undefined__"), this;
    }, qn.prototype.has = function (n) {
      return this.__data__.has(n);
    }, Vn.prototype.clear = function () {
      this.__data__ = new Nn(), this.size = 0;
    }, Vn.prototype.delete = function (n) {
      var t = this.__data__;return n = t.delete(n), this.size = t.size, n;
    }, Vn.prototype.get = function (n) {
      return this.__data__.get(n);
    }, Vn.prototype.has = function (n) {
      return this.__data__.has(n);
    }, Vn.prototype.set = function (n, t) {
      var r = this.__data__;if (r instanceof Nn) {
        var e = r.__data__;if (!Zi || 199 > e.length) return e.push([n, t]), this.size = ++r.size, this;r = this.__data__ = new Pn(e);
      }return r.set(n, t), this.size = r.size, this;
    };var oo = Zr(Et),
        fo = Zr(Ot, true),
        co = qr(),
        ao = qr(true),
        lo = Hi ? function (n, t) {
      return Hi.set(n, t), n;
    } : Nu,
        so = Ei ? function (n, t) {
      return Ei(n, "toString", { configurable: true, enumerable: false, value: Fu(t), writable: true });
    } : Nu,
        ho = Oi || function (n) {
      return Zn.clearTimeout(n);
    },
        po = Vi && 1 / D(new Vi([, -0]))[1] == N ? function (n) {
      return new Vi(n);
    } : qu,
        _o = Hi ? function (n) {
      return Hi.get(n);
    } : qu,
        vo = Wi ? function (n) {
      return null == n ? [] : (n = ni(n), f(Wi(n), function (t) {
        return ji.call(n, t);
      }));
    } : Ku,
        go = Wi ? function (n) {
      for (var t = []; n;) {
        s(t, vo(n)), n = bi(n);
      }return t;
    } : Ku,
        yo = zt;(Pi && "[object DataView]" != yo(new Pi(new ArrayBuffer(1))) || Zi && "[object Map]" != yo(new Zi()) || qi && "[object Promise]" != yo(qi.resolve()) || Vi && "[object Set]" != yo(new Vi()) || Ki && "[object WeakMap]" != yo(new Ki())) && (yo = function yo(n) {
      var t = zt(n);if (n = (n = "[object Object]" == t ? n.constructor : F) ? Fe(n) : "") switch (n) {case Yi:
          return "[object DataView]";case Qi:
          return "[object Map]";case Xi:
          return "[object Promise]";case no:
          return "[object Set]";case to:
          return "[object WeakMap]";}return t;
    });var bo = oi ? gu : Gu,
        xo = Me(lo),
        jo = Ii || function (n, t) {
      return Zn.setTimeout(n, t);
    },
        wo = Me(so),
        mo = function (n) {
      n = lu(n, function (n) {
        return 500 === t.size && t.clear(), n;
      });var t = n.cache;return n;
    }(function (n) {
      var t = [];return en.test(n) && t.push(""), n.replace(un, function (n, r, e, u) {
        t.push(e ? u.replace(vn, "$1") : r || n);
      }), t;
    }),
        Ao = lr(function (n, t) {
      return _u(n) ? jt(n, kt(t, 1, _u, true)) : [];
    }),
        ko = lr(function (n, t) {
      var r = Ge(t);return _u(r) && (r = F), _u(n) ? jt(n, kt(t, 1, _u, true), je(r, 2)) : [];
    }),
        Eo = lr(function (n, t) {
      var r = Ge(t);return _u(r) && (r = F), _u(n) ? jt(n, kt(t, 1, _u, true), F, r) : [];
    }),
        Oo = lr(function (n) {
      var t = l(n, Sr);return t.length && t[0] === n[0] ? Ut(t) : [];
    }),
        So = lr(function (n) {
      var t = Ge(n),
          r = l(n, Sr);return t === Ge(r) ? t = F : r.pop(), r.length && r[0] === n[0] ? Ut(r, je(t, 2)) : [];
    }),
        Io = lr(function (n) {
      var t = Ge(n),
          r = l(n, Sr);return (t = typeof t == "function" ? t : F) && r.pop(), r.length && r[0] === n[0] ? Ut(r, F, t) : [];
    }),
        Ro = lr(He),
        zo = ge(function (n, t) {
      var r = null == n ? 0 : n.length,
          e = vt(n, t);return fr(n, l(t, function (n) {
        return Re(n, r) ? +n : n;
      }).sort(Ur)), e;
    }),
        Wo = lr(function (n) {
      return wr(kt(n, 1, _u, true));
    }),
        Bo = lr(function (n) {
      var t = Ge(n);return _u(t) && (t = F), wr(kt(n, 1, _u, true), je(t, 2));
    }),
        Lo = lr(function (n) {
      var t = Ge(n),
          t = typeof t == "function" ? t : F;return wr(kt(n, 1, _u, true), F, t);
    }),
        Uo = lr(function (n, t) {
      return _u(n) ? jt(n, t) : [];
    }),
        Co = lr(function (n) {
      return Er(f(n, _u));
    }),
        Do = lr(function (n) {
      var t = Ge(n);return _u(t) && (t = F), Er(f(n, _u), je(t, 2));
    }),
        Mo = lr(function (n) {
      var t = Ge(n),
          t = typeof t == "function" ? t : F;return Er(f(n, _u), F, t);
    }),
        To = lr(Ye),
        $o = lr(function (n) {
      var t = n.length,
          t = 1 < t ? n[t - 1] : F,
          t = typeof t == "function" ? (n.pop(), t) : F;return Qe(n, t);
    }),
        Fo = ge(function (n) {
      function t(t) {
        return vt(t, n);
      }var r = n.length,
          e = r ? n[0] : 0,
          u = this.__wrapped__;return !(1 < r || this.__actions__.length) && u instanceof Mn && Re(e) ? (u = u.slice(e, +e + (r ? 1 : 0)), u.__actions__.push({ func: nu, args: [t], thisArg: F }), new zn(u, this.__chain__).thru(function (n) {
        return r && !n.length && n.push(F), n;
      })) : this.thru(t);
    }),
        No = Nr(function (n, t, r) {
      ci.call(n, r) ? ++n[r] : _t(n, r, 1);
    }),
        Po = Yr(Ze),
        Zo = Yr(qe),
        qo = Nr(function (n, t, r) {
      ci.call(n, r) ? n[r].push(t) : _t(n, r, [t]);
    }),
        Vo = lr(function (n, t, e) {
      var u = -1,
          i = typeof t == "function",
          o = pu(n) ? Hu(n.length) : [];return oo(n, function (n) {
        o[++u] = i ? r(t, n, e) : Dt(n, t, e);
      }), o;
    }),
        Ko = Nr(function (n, t, r) {
      _t(n, r, t);
    }),
        Go = Nr(function (n, t, r) {
      n[r ? 0 : 1].push(t);
    }, function () {
      return [[], []];
    }),
        Ho = lr(function (n, t) {
      if (null == n) return [];var r = t.length;return 1 < r && ze(n, t[0], t[1]) ? t = [] : 2 < r && ze(t[0], t[1], t[2]) && (t = [t[0]]), rr(n, kt(t, 1), []);
    }),
        Jo = Si || function () {
      return Zn.Date.now();
    },
        Yo = lr(function (n, t, r) {
      var e = 1;if (r.length) var u = C(r, xe(Yo)),
          e = 32 | e;return le(n, e, t, r, u);
    }),
        Qo = lr(function (n, t, r) {
      var e = 3;if (r.length) var u = C(r, xe(Qo)),
          e = 32 | e;return le(t, e, n, r, u);
    }),
        Xo = lr(function (n, t) {
      return xt(n, 1, t);
    }),
        nf = lr(function (n, t, r) {
      return xt(n, Iu(t) || 0, r);
    });lu.Cache = Pn;var tf = lr(function (n, t) {
      t = 1 == t.length && af(t[0]) ? l(t[0], S(je())) : l(kt(t, 1), S(je()));var e = t.length;return lr(function (u) {
        for (var i = -1, o = Mi(u.length, e); ++i < o;) {
          u[i] = t[i].call(this, u[i]);
        }return r(n, this, u);
      });
    }),
        rf = lr(function (n, t) {
      return le(n, 32, F, t, C(t, xe(rf)));
    }),
        ef = lr(function (n, t) {
      return le(n, 64, F, t, C(t, xe(ef)));
    }),
        uf = ge(function (n, t) {
      return le(n, 256, F, F, F, t);
    }),
        of = oe(Wt),
        ff = oe(function (n, t) {
      return n >= t;
    }),
        cf = Mt(function () {
      return arguments;
    }()) ? Mt : function (n) {
      return xu(n) && ci.call(n, "callee") && !ji.call(n, "callee");
    },
        af = Hu.isArray,
        lf = Hn ? S(Hn) : Tt,
        sf = Bi || Gu,
        hf = Jn ? S(Jn) : $t,
        pf = Yn ? S(Yn) : Nt,
        _f = Qn ? S(Qn) : qt,
        vf = Xn ? S(Xn) : Vt,
        gf = nt ? S(nt) : Kt,
        df = oe(Jt),
        yf = oe(function (n, t) {
      return n <= t;
    }),
        bf = Pr(function (n, t) {
      if (Le(t) || pu(t)) Tr(t, Lu(t), n);else for (var r in t) {
        ci.call(t, r) && at(n, r, t[r]);
      }
    }),
        xf = Pr(function (n, t) {
      Tr(t, Uu(t), n);
    }),
        jf = Pr(function (n, t, r, e) {
      Tr(t, Uu(t), n, e);
    }),
        wf = Pr(function (n, t, r, e) {
      Tr(t, Lu(t), n, e);
    }),
        mf = ge(vt),
        Af = lr(function (n) {
      return n.push(F, se), r(jf, F, n);
    }),
        kf = lr(function (n) {
      return n.push(F, he), r(Rf, F, n);
    }),
        Ef = ne(function (n, t, r) {
      n[t] = r;
    }, Fu(Nu)),
        Of = ne(function (n, t, r) {
      ci.call(n, t) ? n[t].push(r) : n[t] = [r];
    }, je),
        Sf = lr(Dt),
        If = Pr(function (n, t, r) {
      nr(n, t, r);
    }),
        Rf = Pr(function (n, t, r, e) {
      nr(n, t, r, e);
    }),
        zf = ge(function (n, t) {
      var r = {};if (null == n) return r;var e = false;t = l(t, function (t) {
        return t = Rr(t, n), e || (e = 1 < t.length), t;
      }), Tr(n, ye(n), r), e && (r = dt(r, 7, pe));for (var u = t.length; u--;) {
        mr(r, t[u]);
      }return r;
    }),
        Wf = ge(function (n, t) {
      return null == n ? {} : er(n, t);
    }),
        Bf = ae(Lu),
        Lf = ae(Uu),
        Uf = Gr(function (n, t, r) {
      return t = t.toLowerCase(), n + (r ? Mu(t) : t);
    }),
        Cf = Gr(function (n, t, r) {
      return n + (r ? "-" : "") + t.toLowerCase();
    }),
        Df = Gr(function (n, t, r) {
      return n + (r ? " " : "") + t.toLowerCase();
    }),
        Mf = Kr("toLowerCase"),
        Tf = Gr(function (n, t, r) {
      return n + (r ? "_" : "") + t.toLowerCase();
    }),
        $f = Gr(function (n, t, r) {
      return n + (r ? " " : "") + Nf(t);
    }),
        Ff = Gr(function (n, t, r) {
      return n + (r ? " " : "") + t.toUpperCase();
    }),
        Nf = Kr("toUpperCase"),
        Pf = lr(function (n, t) {
      try {
        return r(n, F, t);
      } catch (n) {
        return vu(n) ? n : new Yu(n);
      }
    }),
        Zf = ge(function (n, t) {
      return u(t, function (t) {
        t = $e(t), _t(n, t, Yo(n[t], n));
      }), n;
    }),
        qf = Qr(),
        Vf = Qr(true),
        Kf = lr(function (n, t) {
      return function (r) {
        return Dt(r, n, t);
      };
    }),
        Gf = lr(function (n, t) {
      return function (r) {
        return Dt(n, r, t);
      };
    }),
        Hf = re(l),
        Jf = re(o),
        Yf = re(_),
        Qf = ie(),
        Xf = ie(true),
        nc = te(function (n, t) {
      return n + t;
    }, 0),
        tc = ce("ceil"),
        rc = te(function (n, t) {
      return n / t;
    }, 1),
        ec = ce("floor"),
        uc = te(function (n, t) {
      return n * t;
    }, 1),
        ic = ce("round"),
        oc = te(function (n, t) {
      return n - t;
    }, 0);return On.after = function (n, t) {
      if (typeof t != "function") throw new ei("Expected a function");return n = Ou(n), function () {
        if (1 > --n) return t.apply(this, arguments);
      };
    }, On.ary = iu, On.assign = bf, On.assignIn = xf, On.assignInWith = jf, On.assignWith = wf, On.at = mf, On.before = ou, On.bind = Yo, On.bindAll = Zf, On.bindKey = Qo, On.castArray = function () {
      if (!arguments.length) return [];var n = arguments[0];return af(n) ? n : [n];
    }, On.chain = Xe, On.chunk = function (n, t, r) {
      if (t = (r ? ze(n, t, r) : t === F) ? 1 : Di(Ou(t), 0), r = null == n ? 0 : n.length, !r || 1 > t) return [];for (var e = 0, u = 0, i = Hu(Ri(r / t)); e < r;) {
        i[u++] = vr(n, e, e += t);
      }return i;
    }, On.compact = function (n) {
      for (var t = -1, r = null == n ? 0 : n.length, e = 0, u = []; ++t < r;) {
        var i = n[t];i && (u[e++] = i);
      }return u;
    }, On.concat = function () {
      var n = arguments.length;if (!n) return [];for (var t = Hu(n - 1), r = arguments[0]; n--;) {
        t[n - 1] = arguments[n];
      }return s(af(r) ? Mr(r) : [r], kt(t, 1));
    }, On.cond = function (n) {
      var t = null == n ? 0 : n.length,
          e = je();return n = t ? l(n, function (n) {
        if ("function" != typeof n[1]) throw new ei("Expected a function");return [e(n[0]), n[1]];
      }) : [], lr(function (e) {
        for (var u = -1; ++u < t;) {
          var i = n[u];if (r(i[0], this, e)) return r(i[1], this, e);
        }
      });
    }, On.conforms = function (n) {
      return yt(dt(n, 1));
    }, On.constant = Fu, On.countBy = No, On.create = function (n, t) {
      var r = io(n);return null == t ? r : ht(r, t);
    }, On.curry = fu, On.curryRight = cu, On.debounce = au, On.defaults = Af, On.defaultsDeep = kf, On.defer = Xo, On.delay = nf, On.difference = Ao, On.differenceBy = ko, On.differenceWith = Eo, On.drop = function (n, t, r) {
      var e = null == n ? 0 : n.length;
      return e ? (t = r || t === F ? 1 : Ou(t), vr(n, 0 > t ? 0 : t, e)) : [];
    }, On.dropRight = function (n, t, r) {
      var e = null == n ? 0 : n.length;return e ? (t = r || t === F ? 1 : Ou(t), t = e - t, vr(n, 0, 0 > t ? 0 : t)) : [];
    }, On.dropRightWhile = function (n, t) {
      return n && n.length ? Ar(n, je(t, 3), true, true) : [];
    }, On.dropWhile = function (n, t) {
      return n && n.length ? Ar(n, je(t, 3), true) : [];
    }, On.fill = function (n, t, r, e) {
      var u = null == n ? 0 : n.length;if (!u) return [];for (r && typeof r != "number" && ze(n, t, r) && (r = 0, e = u), u = n.length, r = Ou(r), 0 > r && (r = -r > u ? 0 : u + r), e = e === F || e > u ? u : Ou(e), 0 > e && (e += u), e = r > e ? 0 : Su(e); r < e;) {
        n[r++] = t;
      }return n;
    }, On.filter = function (n, t) {
      return (af(n) ? f : At)(n, je(t, 3));
    }, On.flatMap = function (n, t) {
      return kt(uu(n, t), 1);
    }, On.flatMapDeep = function (n, t) {
      return kt(uu(n, t), N);
    }, On.flatMapDepth = function (n, t, r) {
      return r = r === F ? 1 : Ou(r), kt(uu(n, t), r);
    }, On.flatten = Ve, On.flattenDeep = function (n) {
      return (null == n ? 0 : n.length) ? kt(n, N) : [];
    }, On.flattenDepth = function (n, t) {
      return null != n && n.length ? (t = t === F ? 1 : Ou(t), kt(n, t)) : [];
    }, On.flip = function (n) {
      return le(n, 512);
    }, On.flow = qf, On.flowRight = Vf, On.fromPairs = function (n) {
      for (var t = -1, r = null == n ? 0 : n.length, e = {}; ++t < r;) {
        var u = n[t];e[u[0]] = u[1];
      }return e;
    }, On.functions = function (n) {
      return null == n ? [] : St(n, Lu(n));
    }, On.functionsIn = function (n) {
      return null == n ? [] : St(n, Uu(n));
    }, On.groupBy = qo, On.initial = function (n) {
      return (null == n ? 0 : n.length) ? vr(n, 0, -1) : [];
    }, On.intersection = Oo, On.intersectionBy = So, On.intersectionWith = Io, On.invert = Ef, On.invertBy = Of, On.invokeMap = Vo, On.iteratee = Pu, On.keyBy = Ko, On.keys = Lu, On.keysIn = Uu, On.map = uu, On.mapKeys = function (n, t) {
      var r = {};return t = je(t, 3), Et(n, function (n, e, u) {
        _t(r, t(n, e, u), n);
      }), r;
    }, On.mapValues = function (n, t) {
      var r = {};return t = je(t, 3), Et(n, function (n, e, u) {
        _t(r, e, t(n, e, u));
      }), r;
    }, On.matches = function (n) {
      return Qt(dt(n, 1));
    }, On.matchesProperty = function (n, t) {
      return Xt(n, dt(t, 1));
    }, On.memoize = lu, On.merge = If, On.mergeWith = Rf, On.method = Kf, On.methodOf = Gf, On.mixin = Zu, On.negate = su, On.nthArg = function (n) {
      return n = Ou(n), lr(function (t) {
        return tr(t, n);
      });
    }, On.omit = zf, On.omitBy = function (n, t) {
      return Cu(n, su(je(t)));
    }, On.once = function (n) {
      return ou(2, n);
    }, On.orderBy = function (n, t, r, e) {
      return null == n ? [] : (af(t) || (t = null == t ? [] : [t]), r = e ? F : r, af(r) || (r = null == r ? [] : [r]), rr(n, t, r));
    }, On.over = Hf, On.overArgs = tf, On.overEvery = Jf, On.overSome = Yf, On.partial = rf, On.partialRight = ef, On.partition = Go, On.pick = Wf, On.pickBy = Cu, On.property = Vu, On.propertyOf = function (n) {
      return function (t) {
        return null == n ? F : It(n, t);
      };
    }, On.pull = Ro, On.pullAll = He, On.pullAllBy = function (n, t, r) {
      return n && n.length && t && t.length ? or(n, t, je(r, 2)) : n;
    }, On.pullAllWith = function (n, t, r) {
      return n && n.length && t && t.length ? or(n, t, F, r) : n;
    }, On.pullAt = zo, On.range = Qf, On.rangeRight = Xf, On.rearg = uf, On.reject = function (n, t) {
      return (af(n) ? f : At)(n, su(je(t, 3)));
    }, On.remove = function (n, t) {
      var r = [];if (!n || !n.length) return r;var e = -1,
          u = [],
          i = n.length;for (t = je(t, 3); ++e < i;) {
        var o = n[e];t(o, e, n) && (r.push(o), u.push(e));
      }return fr(n, u), r;
    }, On.rest = function (n, t) {
      if (typeof n != "function") throw new ei("Expected a function");return t = t === F ? t : Ou(t), lr(n, t);
    }, On.reverse = Je, On.sampleSize = function (n, t, r) {
      return t = (r ? ze(n, t, r) : t === F) ? 1 : Ou(t), (af(n) ? ot : hr)(n, t);
    }, On.set = function (n, t, r) {
      return null == n ? n : pr(n, t, r);
    }, On.setWith = function (n, t, r, e) {
      return e = typeof e == "function" ? e : F, null == n ? n : pr(n, t, r, e);
    }, On.shuffle = function (n) {
      return (af(n) ? ft : _r)(n);
    }, On.slice = function (n, t, r) {
      var e = null == n ? 0 : n.length;return e ? (r && typeof r != "number" && ze(n, t, r) ? (t = 0, r = e) : (t = null == t ? 0 : Ou(t), r = r === F ? e : Ou(r)), vr(n, t, r)) : [];
    }, On.sortBy = Ho, On.sortedUniq = function (n) {
      return n && n.length ? br(n) : [];
    }, On.sortedUniqBy = function (n, t) {
      return n && n.length ? br(n, je(t, 2)) : [];
    }, On.split = function (n, t, r) {
      return r && typeof r != "number" && ze(n, t, r) && (t = r = F), r = r === F ? 4294967295 : r >>> 0, r ? (n = zu(n)) && (typeof t == "string" || null != t && !_f(t)) && (t = jr(t), !t && Bn.test(n)) ? zr($(n), 0, r) : n.split(t, r) : [];
    }, On.spread = function (n, t) {
      if (typeof n != "function") throw new ei("Expected a function");return t = null == t ? 0 : Di(Ou(t), 0), lr(function (e) {
        var u = e[t];return e = zr(e, 0, t), u && s(e, u), r(n, this, e);
      });
    }, On.tail = function (n) {
      var t = null == n ? 0 : n.length;return t ? vr(n, 1, t) : [];
    }, On.take = function (n, t, r) {
      return n && n.length ? (t = r || t === F ? 1 : Ou(t), vr(n, 0, 0 > t ? 0 : t)) : [];
    }, On.takeRight = function (n, t, r) {
      var e = null == n ? 0 : n.length;return e ? (t = r || t === F ? 1 : Ou(t), t = e - t, vr(n, 0 > t ? 0 : t, e)) : [];
    }, On.takeRightWhile = function (n, t) {
      return n && n.length ? Ar(n, je(t, 3), false, true) : [];
    }, On.takeWhile = function (n, t) {
      return n && n.length ? Ar(n, je(t, 3)) : [];
    }, On.tap = function (n, t) {
      return t(n), n;
    }, On.throttle = function (n, t, r) {
      var e = true,
          u = true;if (typeof n != "function") throw new ei("Expected a function");return bu(r) && (e = "leading" in r ? !!r.leading : e, u = "trailing" in r ? !!r.trailing : u), au(n, t, { leading: e, maxWait: t, trailing: u });
    }, On.thru = nu, On.toArray = ku, On.toPairs = Bf, On.toPairsIn = Lf, On.toPath = function (n) {
      return af(n) ? l(n, $e) : Au(n) ? [n] : Mr(mo(zu(n)));
    }, On.toPlainObject = Ru, On.transform = function (n, t, r) {
      var e = af(n),
          i = e || sf(n) || gf(n);if (t = je(t, 4), null == r) {
        var o = n && n.constructor;r = i ? e ? new o() : [] : bu(n) && gu(o) ? io(bi(n)) : {};
      }return (i ? u : Et)(n, function (n, e, u) {
        return t(r, n, e, u);
      }), r;
    }, On.unary = function (n) {
      return iu(n, 1);
    }, On.union = Wo, On.unionBy = Bo, On.unionWith = Lo, On.uniq = function (n) {
      return n && n.length ? wr(n) : [];
    }, On.uniqBy = function (n, t) {
      return n && n.length ? wr(n, je(t, 2)) : [];
    }, On.uniqWith = function (n, t) {
      return t = typeof t == "function" ? t : F, n && n.length ? wr(n, F, t) : [];
    }, On.unset = function (n, t) {
      return null == n || mr(n, t);
    }, On.unzip = Ye, On.unzipWith = Qe, On.update = function (n, t, r) {
      return null == n ? n : pr(n, t, Ir(r)(It(n, t)), void 0);
    }, On.updateWith = function (n, t, r, e) {
      return e = typeof e == "function" ? e : F, null != n && (n = pr(n, t, Ir(r)(It(n, t)), e)), n;
    }, On.values = Du, On.valuesIn = function (n) {
      return null == n ? [] : I(n, Uu(n));
    }, On.without = Uo, On.words = $u, On.wrap = function (n, t) {
      return rf(Ir(t), n);
    }, On.xor = Co, On.xorBy = Do, On.xorWith = Mo, On.zip = To, On.zipObject = function (n, t) {
      return Or(n || [], t || [], at);
    }, On.zipObjectDeep = function (n, t) {
      return Or(n || [], t || [], pr);
    }, On.zipWith = $o, On.entries = Bf, On.entriesIn = Lf, On.extend = xf, On.extendWith = jf, Zu(On, On), On.add = nc, On.attempt = Pf, On.camelCase = Uf, On.capitalize = Mu, On.ceil = tc, On.clamp = function (n, t, r) {
      return r === F && (r = t, t = F), r !== F && (r = Iu(r), r = r === r ? r : 0), t !== F && (t = Iu(t), t = t === t ? t : 0), gt(Iu(n), t, r);
    }, On.clone = function (n) {
      return dt(n, 4);
    }, On.cloneDeep = function (n) {
      return dt(n, 5);
    }, On.cloneDeepWith = function (n, t) {
      return t = typeof t == "function" ? t : F, dt(n, 5, t);
    }, On.cloneWith = function (n, t) {
      return t = typeof t == "function" ? t : F, dt(n, 4, t);
    }, On.conformsTo = function (n, t) {
      return null == t || bt(n, t, Lu(t));
    }, On.deburr = Tu, On.defaultTo = function (n, t) {
      return null == n || n !== n ? t : n;
    }, On.divide = rc, On.endsWith = function (n, t, r) {
      n = zu(n), t = jr(t);var e = n.length,
          e = r = r === F ? e : gt(Ou(r), 0, e);return r -= t.length, 0 <= r && n.slice(r, e) == t;
    }, On.eq = hu, On.escape = function (n) {
      return (n = zu(n)) && Y.test(n) ? n.replace(H, et) : n;
    }, On.escapeRegExp = function (n) {
      return (n = zu(n)) && fn.test(n) ? n.replace(on, "\\$&") : n;
    }, On.every = function (n, t, r) {
      var e = af(n) ? o : wt;return r && ze(n, t, r) && (t = F), e(n, je(t, 3));
    }, On.find = Po, On.findIndex = Ze, On.findKey = function (n, t) {
      return v(n, je(t, 3), Et);
    }, On.findLast = Zo, On.findLastIndex = qe, On.findLastKey = function (n, t) {
      return v(n, je(t, 3), Ot);
    }, On.floor = ec, On.forEach = ru, On.forEachRight = eu, On.forIn = function (n, t) {
      return null == n ? n : co(n, je(t, 3), Uu);
    }, On.forInRight = function (n, t) {
      return null == n ? n : ao(n, je(t, 3), Uu);
    }, On.forOwn = function (n, t) {
      return n && Et(n, je(t, 3));
    }, On.forOwnRight = function (n, t) {
      return n && Ot(n, je(t, 3));
    }, On.get = Wu, On.gt = of, On.gte = ff, On.has = function (n, t) {
      return null != n && ke(n, t, Bt);
    }, On.hasIn = Bu, On.head = Ke, On.identity = Nu, On.includes = function (n, t, r, e) {
      return n = pu(n) ? n : Du(n), r = r && !e ? Ou(r) : 0, e = n.length, 0 > r && (r = Di(e + r, 0)), mu(n) ? r <= e && -1 < n.indexOf(t, r) : !!e && -1 < d(n, t, r);
    }, On.indexOf = function (n, t, r) {
      var e = null == n ? 0 : n.length;return e ? (r = null == r ? 0 : Ou(r), 0 > r && (r = Di(e + r, 0)), d(n, t, r)) : -1;
    }, On.inRange = function (n, t, r) {
      return t = Eu(t), r === F ? (r = t, t = 0) : r = Eu(r), n = Iu(n), n >= Mi(t, r) && n < Di(t, r);
    }, On.invoke = Sf, On.isArguments = cf, On.isArray = af, On.isArrayBuffer = lf, On.isArrayLike = pu, On.isArrayLikeObject = _u, On.isBoolean = function (n) {
      return true === n || false === n || xu(n) && "[object Boolean]" == zt(n);
    }, On.isBuffer = sf, On.isDate = hf, On.isElement = function (n) {
      return xu(n) && 1 === n.nodeType && !wu(n);
    }, On.isEmpty = function (n) {
      if (null == n) return true;if (pu(n) && (af(n) || typeof n == "string" || typeof n.splice == "function" || sf(n) || gf(n) || cf(n))) return !n.length;var t = yo(n);if ("[object Map]" == t || "[object Set]" == t) return !n.size;if (Le(n)) return !Ht(n).length;for (var r in n) {
        if (ci.call(n, r)) return false;
      }return true;
    }, On.isEqual = function (n, t) {
      return Ft(n, t);
    }, On.isEqualWith = function (n, t, r) {
      var e = (r = typeof r == "function" ? r : F) ? r(n, t) : F;return e === F ? Ft(n, t, F, r) : !!e;
    }, On.isError = vu, On.isFinite = function (n) {
      return typeof n == "number" && Li(n);
    }, On.isFunction = gu, On.isInteger = du, On.isLength = yu, On.isMap = pf, On.isMatch = function (n, t) {
      return n === t || Pt(n, t, me(t));
    }, On.isMatchWith = function (n, t, r) {
      return r = typeof r == "function" ? r : F, Pt(n, t, me(t), r);
    }, On.isNaN = function (n) {
      return ju(n) && n != +n;
    }, On.isNative = function (n) {
      if (bo(n)) throw new Yu("Unsupported core-js use. Try https://npms.io/search?q=ponyfill.");
      return Zt(n);
    }, On.isNil = function (n) {
      return null == n;
    }, On.isNull = function (n) {
      return null === n;
    }, On.isNumber = ju, On.isObject = bu, On.isObjectLike = xu, On.isPlainObject = wu, On.isRegExp = _f, On.isSafeInteger = function (n) {
      return du(n) && -9007199254740991 <= n && 9007199254740991 >= n;
    }, On.isSet = vf, On.isString = mu, On.isSymbol = Au, On.isTypedArray = gf, On.isUndefined = function (n) {
      return n === F;
    }, On.isWeakMap = function (n) {
      return xu(n) && "[object WeakMap]" == yo(n);
    }, On.isWeakSet = function (n) {
      return xu(n) && "[object WeakSet]" == zt(n);
    }, On.join = function (n, t) {
      return null == n ? "" : Ui.call(n, t);
    }, On.kebabCase = Cf, On.last = Ge, On.lastIndexOf = function (n, t, r) {
      var e = null == n ? 0 : n.length;if (!e) return -1;var u = e;if (r !== F && (u = Ou(r), u = 0 > u ? Di(e + u, 0) : Mi(u, e - 1)), t === t) {
        for (r = u + 1; r-- && n[r] !== t;) {}n = r;
      } else n = g(n, b, u, true);return n;
    }, On.lowerCase = Df, On.lowerFirst = Mf, On.lt = df, On.lte = yf, On.max = function (n) {
      return n && n.length ? mt(n, Nu, Wt) : F;
    }, On.maxBy = function (n, t) {
      return n && n.length ? mt(n, je(t, 2), Wt) : F;
    }, On.mean = function (n) {
      return x(n, Nu);
    }, On.meanBy = function (n, t) {
      return x(n, je(t, 2));
    }, On.min = function (n) {
      return n && n.length ? mt(n, Nu, Jt) : F;
    }, On.minBy = function (n, t) {
      return n && n.length ? mt(n, je(t, 2), Jt) : F;
    }, On.stubArray = Ku, On.stubFalse = Gu, On.stubObject = function () {
      return {};
    }, On.stubString = function () {
      return "";
    }, On.stubTrue = function () {
      return true;
    }, On.multiply = uc, On.nth = function (n, t) {
      return n && n.length ? tr(n, Ou(t)) : F;
    }, On.noConflict = function () {
      return Zn._ === this && (Zn._ = pi), this;
    }, On.noop = qu, On.now = Jo, On.pad = function (n, t, r) {
      n = zu(n);var e = (t = Ou(t)) ? T(n) : 0;return !t || e >= t ? n : (t = (t - e) / 2, ee(zi(t), r) + n + ee(Ri(t), r));
    }, On.padEnd = function (n, t, r) {
      n = zu(n);var e = (t = Ou(t)) ? T(n) : 0;return t && e < t ? n + ee(t - e, r) : n;
    }, On.padStart = function (n, t, r) {
      n = zu(n);var e = (t = Ou(t)) ? T(n) : 0;return t && e < t ? ee(t - e, r) + n : n;
    }, On.parseInt = function (n, t, r) {
      return r || null == t ? t = 0 : t && (t = +t), $i(zu(n).replace(an, ""), t || 0);
    }, On.random = function (n, t, r) {
      if (r && typeof r != "boolean" && ze(n, t, r) && (t = r = F), r === F && (typeof t == "boolean" ? (r = t, t = F) : typeof n == "boolean" && (r = n, n = F)), n === F && t === F ? (n = 0, t = 1) : (n = Eu(n), t === F ? (t = n, n = 0) : t = Eu(t)), n > t) {
        var e = n;n = t, t = e;
      }return r || n % 1 || t % 1 ? (r = Fi(), Mi(n + r * (t - n + $n("1e-" + ((r + "").length - 1))), t)) : cr(n, t);
    }, On.reduce = function (n, t, r) {
      var e = af(n) ? h : m,
          u = 3 > arguments.length;return e(n, je(t, 4), r, u, oo);
    }, On.reduceRight = function (n, t, r) {
      var e = af(n) ? p : m,
          u = 3 > arguments.length;return e(n, je(t, 4), r, u, fo);
    }, On.repeat = function (n, t, r) {
      return t = (r ? ze(n, t, r) : t === F) ? 1 : Ou(t), ar(zu(n), t);
    }, On.replace = function () {
      var n = arguments,
          t = zu(n[0]);return 3 > n.length ? t : t.replace(n[1], n[2]);
    }, On.result = function (n, t, r) {
      t = Rr(t, n);var e = -1,
          u = t.length;for (u || (u = 1, n = F); ++e < u;) {
        var i = null == n ? F : n[$e(t[e])];i === F && (e = u, i = r), n = gu(i) ? i.call(n) : i;
      }return n;
    }, On.round = ic, On.runInContext = w, On.sample = function (n) {
      return (af(n) ? tt : sr)(n);
    }, On.size = function (n) {
      if (null == n) return 0;if (pu(n)) return mu(n) ? T(n) : n.length;var t = yo(n);return "[object Map]" == t || "[object Set]" == t ? n.size : Ht(n).length;
    }, On.snakeCase = Tf, On.some = function (n, t, r) {
      var e = af(n) ? _ : gr;return r && ze(n, t, r) && (t = F), e(n, je(t, 3));
    }, On.sortedIndex = function (n, t) {
      return dr(n, t);
    }, On.sortedIndexBy = function (n, t, r) {
      return yr(n, t, je(r, 2));
    }, On.sortedIndexOf = function (n, t) {
      var r = null == n ? 0 : n.length;if (r) {
        var e = dr(n, t);if (e < r && hu(n[e], t)) return e;
      }return -1;
    }, On.sortedLastIndex = function (n, t) {
      return dr(n, t, true);
    }, On.sortedLastIndexBy = function (n, t, r) {
      return yr(n, t, je(r, 2), true);
    }, On.sortedLastIndexOf = function (n, t) {
      if (null == n ? 0 : n.length) {
        var r = dr(n, t, true) - 1;if (hu(n[r], t)) return r;
      }return -1;
    }, On.startCase = $f, On.startsWith = function (n, t, r) {
      return n = zu(n), r = null == r ? 0 : gt(Ou(r), 0, n.length), t = jr(t), n.slice(r, r + t.length) == t;
    }, On.subtract = oc, On.sum = function (n) {
      return n && n.length ? k(n, Nu) : 0;
    }, On.sumBy = function (n, t) {
      return n && n.length ? k(n, je(t, 2)) : 0;
    }, On.template = function (n, t, r) {
      var e = On.templateSettings;r && ze(n, t, r) && (t = F), n = zu(n), t = jf({}, t, e, se), r = jf({}, t.imports, e.imports, se);var u,
          i,
          o = Lu(r),
          f = I(r, o),
          c = 0;r = t.interpolate || An;var a = "__p+='";r = ti((t.escape || An).source + "|" + r.source + "|" + (r === nn ? gn : An).source + "|" + (t.evaluate || An).source + "|$", "g");var l = "sourceURL" in t ? "//# sourceURL=" + t.sourceURL + "\n" : "";if (n.replace(r, function (t, r, e, o, f, l) {
        return e || (e = o), a += n.slice(c, l).replace(kn, B), r && (u = true, a += "'+__e(" + r + ")+'"), f && (i = true, a += "';" + f + ";\n__p+='"), e && (a += "'+((__t=(" + e + "))==null?'':__t)+'"), c = l + t.length, t;
      }), a += "';", (t = t.variable) || (a = "with(obj){" + a + "}"), a = (i ? a.replace(q, "") : a).replace(V, "$1").replace(K, "$1;"), a = "function(" + (t || "obj") + "){" + (t ? "" : "obj||(obj={});") + "var __t,__p=''" + (u ? ",__e=_.escape" : "") + (i ? ",__j=Array.prototype.join;function print(){__p+=__j.call(arguments,'')}" : ";") + a + "return __p}", t = Pf(function () {
        return Qu(o, l + "return " + a).apply(F, f);
      }), t.source = a, vu(t)) throw t;return t;
    }, On.times = function (n, t) {
      if (n = Ou(n), 1 > n || 9007199254740991 < n) return [];
      var r = 4294967295,
          e = Mi(n, 4294967295);for (t = je(t), n -= 4294967295, e = E(e, t); ++r < n;) {
        t(r);
      }return e;
    }, On.toFinite = Eu, On.toInteger = Ou, On.toLength = Su, On.toLower = function (n) {
      return zu(n).toLowerCase();
    }, On.toNumber = Iu, On.toSafeInteger = function (n) {
      return n ? gt(Ou(n), -9007199254740991, 9007199254740991) : 0 === n ? n : 0;
    }, On.toString = zu, On.toUpper = function (n) {
      return zu(n).toUpperCase();
    }, On.trim = function (n, t, r) {
      return (n = zu(n)) && (r || t === F) ? n.replace(cn, "") : n && (t = jr(t)) ? (n = $(n), r = $(t), t = z(n, r), r = W(n, r) + 1, zr(n, t, r).join("")) : n;
    }, On.trimEnd = function (n, t, r) {
      return (n = zu(n)) && (r || t === F) ? n.replace(ln, "") : n && (t = jr(t)) ? (n = $(n), t = W(n, $(t)) + 1, zr(n, 0, t).join("")) : n;
    }, On.trimStart = function (n, t, r) {
      return (n = zu(n)) && (r || t === F) ? n.replace(an, "") : n && (t = jr(t)) ? (n = $(n), t = z(n, $(t)), zr(n, t).join("")) : n;
    }, On.truncate = function (n, t) {
      var r = 30,
          e = "...";if (bu(t)) var u = "separator" in t ? t.separator : u,
          r = "length" in t ? Ou(t.length) : r,
          e = "omission" in t ? jr(t.omission) : e;n = zu(n);var i = n.length;if (Bn.test(n)) var o = $(n),
          i = o.length;if (r >= i) return n;if (i = r - T(e), 1 > i) return e;
      if (r = o ? zr(o, 0, i).join("") : n.slice(0, i), u === F) return r + e;if (o && (i += r.length - i), _f(u)) {
        if (n.slice(i).search(u)) {
          var f = r;for (u.global || (u = ti(u.source, zu(dn.exec(u)) + "g")), u.lastIndex = 0; o = u.exec(f);) {
            var c = o.index;
          }r = r.slice(0, c === F ? i : c);
        }
      } else n.indexOf(jr(u), i) != i && (u = r.lastIndexOf(u), -1 < u && (r = r.slice(0, u)));return r + e;
    }, On.unescape = function (n) {
      return (n = zu(n)) && J.test(n) ? n.replace(G, ut) : n;
    }, On.uniqueId = function (n) {
      var t = ++ai;return zu(n) + t;
    }, On.upperCase = Ff, On.upperFirst = Nf, On.each = ru, On.eachRight = eu, On.first = Ke, Zu(On, function () {
      var n = {};return Et(On, function (t, r) {
        ci.call(On.prototype, r) || (n[r] = t);
      }), n;
    }(), { chain: false }), On.VERSION = "4.17.4", u("bind bindKey curry curryRight partial partialRight".split(" "), function (n) {
      On[n].placeholder = On;
    }), u(["drop", "take"], function (n, t) {
      Mn.prototype[n] = function (r) {
        r = r === F ? 1 : Di(Ou(r), 0);var e = this.__filtered__ && !t ? new Mn(this) : this.clone();return e.__filtered__ ? e.__takeCount__ = Mi(r, e.__takeCount__) : e.__views__.push({ size: Mi(r, 4294967295), type: n + (0 > e.__dir__ ? "Right" : "") }), e;
      }, Mn.prototype[n + "Right"] = function (t) {
        return this.reverse()[n](t).reverse();
      };
    }), u(["filter", "map", "takeWhile"], function (n, t) {
      var r = t + 1,
          e = 1 == r || 3 == r;Mn.prototype[n] = function (n) {
        var t = this.clone();return t.__iteratees__.push({ iteratee: je(n, 3), type: r }), t.__filtered__ = t.__filtered__ || e, t;
      };
    }), u(["head", "last"], function (n, t) {
      var r = "take" + (t ? "Right" : "");Mn.prototype[n] = function () {
        return this[r](1).value()[0];
      };
    }), u(["initial", "tail"], function (n, t) {
      var r = "drop" + (t ? "" : "Right");Mn.prototype[n] = function () {
        return this.__filtered__ ? new Mn(this) : this[r](1);
      };
    }), Mn.prototype.compact = function () {
      return this.filter(Nu);
    }, Mn.prototype.find = function (n) {
      return this.filter(n).head();
    }, Mn.prototype.findLast = function (n) {
      return this.reverse().find(n);
    }, Mn.prototype.invokeMap = lr(function (n, t) {
      return typeof n == "function" ? new Mn(this) : this.map(function (r) {
        return Dt(r, n, t);
      });
    }), Mn.prototype.reject = function (n) {
      return this.filter(su(je(n)));
    }, Mn.prototype.slice = function (n, t) {
      n = Ou(n);var r = this;return r.__filtered__ && (0 < n || 0 > t) ? new Mn(r) : (0 > n ? r = r.takeRight(-n) : n && (r = r.drop(n)), t !== F && (t = Ou(t), r = 0 > t ? r.dropRight(-t) : r.take(t - n)), r);
    }, Mn.prototype.takeRightWhile = function (n) {
      return this.reverse().takeWhile(n).reverse();
    }, Mn.prototype.toArray = function () {
      return this.take(4294967295);
    }, Et(Mn.prototype, function (n, t) {
      var r = /^(?:filter|find|map|reject)|While$/.test(t),
          e = /^(?:head|last)$/.test(t),
          u = On[e ? "take" + ("last" == t ? "Right" : "") : t],
          i = e || /^find/.test(t);u && (On.prototype[t] = function () {
        function t(n) {
          return n = u.apply(On, s([n], f)), e && h ? n[0] : n;
        }var o = this.__wrapped__,
            f = e ? [1] : arguments,
            c = o instanceof Mn,
            a = f[0],
            l = c || af(o);
        l && r && typeof a == "function" && 1 != a.length && (c = l = false);var h = this.__chain__,
            p = !!this.__actions__.length,
            a = i && !h,
            c = c && !p;return !i && l ? (o = c ? o : new Mn(this), o = n.apply(o, f), o.__actions__.push({ func: nu, args: [t], thisArg: F }), new zn(o, h)) : a && c ? n.apply(this, f) : (o = this.thru(t), a ? e ? o.value()[0] : o.value() : o);
      });
    }), u("pop push shift sort splice unshift".split(" "), function (n) {
      var t = ui[n],
          r = /^(?:push|sort|unshift)$/.test(n) ? "tap" : "thru",
          e = /^(?:pop|shift)$/.test(n);On.prototype[n] = function () {
        var n = arguments;if (e && !this.__chain__) {
          var u = this.value();return t.apply(af(u) ? u : [], n);
        }return this[r](function (r) {
          return t.apply(af(r) ? r : [], n);
        });
      };
    }), Et(Mn.prototype, function (n, t) {
      var r = On[t];if (r) {
        var e = r.name + "";(Ji[e] || (Ji[e] = [])).push({ name: t, func: r });
      }
    }), Ji[Xr(F, 2).name] = [{ name: "wrapper", func: F }], Mn.prototype.clone = function () {
      var n = new Mn(this.__wrapped__);return n.__actions__ = Mr(this.__actions__), n.__dir__ = this.__dir__, n.__filtered__ = this.__filtered__, n.__iteratees__ = Mr(this.__iteratees__), n.__takeCount__ = this.__takeCount__, n.__views__ = Mr(this.__views__), n;
    }, Mn.prototype.reverse = function () {
      if (this.__filtered__) {
        var n = new Mn(this);n.__dir__ = -1, n.__filtered__ = true;
      } else n = this.clone(), n.__dir__ *= -1;return n;
    }, Mn.prototype.value = function () {
      var n,
          t = this.__wrapped__.value(),
          r = this.__dir__,
          e = af(t),
          u = 0 > r,
          i = e ? t.length : 0;n = i;for (var o = this.__views__, f = 0, c = -1, a = o.length; ++c < a;) {
        var l = o[c],
            s = l.size;switch (l.type) {case "drop":
            f += s;break;case "dropRight":
            n -= s;break;case "take":
            n = Mi(n, f + s);break;case "takeRight":
            f = Di(f, n - s);}
      }if (n = { start: f, end: n }, o = n.start, f = n.end, n = f - o, o = u ? f : o - 1, f = this.__iteratees__, c = f.length, a = 0, l = Mi(n, this.__takeCount__), !e || !u && i == n && l == n) return kr(t, this.__actions__);e = [];n: for (; n-- && a < l;) {
        for (o += r, u = -1, i = t[o]; ++u < c;) {
          var h = f[u],
              s = h.type,
              h = (0, h.iteratee)(i);if (2 == s) i = h;else if (!h) {
            if (1 == s) continue n;break n;
          }
        }e[a++] = i;
      }return e;
    }, On.prototype.at = Fo, On.prototype.chain = function () {
      return Xe(this);
    }, On.prototype.commit = function () {
      return new zn(this.value(), this.__chain__);
    }, On.prototype.next = function () {
      this.__values__ === F && (this.__values__ = ku(this.value()));
      var n = this.__index__ >= this.__values__.length;return { done: n, value: n ? F : this.__values__[this.__index__++] };
    }, On.prototype.plant = function (n) {
      for (var t, r = this; r instanceof Sn;) {
        var e = Pe(r);e.__index__ = 0, e.__values__ = F, t ? u.__wrapped__ = e : t = e;var u = e,
            r = r.__wrapped__;
      }return u.__wrapped__ = n, t;
    }, On.prototype.reverse = function () {
      var n = this.__wrapped__;return n instanceof Mn ? (this.__actions__.length && (n = new Mn(this)), n = n.reverse(), n.__actions__.push({ func: nu, args: [Je], thisArg: F }), new zn(n, this.__chain__)) : this.thru(Je);
    }, On.prototype.toJSON = On.prototype.valueOf = On.prototype.value = function () {
      return kr(this.__wrapped__, this.__actions__);
    }, On.prototype.first = On.prototype.head, Ai && (On.prototype[Ai] = tu), On;
  }();"function" == "function" && _typeof(__webpack_require__(10)) == "object" && __webpack_require__(10) ? (Zn._ = it, !(__WEBPACK_AMD_DEFINE_RESULT__ = (function () {
    return it;
  }).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))) : Vn ? ((Vn.exports = it)._ = it, qn._ = it) : Zn._ = it;
}).call(this);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(2)(module)))

/***/ }),

/***/ 46:
/***/ (function(module, exports) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/* Modernizr 2.6.2 (Custom Build) | MIT & BSD
 * Build: http://modernizr.com/download/#-fontface-backgroundsize-borderradius-boxshadow-flexbox-hsla-multiplebgs-opacity-rgba-textshadow-cssanimations-generatedcontent-cssgradients-csstransforms-csstransforms3d-csstransitions-hashchange-input-inputtypes-touch-shiv-mq-cssclasses-addtest-teststyles-testprop-testallprops-hasevent-prefixes-domprefixes-css_boxsizing-css_pointerevents-elem_details-load
 */
;window.Modernizr = function (a, b, c) {
  function C(a) {
    j.cssText = a;
  }function D(a, b) {
    return C(n.join(a + ";") + (b || ""));
  }function E(a, b) {
    return (typeof a === "undefined" ? "undefined" : _typeof(a)) === b;
  }function F(a, b) {
    return !!~("" + a).indexOf(b);
  }function G(a, b) {
    for (var d in a) {
      var e = a[d];if (!F(e, "-") && j[e] !== c) return b == "pfx" ? e : !0;
    }return !1;
  }function H(a, b, d) {
    for (var e in a) {
      var f = b[a[e]];if (f !== c) return d === !1 ? a[e] : E(f, "function") ? f.bind(d || b) : f;
    }return !1;
  }function I(a, b, c) {
    var d = a.charAt(0).toUpperCase() + a.slice(1),
        e = (a + " " + p.join(d + " ") + d).split(" ");return E(b, "string") || E(b, "undefined") ? G(e, b) : (e = (a + " " + q.join(d + " ") + d).split(" "), H(e, b, c));
  }function J() {
    e.input = function (c) {
      for (var d = 0, e = c.length; d < e; d++) {
        t[c[d]] = c[d] in k;
      }return t.list && (t.list = !!b.createElement("datalist") && !!a.HTMLDataListElement), t;
    }("autocomplete autofocus list placeholder max min multiple pattern required step".split(" ")), e.inputtypes = function (a) {
      for (var d = 0, e, f, h, i = a.length; d < i; d++) {
        k.setAttribute("type", f = a[d]), e = k.type !== "text", e && (k.value = l, k.style.cssText = "position:absolute;visibility:hidden;", /^range$/.test(f) && k.style.WebkitAppearance !== c ? (g.appendChild(k), h = b.defaultView, e = h.getComputedStyle && h.getComputedStyle(k, null).WebkitAppearance !== "textfield" && k.offsetHeight !== 0, g.removeChild(k)) : /^(search|tel)$/.test(f) || (/^(url|email)$/.test(f) ? e = k.checkValidity && k.checkValidity() === !1 : e = k.value != l)), s[a[d]] = !!e;
      }return s;
    }("search tel url email datetime date month week time datetime-local number range color".split(" "));
  }var d = "2.6.2",
      e = {},
      f = !0,
      g = b.documentElement,
      h = "modernizr",
      i = b.createElement(h),
      j = i.style,
      k = b.createElement("input"),
      l = ":)",
      m = {}.toString,
      n = " -webkit- -moz- -o- -ms- ".split(" "),
      o = "Webkit Moz O ms",
      p = o.split(" "),
      q = o.toLowerCase().split(" "),
      r = {},
      s = {},
      t = {},
      u = [],
      v = u.slice,
      w,
      x = function x(a, c, d, e) {
    var f,
        i,
        j,
        k,
        l = b.createElement("div"),
        m = b.body,
        n = m || b.createElement("body");if (parseInt(d, 10)) while (d--) {
      j = b.createElement("div"), j.id = e ? e[d] : h + (d + 1), l.appendChild(j);
    }return f = ["&#173;", '<style id="s', h, '">', a, "</style>"].join(""), l.id = h, (m ? l : n).innerHTML += f, n.appendChild(l), m || (n.style.background = "", n.style.overflow = "hidden", k = g.style.overflow, g.style.overflow = "hidden", g.appendChild(n)), i = c(l, a), m ? l.parentNode.removeChild(l) : (n.parentNode.removeChild(n), g.style.overflow = k), !!i;
  },
      y = function y(b) {
    var c = a.matchMedia || a.msMatchMedia;if (c) return c(b).matches;var d;return x("@media " + b + " { #" + h + " { position: absolute; } }", function (b) {
      d = (a.getComputedStyle ? getComputedStyle(b, null) : b.currentStyle)["position"] == "absolute";
    }), d;
  },
      z = function () {
    function d(d, e) {
      e = e || b.createElement(a[d] || "div"), d = "on" + d;var f = d in e;return f || (e.setAttribute || (e = b.createElement("div")), e.setAttribute && e.removeAttribute && (e.setAttribute(d, ""), f = E(e[d], "function"), E(e[d], "undefined") || (e[d] = c), e.removeAttribute(d))), e = null, f;
    }var a = { select: "input", change: "input", submit: "form", reset: "form", error: "img", load: "img", abort: "img" };return d;
  }(),
      A = {}.hasOwnProperty,
      B;!E(A, "undefined") && !E(A.call, "undefined") ? B = function B(a, b) {
    return A.call(a, b);
  } : B = function B(a, b) {
    return b in a && E(a.constructor.prototype[b], "undefined");
  }, Function.prototype.bind || (Function.prototype.bind = function (b) {
    var c = this;if (typeof c != "function") throw new TypeError();var d = v.call(arguments, 1),
        e = function e() {
      if (this instanceof e) {
        var a = function a() {};a.prototype = c.prototype;var f = new a(),
            g = c.apply(f, d.concat(v.call(arguments)));return Object(g) === g ? g : f;
      }return c.apply(b, d.concat(v.call(arguments)));
    };return e;
  }), r.flexbox = function () {
    return I("flexWrap");
  }, r.touch = function () {
    var c;return "ontouchstart" in a || a.DocumentTouch && b instanceof DocumentTouch ? c = !0 : x(["@media (", n.join("touch-enabled),("), h, ")", "{#modernizr{top:9px;position:absolute}}"].join(""), function (a) {
      c = a.offsetTop === 9;
    }), c;
  }, r.hashchange = function () {
    return z("hashchange", a) && (b.documentMode === c || b.documentMode > 7);
  }, r.rgba = function () {
    return C("background-color:rgba(150,255,150,.5)"), F(j.backgroundColor, "rgba");
  }, r.hsla = function () {
    return C("background-color:hsla(120,40%,100%,.5)"), F(j.backgroundColor, "rgba") || F(j.backgroundColor, "hsla");
  }, r.multiplebgs = function () {
    return C("background:url(https://),url(https://),red url(https://)"), /(url\s*\(.*?){3}/.test(j.background);
  }, r.backgroundsize = function () {
    return I("backgroundSize");
  }, r.borderradius = function () {
    return I("borderRadius");
  }, r.boxshadow = function () {
    return I("boxShadow");
  }, r.textshadow = function () {
    return b.createElement("div").style.textShadow === "";
  }, r.opacity = function () {
    return D("opacity:.55"), /^0.55$/.test(j.opacity);
  }, r.cssanimations = function () {
    return I("animationName");
  }, r.cssgradients = function () {
    var a = "background-image:",
        b = "gradient(linear,left top,right bottom,from(#9f9),to(white));",
        c = "linear-gradient(left top,#9f9, white);";return C((a + "-webkit- ".split(" ").join(b + a) + n.join(c + a)).slice(0, -a.length)), F(j.backgroundImage, "gradient");
  }, r.csstransforms = function () {
    return !!I("transform");
  }, r.csstransforms3d = function () {
    var a = !!I("perspective");return a && "webkitPerspective" in g.style && x("@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}", function (b, c) {
      a = b.offsetLeft === 9 && b.offsetHeight === 3;
    }), a;
  }, r.csstransitions = function () {
    return I("transition");
  }, r.fontface = function () {
    var a;return x('@font-face {font-family:"font";src:url("https://")}', function (c, d) {
      var e = b.getElementById("smodernizr"),
          f = e.sheet || e.styleSheet,
          g = f ? f.cssRules && f.cssRules[0] ? f.cssRules[0].cssText : f.cssText || "" : "";a = /src/i.test(g) && g.indexOf(d.split(" ")[0]) === 0;
    }), a;
  }, r.generatedcontent = function () {
    var a;return x(["#", h, "{font:0/0 a}#", h, ':after{content:"', l, '";visibility:hidden;font:3px/1 a}'].join(""), function (b) {
      a = b.offsetHeight >= 3;
    }), a;
  };for (var K in r) {
    B(r, K) && (w = K.toLowerCase(), e[w] = r[K](), u.push((e[w] ? "" : "no-") + w));
  }return e.input || J(), e.addTest = function (a, b) {
    if ((typeof a === "undefined" ? "undefined" : _typeof(a)) == "object") for (var d in a) {
      B(a, d) && e.addTest(d, a[d]);
    } else {
      a = a.toLowerCase();if (e[a] !== c) return e;b = typeof b == "function" ? b() : b, typeof f != "undefined" && f && (g.className += " " + (b ? "" : "no-") + a), e[a] = b;
    }return e;
  }, C(""), i = k = null, function (a, b) {
    function k(a, b) {
      var c = a.createElement("p"),
          d = a.getElementsByTagName("head")[0] || a.documentElement;return c.innerHTML = "x<style>" + b + "</style>", d.insertBefore(c.lastChild, d.firstChild);
    }function l() {
      var a = r.elements;return typeof a == "string" ? a.split(" ") : a;
    }function m(a) {
      var b = i[a[g]];return b || (b = {}, h++, a[g] = h, i[h] = b), b;
    }function n(a, c, f) {
      c || (c = b);if (j) return c.createElement(a);f || (f = m(c));var g;return f.cache[a] ? g = f.cache[a].cloneNode() : e.test(a) ? g = (f.cache[a] = f.createElem(a)).cloneNode() : g = f.createElem(a), g.canHaveChildren && !d.test(a) ? f.frag.appendChild(g) : g;
    }function o(a, c) {
      a || (a = b);if (j) return a.createDocumentFragment();c = c || m(a);var d = c.frag.cloneNode(),
          e = 0,
          f = l(),
          g = f.length;for (; e < g; e++) {
        d.createElement(f[e]);
      }return d;
    }function p(a, b) {
      b.cache || (b.cache = {}, b.createElem = a.createElement, b.createFrag = a.createDocumentFragment, b.frag = b.createFrag()), a.createElement = function (c) {
        return r.shivMethods ? n(c, a, b) : b.createElem(c);
      }, a.createDocumentFragment = Function("h,f", "return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&(" + l().join().replace(/\w+/g, function (a) {
        return b.createElem(a), b.frag.createElement(a), 'c("' + a + '")';
      }) + ");return n}")(r, b.frag);
    }function q(a) {
      a || (a = b);var c = m(a);return r.shivCSS && !f && !c.hasCSS && (c.hasCSS = !!k(a, "article,aside,figcaption,figure,footer,header,hgroup,nav,section{display:block}mark{background:#FF0;color:#000}")), j || p(a, c), a;
    }var c = a.html5 || {},
        d = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,
        e = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,
        f,
        g = "_html5shiv",
        h = 0,
        i = {},
        j;(function () {
      try {
        var a = b.createElement("a");a.innerHTML = "<xyz></xyz>", f = "hidden" in a, j = a.childNodes.length == 1 || function () {
          b.createElement("a");var a = b.createDocumentFragment();return typeof a.cloneNode == "undefined" || typeof a.createDocumentFragment == "undefined" || typeof a.createElement == "undefined";
        }();
      } catch (c) {
        f = !0, j = !0;
      }
    })();var r = { elements: c.elements || "abbr article aside audio bdi canvas data datalist details figcaption figure footer header hgroup mark meter nav output progress section summary time video", shivCSS: c.shivCSS !== !1, supportsUnknownElements: j, shivMethods: c.shivMethods !== !1, type: "default", shivDocument: q, createElement: n, createDocumentFragment: o };a.html5 = r, q(b);
  }(this, b), e._version = d, e._prefixes = n, e._domPrefixes = q, e._cssomPrefixes = p, e.mq = y, e.hasEvent = z, e.testProp = function (a) {
    return G([a]);
  }, e.testAllProps = I, e.testStyles = x, g.className = g.className.replace(/(^|\s)no-js(\s|$)/, "$1$2") + (f ? " js " + u.join(" ") : ""), e;
}(this, this.document), function (a, b, c) {
  function d(a) {
    return "[object Function]" == o.call(a);
  }function e(a) {
    return "string" == typeof a;
  }function f() {}function g(a) {
    return !a || "loaded" == a || "complete" == a || "uninitialized" == a;
  }function h() {
    var a = p.shift();q = 1, a ? a.t ? m(function () {
      ("c" == a.t ? _B.injectCss : _B.injectJs)(a.s, 0, a.a, a.x, a.e, 1);
    }, 0) : (a(), h()) : q = 0;
  }function i(a, c, d, e, f, i, j) {
    function k(b) {
      if (!o && g(l.readyState) && (u.r = o = 1, !q && h(), l.onload = l.onreadystatechange = null, b)) {
        "img" != a && m(function () {
          t.removeChild(l);
        }, 50);for (var d in y[c]) {
          y[c].hasOwnProperty(d) && y[c][d].onload();
        }
      }
    }var j = j || _B.errorTimeout,
        l = b.createElement(a),
        o = 0,
        r = 0,
        u = { t: d, s: c, e: f, a: i, x: j };1 === y[c] && (r = 1, y[c] = []), "object" == a ? l.data = c : (l.src = c, l.type = a), l.width = l.height = "0", l.onerror = l.onload = l.onreadystatechange = function () {
      k.call(this, r);
    }, p.splice(e, 0, u), "img" != a && (r || 2 === y[c] ? (t.insertBefore(l, s ? null : n), m(k, j)) : y[c].push(l));
  }function j(a, b, c, d, f) {
    return q = 0, b = b || "j", e(a) ? i("c" == b ? v : u, a, b, this.i++, c, d, f) : (p.splice(this.i++, 0, a), 1 == p.length && h()), this;
  }function k() {
    var a = _B;return a.loader = { load: j, i: 0 }, a;
  }var l = b.documentElement,
      m = a.setTimeout,
      n = b.getElementsByTagName("script")[0],
      o = {}.toString,
      p = [],
      q = 0,
      r = "MozAppearance" in l.style,
      s = r && !!b.createRange().compareNode,
      t = s ? l : n.parentNode,
      l = a.opera && "[object Opera]" == o.call(a.opera),
      l = !!b.attachEvent && !l,
      u = r ? "object" : l ? "script" : "img",
      v = l ? "script" : u,
      w = Array.isArray || function (a) {
    return "[object Array]" == o.call(a);
  },
      x = [],
      y = {},
      z = { timeout: function timeout(a, b) {
      return b.length && (a.timeout = b[0]), a;
    } },
      _A,
      _B;_B = function B(a) {
    function b(a) {
      var a = a.split("!"),
          b = x.length,
          c = a.pop(),
          d = a.length,
          c = { url: c, origUrl: c, prefixes: a },
          e,
          f,
          g;for (f = 0; f < d; f++) {
        g = a[f].split("="), (e = z[g.shift()]) && (c = e(c, g));
      }for (f = 0; f < b; f++) {
        c = x[f](c);
      }return c;
    }function g(a, e, f, g, h) {
      var i = b(a),
          j = i.autoCallback;i.url.split(".").pop().split("?").shift(), i.bypass || (e && (e = d(e) ? e : e[a] || e[g] || e[a.split("/").pop().split("?")[0]]), i.instead ? i.instead(a, e, f, g, h) : (y[i.url] ? i.noexec = !0 : y[i.url] = 1, f.load(i.url, i.forceCSS || !i.forceJS && "css" == i.url.split(".").pop().split("?").shift() ? "c" : c, i.noexec, i.attrs, i.timeout), (d(e) || d(j)) && f.load(function () {
        k(), e && e(i.origUrl, h, g), j && j(i.origUrl, h, g), y[i.url] = 2;
      })));
    }function h(a, b) {
      function c(a, c) {
        if (a) {
          if (e(a)) c || (j = function j() {
            var a = [].slice.call(arguments);k.apply(this, a), l();
          }), g(a, j, b, 0, h);else if (Object(a) === a) for (n in m = function () {
            var b = 0,
                c;for (c in a) {
              a.hasOwnProperty(c) && b++;
            }return b;
          }(), a) {
            a.hasOwnProperty(n) && (!c && ! --m && (d(j) ? j = function j() {
              var a = [].slice.call(arguments);k.apply(this, a), l();
            } : j[n] = function (a) {
              return function () {
                var b = [].slice.call(arguments);a && a.apply(this, b), l();
              };
            }(k[n])), g(a[n], j, b, n, h));
          }
        } else !c && l();
      }var h = !!a.test,
          i = a.load || a.both,
          j = a.callback || f,
          k = j,
          l = a.complete || f,
          m,
          n;c(h ? a.yep : a.nope, !!i), i && c(i);
    }var i,
        j,
        l = this.yepnope.loader;if (e(a)) g(a, 0, l, 0);else if (w(a)) for (i = 0; i < a.length; i++) {
      j = a[i], e(j) ? g(j, 0, l, 0) : w(j) ? _B(j) : Object(j) === j && h(j, l);
    } else Object(a) === a && h(a, l);
  }, _B.addPrefix = function (a, b) {
    z[a] = b;
  }, _B.addFilter = function (a) {
    x.push(a);
  }, _B.errorTimeout = 1e4, null == b.readyState && b.addEventListener && (b.readyState = "loading", b.addEventListener("DOMContentLoaded", _A = function A() {
    b.removeEventListener("DOMContentLoaded", _A, 0), b.readyState = "complete";
  }, 0)), a.yepnope = k(), a.yepnope.executeStack = h, a.yepnope.injectJs = function (a, c, d, e, i, j) {
    var k = b.createElement("script"),
        l,
        o,
        e = e || _B.errorTimeout;k.src = a;for (o in d) {
      k.setAttribute(o, d[o]);
    }c = j ? h : c || f, k.onreadystatechange = k.onload = function () {
      !l && g(k.readyState) && (l = 1, c(), k.onload = k.onreadystatechange = null);
    }, m(function () {
      l || (l = 1, c(1));
    }, e), i ? k.onload() : n.parentNode.insertBefore(k, n);
  }, a.yepnope.injectCss = function (a, c, d, e, g, i) {
    var e = b.createElement("link"),
        j,
        c = i ? h : c || f;e.href = a, e.rel = "stylesheet", e.type = "text/css";for (j in d) {
      e.setAttribute(j, d[j]);
    }g || (n.parentNode.insertBefore(e, n), m(c, 0));
  };
}(this, document), Modernizr.load = function () {
  yepnope.apply(window, [].slice.call(arguments, 0));
}, Modernizr.addTest("boxsizing", function () {
  return Modernizr.testAllProps("boxSizing") && (document.documentMode === undefined || document.documentMode > 7);
}), Modernizr.addTest("pointerevents", function () {
  var a = document.createElement("x"),
      b = document.documentElement,
      c = window.getComputedStyle,
      d;return "pointerEvents" in a.style ? (a.style.pointerEvents = "auto", a.style.pointerEvents = "x", b.appendChild(a), d = c && c(a, "").pointerEvents === "auto", b.removeChild(a), !!d) : !1;
}), Modernizr.addTest("details", function () {
  var a = document,
      b = a.createElement("details"),
      c,
      d,
      e;return "open" in b ? (d = a.body || function () {
    var b = a.documentElement;return c = !0, b.insertBefore(a.createElement("body"), b.firstElementChild || b.firstChild);
  }(), b.innerHTML = "<summary>a</summary>b", b.style.display = "block", d.appendChild(b), e = b.offsetHeight, b.open = !0, e = e != b.offsetHeight, d.removeChild(b), c && d.parentNode.removeChild(d), e) : !1;
});

/***/ }),

/***/ 47:
/***/ (function(module, exports) {

/**
 *
 * '||''|.                            '||
 *  ||   ||    ....  .... ...   ....   ||    ...   ... ...  ... ..
 *  ||    || .|...||  '|.  |  .|...||  ||  .|  '|.  ||'  ||  ||' ''
 *  ||    || ||        '|.|   ||       ||  ||   ||  ||    |  ||
 * .||...|'   '|...'    '|     '|...' .||.  '|..|'  ||...'  .||.
 *                                                  ||
 * --------------- By Display:inline ------------- '''' -----------
 *
 * Auto-resizing textareas plugin
 *
 * Structural good practices from the article from Addy Osmani 'Essential jQuery plugin patterns'
 * @url http://coding.smashingmagazine.com/2011/10/11/essential-jquery-plugin-patterns/
 */

/*
 * The semi-colon before the function invocation is a safety
 * net against concatenated scripts and/or other plugins
 * that are not closed properly.
 */
;(function ($, window, document) {
	/*
  * document is passed through as local variable rather than as global, because this (slightly)
  * quickens the resolution process and can be more efficiently minified.
  */

	// Objects cache
	var win = $(window),
	    doc = $(document),
	    bod = $(document.body);

	/**
  * Helper function to build a pre element identical to the textarea
  * @param jQuery textarea the target textarea
  * @return jQuery the generated pre element
  */
	function buildTextareaPre(textarea) {
		// Box-sizing type
		var boxSized = textarea.css('box-sizing') === 'border-box' || textarea.css('-webkit-box-sizing') === 'border-box' || textarea.css('-moz-box-sizing') === 'border-box',
		    boxPadding = boxSized ? 'padding-bottom:' + (textarea.parseCSSValue('padding-top') + textarea.parseCSSValue('padding-bottom')) + 'px; ' : '',


		// Some browsers break lines a little bit before the padding box
		breakPadding = 0;
		if ($.browser.mozilla) {
			breakPadding = 8;
		} else if ($.browser.opera) {
			breakPadding = 4;
		} else if ($.browser.msie) {
			breakPadding = 2;
		}

		return $('<pre style="position: absolute; ' + 'top:0; ' + 'left:0; ' + 'padding:0; ' + 'visibility:hidden; ' + boxPadding + 'width:' + (textarea.width() - breakPadding) + 'px; ' + 'font-size:' + textarea.css('font-size') + '; ' + 'font-family:' + textarea.css('font-family') + '; ' + 'line-height:' + textarea.css('line-height') + '; ' + 'min-height:' + textarea.css('line-height') + '; ' + 'letter-spacing:' + textarea.css('letter-spacing') + '; ' + '">' + formatPreText(textarea.val()) + '</pre>').appendTo(bod);
	}

	/**
  * Helper function to format the text from the textarea before inserting
  * into the pre element
  * @param string text the text to format
  * @return string the formatted text
  */
	function formatPreText(text) {
		// Add an invisible char if the text starts or ends with a new line
		if (/^[\r\n]/.test(text)) {
			text = '\xA0' + text;
		}
		if (/[\r\n]$/.test(text)) {
			text += '\xA0';
		}

		return text;
	}

	/**
  * Resize a textarea to fit the content
  */
	function resizeTextarea() {
		var textarea = $(this).css({ overflow: 'hidden', resize: 'none' }),


		// Pre to get actual size
		pre = buildTextareaPre(textarea);

		// Set size
		textarea.height(pre.innerHeight() + 'px');

		// Remove pre
		pre.remove();
	}

	// Template setup function
	$.template.addSetupFunction(function (self, children) {
		var elements = this.findIn(self, children, 'textarea.autoexpanding').widthchange(resizeTextarea);

		// Timeout to handle browser initial redraw
		setTimeout(function () {
			elements.each(resizeTextarea);
		}, 40);

		return this;
	});

	// Listener
	doc.on('focus', 'textarea.autoexpanding', function () {
		// Target
		var textarea = $(this),


		// Pre to get actual size
		pre = buildTextareaPre(textarea),


		// Function to update size
		updatePre = function updatePre() {
			// Update content - IE7 is buggy with PRE tags
			// http://www.quirksmode.org/bugreports/archives/2004/11/innerhtml_and_t.html
			if ($.template.ie7) {
				pre.remove();
				pre = buildTextareaPre(textarea);
			} else {
				pre.text(formatPreText(textarea.val()));
			}

			// Refresh size
			textarea.height(pre.innerHeight() + 'px');
		},


		// Blur handling
		onBlur = function onBlur() {
			// Remove pre
			pre.remove();

			// Stop listening
			textarea.off(this.addEventListener ? 'input' : 'keyup', updatePre).off('blur', onBlur);
		};

		// Start listening
		textarea.on('input keyup', updatePre).on('blur', onBlur);
	});
})(jQuery, window, document);

/***/ }),

/***/ 48:
/***/ (function(module, exports) {

/**
 *
 * '||''|.                            '||
 *  ||   ||    ....  .... ...   ....   ||    ...   ... ...  ... ..
 *  ||    || .|...||  '|.  |  .|...||  ||  .|  '|.  ||'  ||  ||' ''
 *  ||    || ||        '|.|   ||       ||  ||   ||  ||    |  ||
 * .||...|'   '|...'    '|     '|...' .||.  '|..|'  ||...'  .||.
 *                                                  ||
 * --------------- By Display:inline ------------- '''' -----------
 *
 * Modal window plugin
 *
 * Structural good practices from the article from Addy Osmani 'Essential jQuery plugin patterns'
 * @url http://coding.smashingmagazine.com/2011/10/11/essential-jquery-plugin-patterns/
 */

/*
 * The semi-colon before the function invocation is a safety
 * net against concatenated scripts and/or other plugins
 * that are not closed properly.
 */
;(function ($, window, document) {
	/*
  * document is passed through as local variable rather than as global, because this (slightly)
  * quickens the resolution process and can be more efficiently minified.
  */

	// Objects cache
	var win = $(window),
	    doc = $(document),


	// Viewport dimensions
	viewportWidth = $.template.viewportWidth,
	    viewportHeight = $.template.viewportHeight;

	// Update on viewport resize
	win.on('normalized-resize orientationchange', function () {
		// Previous viewport dimensions
		var previousWidth = viewportWidth,
		    previousHeight = viewportHeight,
		    widthChange,
		    heightChange;

		// New dimensions
		viewportWidth = $.template.viewportWidth;
		viewportHeight = $.template.viewportHeight;

		// Size changes
		widthChange = Math.round((viewportWidth - previousWidth) / 2);
		heightChange = Math.round((viewportHeight - previousHeight) / 2);

		// Check windows size/position
		$.modal.all.each(function (i) {
			var modal = $(this),
			    data = modal.data('modal'),
			    initialWidth,
			    initialHeight;

			// If valid
			if (data) {
				// Initial size
				initialWidth = modal.outerWidth();
				initialHeight = modal.outerHeight();

				// Update max-sizes
				data.updateMaxSizes();

				// Redefine position relative to screen center
				data.setPosition(modal.parseCSSValue('left') + widthChange + Math.round((initialWidth - modal.outerWidth()) / 2), modal.parseCSSValue('top') + heightChange + Math.round((initialHeight - modal.outerHeight()) / 2));
			}
		});
	});

	/**
  * Return the modal windows root div
  * @return jQuery the jQuery object of the root div
  */
	function getModalRoot() {
		var root = $('#modals');
		if (root.length === 0) {
			// Create element
			root = $('<div id="modals"></div>').appendTo(document.body);

			// Add to position:fixed fallback
			if ($.fn.enableFixedFallback) {
				root.enableFixedFallback();
			}
		}

		return root;
	}

	/**
  * Opens a new modal window
  * @param object options an object with any of the $.modal.defaults options.
  * @return object the jQuery object of the new window
  */
	$.modal = function (options) {
		var settings = $.extend({}, $.modal.defaults, options),
		    root = getModalRoot(),


		// Elements
		modal,
		    barBlock,
		    contentBg,
		    contentBlock,
		    contentBlockIframe = false,
		    actionsBlock = false,
		    buttonsBlock = false,


		// Max sizes
		maxWidth,
		    maxHeight,


		// Blocker layer
		wasBlocked,
		    blocker = false,


		// DOM content
		dom,
		    domHidden = false,
		    placeholder,


		// Vars for handleResize and handleMove
		modalX = 0,
		    modalY = 0,
		    contentWidth = 0,
		    contentHeight = 0,
		    mouseX = 0,
		    mouseY = 0,
		    resized,
		    handleResize,
		    _endResize,
		    handleMove,
		    _endMove,


		// Vars for markup building
		title = settings.title ? '<h3>' + settings.title + '</h3>' : '',
		    titleBar = settings.titleBar || settings.titleBar === null && title.length > 0 ? '<div class="modal-bar">' + title + '</div>' : '',
		    sizeParts = [],
		    contentWrapper,
		    spacingClass = '',
		    scrolling,


		/**
   * Remove DOM content
   * @return void
   */
		removeDom = function removeDom() {
			// If DOM content is on
			if (dom) {
				// If pulled from the dom
				if (placeholder) {
					dom.detach().insertAfter(placeholder);
					placeholder.remove();
				}

				// If hidden
				if (domHidden) {
					dom.hide();
				}

				// Reset
				dom = false;
				domHidden = false;
				placeholder = false;
			}
		},


		/**
   * Set content, eventually wrapping it in beforeContent/afterContent if needed
   * @param string|jQuery content the conntent to append
   * @return void
   */
		setContent = function setContent(content) {
			var domWrapper;

			// Not available for iframes
			if (settings.useIframe) {
				return;
			}

			// Remove existing content
			removeDom();
			contentBlock.empty();

			if (typeof content !== 'string') {
				// Use dom content
				dom = settings.content;

				// This is required to handle DOM insertion when using beforeContent/afterContent
				content = '<span class="modal-dom-wrapper"></span>';

				// If hidden
				if (!dom.is(':visible')) {
					domHidden = true;
					dom.show();
				}

				// Check if already in the document
				if (dom.parent().length > 0) {
					placeholder = $('<span style="display:none"></span>').insertBefore(dom);
					dom.detach();
				}
			}

			// Insert
			contentBlock.append(settings.beforeContent + content + settings.afterContent);

			// DOM
			if (dom) {
				// Retrieve placeholder
				domWrapper = contentBlock.find('.modal-dom-wrapper');

				// Insert
				dom.insertAfter(domWrapper);

				// Remove placeholder
				domWrapper.remove();
			}
		},


		/**
   * Set window content-block size
   * @param int|boolean width the width to set, true to keep current or false for fluid width (false only works if not iframe)
   * @param int|boolean height the height to set, true to keep current or false for fluid height (false only works if not iframe)
   * @return void
   */
		setContentSize = function setContentSize(width, height) {
			var scrollX,
			    scrollY,
			    css = {};

			// If nothing changes
			if (width === true && height === true) {
				return;
			}

			// Mode
			if (settings.useIframe) {
				if (typeof width === 'number') {
					width = Math.min(width, maxWidth);
					contentBlock.css('width', width + 'px');
					contentBlockIframe.prop('width', width);
				}
				if (typeof height === 'number') {
					height = Math.min(height, maxHeight);
					contentBlock.css('height', height + 'px');
					contentBlockIframe.prop('height', height);
				}
			} else {
				// If width change
				if (width !== true) {
					// Apply width first
					contentBlock.css({
						width: width ? width + 'px' : ''
					});

					// Refresh tabs if any
					if ($.fn.refreshInnerTabs) {
						contentBlock.refreshInnerTabs();
					}

					// Check if everything fits
					scrollX = contentBlock.prop('scrollWidth');
					if (scrollX > width) {
						contentBlock.css({
							width: scrollX + 'px'
						});
					}
				}

				// Then set height
				if (width !== true) {
					contentBlock.css({
						height: height ? height + 'px' : ''
					});
				}

				// Check if everything fits
				scrollY = contentBlock.prop('scrollHeight');
				if (scrollY > height) {
					contentBlock.css({
						height: scrollY + 'px'
					});
				}
			}
		},


		/**
   * Set modal position
   * @param int x the horizontal position
   * @param int y the vertical position
   * @return void
   */
		setPosition = function setPosition(x, y, animate) {
			// Set position
			modal[animate ? 'animate' : 'css']({
				left: Math.min(Math.max(settings.maxSizeMargin, x), viewportWidth - modal.outerWidth() - settings.maxSizeMargin),
				top: Math.min(Math.max(settings.maxSizeMargin, y), viewportHeight - modal.outerHeight() - settings.maxSizeMargin)
			});
		},


		/**
   * Load ajax content or set iframe url
   * @param string url the url to load
   * @param object options options for AJAX loading (ignored if using iFrame)
   * @return void
   */
		loadContent = function loadContent(url, options) {
			// Mode
			if (settings.useIframe) {
				contentBlockIframe.prop('src', url);
			} else {
				// Settings with local scope callbacks
				var ajaxOptions = $.extend({}, $.modal.defaults.ajax, options, {

					// Handle loaded content
					success: function success(data, textStatus, jqXHR) {
						// Set content
						setContent(data);

						// Resize
						if (ajaxOptions.resize || ajaxOptions.resizeOnLoad) {
							setContentSize(true, false);
						}

						// Call user callback
						if (options.success) {
							options.success.call(this, data, textStatus, jqXHR);
						}
					}

				});

				// If no error callback
				if (!ajaxOptions.error && ajaxOptions.errorMessage) {
					ajaxOptions.error = function (jqXHR, textStatus, errorThrown) {
						setContent(ajaxOptions.errorMessage);
						if (ajaxOptions.resize || ajaxOptions.resizeOnMessage) {
							setContentSize(true, false);
						}
					};
				}

				// If loading message
				if (ajaxOptions.loadingMessage) {
					setContent(ajaxOptions.loadingMessage);
					if (ajaxOptions.resize || ajaxOptions.resizeOnMessage) {
						setContentSize(true, false);
					}
				}

				// Load content
				$.ajax(url, ajaxOptions);
			}
		},


		/**
   * Set the modal title, creating/removing elements as needed
   * @param string title the new title, or false/empty string for no title
   * @return void
   */
		setTitle = function setTitle(title) {
			var h3;

			// If no title bar, quit
			if (settings.titleBar === false) {
				return;
			}

			// If set
			if (typeof title === 'string' && title.length > 0) {
				// If the is no title bar yet
				if (!barBlock) {
					// Create
					barBlock = $('<div class="modal-bar"><h3>' + title + '</h3></div>').prependTo(modal);

					// If there are action leds, move them to the title bar
					if (actionsBlock) {
						actionsBlock.detach().prependTo(barBlock);
					}
				} else {
					// Find the title tag
					h3 = barBlock.children('h3');
					if (h3.length === 0) {
						h3 = $('<h3></h3>').appendTo(barBlock);
					}

					// Set title
					h3.html(title);
				}
			} else {
				// If there is already a title bar
				if (barBlock) {
					// If there are action leds, move them to the modal
					if (actionsBlock) {
						actionsBlock.detach().prependTo(modal);
					}

					// Remove bar
					barBlock.remove();
					barBlock = false;
				}
			}
		},


		/**
   * Close the modal
   * @return void
   */
		closeModal = function closeModal() {
			// Close callback
			if (settings.onClose) {
				if (settings.onClose.call(modal[0]) === false) {
					return;
				}
			}

			// Blocker
			if (blocker) {
				blocker.removeClass('visible');
			}

			// Fade then remove
			modal.stop(true).animate({
				'opacity': 0,
				'marginTop': '-30px'
			}, 300, function () {
				// Dom
				if (dom) {
					// If pulled from the dom
					if (placeholder) {
						dom.detach().insertAfter(placeholder);
						placeholder.remove();
					}

					// If hidden
					if (domHidden) {
						dom.hide();
					}
				}

				// Remove
				modal.remove();

				// Blocker
				if (blocker) {
					blocker.remove();
					if (root.children('.modal-blocker').length === 0) {
						root.removeClass('with-blocker');

						// Update position for fixed elements fallback
						if ($.fn.detectFixedBounds) {
							root.detectFixedBounds();
						}
					}
				}
			});

			// Remaining modals
			$.modal.all = modal.siblings('.modal');
			if ($.modal.all.length === 0) {
				// No more modals
				$.modal.current = false;
			} else {
				// Refresh current
				$.modal.current = $.modal.all.last();
			}
		},


		/**
   * Update content-block max siezs, according to viewport size and pre-defined max width/height
   * @return void
   */
		updateMaxSizes = function updateMaxSizes() {
			var viewportMaxWidth = viewportWidth - 2 * settings.maxSizeMargin - (modal.outerWidth() - contentBlock.width()),
			    viewportMaxHeight = viewportHeight - 2 * settings.maxSizeMargin - (modal.outerHeight() - contentBlock.height()),


			// Minimum sizes
			minWidth,
			    minHeight,


			// Actual and final iframe sizes
			width,
			    height,
			    finalWidth,
			    finalHeight;

			// maxWidth and maxHeight are set outside this function's scope, because they are used in setContentSize()

			// Get lowest values
			maxWidth = settings.maxWidth ? Math.min(settings.maxWidth, viewportMaxWidth) : viewportMaxWidth;
			maxHeight = settings.maxHeight ? Math.min(settings.maxHeight, viewportMaxHeight) : viewportMaxHeight;

			// Update content-block
			if (settings.useIframe) {
				// Actual iframe size
				width = parseInt(contentBlockIframe.prop('width'), 10) || settings.width;
				height = parseInt(contentBlockIframe.prop('height'), 10) || settings.height;

				// Final size
				finalWidth = Math.min(Math.max(width, settings.width), maxWidth);
				finalHeight = Math.min(Math.max(height, settings.height), maxHeight);

				contentBlock.css({
					width: finalWidth + 'px',
					height: finalHeight + 'px'
				});
				contentBlockIframe.prop('width', finalWidth);
				contentBlockIframe.prop('height', finalHeight);
			} else {
				// Minimum size also needs to be within viewport range
				minWidth = settings.minWidth ? Math.min(settings.minWidth, viewportMaxWidth) : viewportMaxWidth;
				minHeight = settings.minHeight ? Math.min(settings.minHeight, viewportMaxHeight) : viewportMaxHeight;

				// Update
				contentBlock.css({
					maxWidth: maxWidth + 'px',
					maxHeight: maxHeight + 'px',
					minWidth: minWidth + 'px',
					minHeight: minHeight + 'px'
				});
			}
		};

		// Blocker
		if (settings.blocker) {
			// Create
			wasBlocked = root.hasClass('with-blocker');
			blocker = $('<div class="modal-blocker"></div>').appendTo(root.addClass('with-blocker'));

			// Update position for fixed elements fallback
			if (!wasBlocked && $.fn.detectFixedBounds) {
				root.detectFixedBounds();
			}

			// Make it visible
			if (settings.blockerVisible) {
				// Adding the class afterwards will trigger the CSS animation
				blocker.addClass('visible');
			}
		}

		// If iframe
		if (settings.useIframe) {
			// Content size
			if (!settings.width) {
				settings.width = settings.maxWidth || settings.minWidth || 120;
			}
			if (!settings.height) {
				settings.height = settings.maxHeight || settings.minHeight || 120;
			}

			// Scrolling
			scrolling = settings.scrolling === true ? '' : ' scrolling="' + (typeof settings.scrolling === 'string' ? settings.scrolling : 'no') + '"';

			// Bloc style
			// The wrapping div is required because iOS ignores iframe size attributes
			contentWrapper = '<div style="width:' + settings.width + 'px; height:' + settings.height + 'px; -webkit-overflow-scrolling:touch; overflow: auto;">' + '<iframe class="modal-iframe" src="' + (settings.url || '') + '" frameborder="0" width="' + settings.width + '" height="' + settings.height + '"' + scrolling + '></iframe>' + '</div>';
		} else {
			// Content size
			if (settings.minWidth) {
				sizeParts.push('min-width:' + settings.minWidth + 'px;');
			}
			if (settings.minHeight) {
				sizeParts.push('min-height:' + settings.minHeight + 'px;');
			}
			if (settings.width) {
				sizeParts.push('width:' + settings.width + 'px;');
			}
			if (settings.height) {
				sizeParts.push('height:' + settings.height + 'px;');
			}
			if (settings.maxWidth) {
				sizeParts.push('max-width:' + settings.maxWidth + 'px;');
			}
			if (settings.maxHeight) {
				sizeParts.push('max-height:' + settings.maxHeight + 'px;');
			}

			// Bloc style
			contentWrapper = '<div class="modal-content' + (settings.scrolling ? ' modal-scroll' : '') + (settings.contentAlign !== 'left' ? ' align-' + settings.contentAlign : '') + '" style="' + sizeParts.join(' ') + '"></div>';
		}

		// Insert window
		modal = $('<div class="modal' + (settings.classes ? ' ' + settings.classes : '') + '"></div>').appendTo(root);
		barBlock = titleBar.length > 0 ? $(titleBar).appendTo(modal) : false;
		contentBg = settings.contentBg ? $('<div class="modal-bg"></div>').appendTo(modal) : false;
		contentBlock = $(contentWrapper).appendTo(contentBg || modal);

		// iFrame
		if (settings.useIframe) {
			contentBlockIframe = contentBlock.children('iframe');
		}

		// Set contents
		if (!settings.useIframe && settings.content) {
			setContent(settings.content);
		}

		// Custom scroll
		if (!settings.useIframe && $.fn.customScroll) {
			contentBlock.customScroll();
		}

		// If resizable
		if (settings.resizable) {
			// Set new size
			handleResize = function handleResize(event) {
				// Mouse offset
				var offsetX = event.pageX - mouseX,
				    offsetY = event.pageY - mouseY,


				// New size
				newWidth = Math.max(settings.minWidth, contentWidth + resized.width * offsetX),
				    newHeight = Math.max(settings.minHeight, contentHeight + resized.height * offsetY),


				// Position correction
				correctX = 0,
				    correctY = 0;

				// If max sizes are defined
				if (settings.maxWidth && newWidth > settings.maxWidth) {
					correctX = newWidth - settings.maxWidth;
					newWidth = settings.maxWidth;
				}
				if (settings.maxHeight && newHeight > settings.maxHeight) {
					correctY = newHeight - settings.maxHeight;
					newHeight = settings.maxHeight;
				}

				// Set size
				setContentSize(newWidth, newHeight);

				// Position
				setPosition(modalX + resized.left * (offsetX + correctX), modalY + resized.top * (offsetY + correctY));
			};

			// Callback on end of resize
			_endResize = function endResize(event) {
				doc.off('mousemove', handleResize).off('mouseup', _endResize);
			};

			// Create resize handlers
			$('<div class="modal-resize-nw"></div>').appendTo(modal).data('modal-resize', {
				top: 1, left: 1,
				height: -1, width: -1

			}).add($('<div class="modal-resize-n"></div>').appendTo(modal).data('modal-resize', {
				top: 1, left: 0,
				height: -1, width: 0
			})).add($('<div class="modal-resize-ne"></div>').appendTo(modal).data('modal-resize', {
				top: 1, left: 0,
				height: -1, width: 1
			})).add($('<div class="modal-resize-e"></div>').appendTo(modal).data('modal-resize', {
				top: 0, left: 0,
				height: 0, width: 1
			})).add($('<div class="modal-resize-se"></div>').appendTo(modal).data('modal-resize', {
				top: 0, left: 0,
				height: 1, width: 1
			})).add($('<div class="modal-resize-s"></div>').appendTo(modal).data('modal-resize', {
				top: 0, left: 0,
				height: 1, width: 0
			})).add($('<div class="modal-resize-sw"></div>').appendTo(modal).data('modal-resize', {
				top: 0, left: 1,
				height: 1, width: -1
			})).add($('<div class="modal-resize-w"></div>').appendTo(modal).data('modal-resize', {
				top: 0, left: 1,
				height: 0, width: -1
			})).mousedown(function (event) {
				// Detect positions
				contentWidth = contentBlock.width();
				contentHeight = contentBlock.height();
				var position = modal.position();
				modalX = position.left;
				modalY = position.top;

				// Mouse
				mouseX = event.pageX;
				mouseY = event.pageY;
				resized = $(this).data('modal-resize');

				// Prevent text selection
				event.preventDefault();

				doc.on('mousemove', handleResize).on('mouseup', _endResize);
			}).on('selectstart', _preventTextSelectionIE); // Prevent text selection for IE7
		}

		// If movable
		if (settings.draggable) {
			// Set position
			handleMove = function handleMove(event) {
				var touchEvent = event.type === 'touchmove',
				    offsetHolder = touchEvent ? event.originalEvent.touches[0] : event;

				// New position
				setPosition(modalX + (offsetHolder.pageX - mouseX), modalY + (offsetHolder.pageY - mouseY));
			};

			// Callback on end of move
			_endMove = function endMove(event) {
				var touchEvent = event.type === 'touchend';

				doc.off(touchEvent ? 'touchmove' : 'mousemove', handleMove).off(touchEvent ? 'touchend' : 'mouseup', _endMove);
			};

			// Watch
			// Delegating the event to the modal allows the remove/add the title bar without handling this each time
			modal.on('touchstart mousedown', '.modal-bar', function (event) {
				// Handle only if not clicking on the actions leds
				if ($(event.target).closest('.modal-actions').length > 0) {
					return;
				}

				// Detect positions
				var position = modal.position();
				modalX = position.left;
				modalY = position.top;
				touchEvent = event.type === 'touchstart', offsetHolder = touchEvent ? event.originalEvent.touches[0] : event, mouseX = offsetHolder.pageX;
				mouseY = offsetHolder.pageY;

				// Prevent text selection
				event.preventDefault();

				// Listeners
				doc.on(touchEvent ? 'touchmove' : 'mousemove', handleMove).on(touchEvent ? 'touchend' : 'mouseup', _endMove);
			}).on('selectstart', '.modal-bar', _preventTextSelectionIE); // Prevent text selection for IE7
		}

		// Put in front
		modal.mousedown(function () {
			modal.putModalOnFront();
		});

		// Action leds
		$.each(settings.actions, function (name, config) {
			// Format
			if (typeof config === 'function') {
				config = {
					click: config
				};
			}

			// Button zone
			if (!actionsBlock) {
				actionsBlock = $('<ul class="modal-actions children-tooltip"></ul>').prependTo(barBlock || modal).data('tooltip-options', settings.actionsTooltips);
			}

			// Insert
			$('<li' + (config.color ? ' class="' + config.color + '-hover"' : '') + '><a href="#" title="' + name + '">' + name + '</a></li>').appendTo(actionsBlock).children('a').click(function (event) {
				event.preventDefault();
				config.click.call(this, $(this).closest('.modal'), event);
			});
		});

		// Bottom buttons
		$.each(settings.buttons, function (name, config) {
			// Format
			if (typeof config === 'function') {
				config = {
					click: config
				};
			}

			// Button zone
			if (!buttonsBlock) {
				buttonsBlock = $('<div class="modal-buttons align-' + settings.buttonsAlign + (settings.buttonsLowPadding ? ' low-padding' : '') + '"></div>').insertAfter(contentBlock);
			} else {
				// Spacing
				spacingClass = ' mid-margin-left';
			}

			// Insert
			$('<button type="button" class="button' + (config.classes ? ' ' + config.classes : '') + spacingClass + '">' + name + '</button>').appendTo(buttonsBlock).click(function (event) {
				config.click.call(this, $(this).closest('.modal'), event);
			});
		});

		// Update max sizes
		updateMaxSizes();

		// Interface
		modal.data('modal', {
			contentBlock: contentBlock,
			contentBlockIframe: contentBlockIframe,
			setContent: setContent,
			load: loadContent,
			setContentSize: setContentSize,
			setPosition: setPosition,
			setTitle: setTitle,
			close: closeModal,
			updateMaxSizes: updateMaxSizes
		});

		// Center and display effect
		modal.centerModal().css({
			'opacity': 0,
			'marginTop': '-30px'
		}).animate({
			'opacity': 1,
			'marginTop': '10px'
		}, 200).animate({
			'marginTop': 0
		}, 100);

		// Store as current
		$.modal.current = modal;
		$.modal.all = root.children('.modal');

		// Callback
		if (settings.onOpen) {
			settings.onOpen.call(modal[0]);
		}

		// If content url
		if (!settings.useIframe && settings.url) {
			loadContent(settings.url, settings.ajax);
		}

		return modal;
	};

	/**
  * Internal function: used to prevent text selection under IE (event distint from 'mousedown')
  *
  * @return void
  */
	function _preventTextSelectionIE(event) {
		event.preventDefault();
	}

	/**
  * Shortcut to the current window, or false if none
  * @var jQuery|boolean
  */
	$.modal.current = false;

	/**
  * jQuery selection of all open modal windows
  * @var jQuery
  */
	$.modal.all = $();

	/**
  * Display an alert message
  * @param string message the message, as text or html
  * @param object options same as $.modal() (optional)
  * @return jQuery the new window
  */
	$.modal.alert = function (message, options) {
		options = options || {};
		$.modal($.extend({}, $.modal.defaults.alertOptions, options, {

			content: message

		}));
	};

	/**
  * Display a prompt
  * @param string message the message, as text or html
  * @param function callback the function called with the user value: function(value). Can return false to prevent close.
  * @param function cancelCallback a callback for when the user closes the modal or click on Cancel. Can return false to prevent close.
  * @param object options same as $.modal() (optional)
  * @return jQuery the new window
  */
	$.modal.prompt = function (message, callback, cancelCallback, options) {
		var isSubmitted = false,
		    onClose;

		// Params
		if (typeof cancelCallback !== 'function') {
			options = cancelCallback;
			cancelCallback = null;
		}
		options = $.extend({}, $.modal.defaults.promptOptions, options || {});

		// Cancel callback
		if (cancelCallback) {
			onClose = options.onClose;
			options.onClose = function (event) {
				// Check
				if (!isSubmitted && cancelCallback.call(this) === false) {
					return false;
				}

				// Previous onClose, if any
				if (onClose) {
					onClose.call(this, event);
				}
			};
		}

		// Content
		options.content = '<div class="margin-bottom">' + message + '</div><div class="input full-width"><input type="text" name="prompt-value" id="prompt-value" value="" class="input-unstyled full-width"></div>';

		// Buttons
		options.buttons = {};
		options.buttons[options.textCancel] = {
			classes: 'glossy',
			click: function click(modal) {
				modal.closeModal();
			}
		};
		options.buttons[options.textSubmit] = {
			classes: 'blue-gradient glossy',
			click: function click(modal) {
				// Mark as sumbmitted to prevent the cancel callback to fire
				isSubmitted = true;

				// Callback
				if (callback.call(modal[0], modal.find('input:first').val()) === false) {
					return;
				}

				// Close modal
				modal.closeModal();
			}
		};

		// Open modal
		$.modal(options);
	};

	/**
  * Display a confirm prompt
  * @param string message the message, as text or html
  * @param function confirmCallback the function called when hitting confirm
  * @param function cancelCallback the function called when hitting cancel or closing the modal
  * @param object options same as $.modal() (optional)
  * @return jQuery the new window
  */
	$.modal.confirm = function (message, confirmCallback, cancelCallback, options) {
		options = $.extend({}, $.modal.defaults.confirmOptions, options || {});

		// Cancel callback
		var isConfirmed = false,
		    onClose = options.onClose;
		options.onClose = function (event) {
			// Cancel callback
			if (!isConfirmed) {
				cancelCallback.call(this);
			}

			// Previous onClose, if any
			if (onClose) {
				onClose.call(this, event);
			}
		};

		// Content
		options.content = message;

		// Buttons
		options.buttons = {};
		options.buttons[options.textCancel] = {
			classes: 'glossy',
			click: function click(modal) {
				modal.closeModal();
			}
		};
		options.buttons[options.textConfirm] = {
			classes: 'blue-gradient glossy',
			click: function click(modal) {
				// Mark as sumbmitted to prevent the cancel callback to fire
				isConfirmed = true;

				// Callback
				confirmCallback.call(modal[0]);

				// Close modal
				modal.closeModal();
			}
		};

		// Open modal
		$.modal(options);
	};

	/**
  * Wraps the selected elements content in a new modal window.
  * Some options can be set using the inline html5 data-modal-options attribute:
  * <div data-modal-options="{'title':'Modal window title'}">Modal content</div>
  * @param object options same as $.modal()
  * @return jQuery the new window
  */
	$.fn.modal = function (options) {
		var modals = $();

		this.each(function () {
			var element = $(this);
			modals.add($.modal($.extend({}, options, element.data('modal-options'), { content: element })));
		});

		return modals;
	};

	/**
  * Use this method to retrieve the content div in the modal window
  */
	$.fn.getModalContentBlock = function () {
		if (this.hasClass('.modal-content')) {
			return this;
		}

		var data = this.getModalWindow().data('modal');
		return data ? data.contentBlockIframe || data.contentBlock : $();
	};

	/**
  * Use this method to retrieve the modal window from any element within it
  */
	$.fn.getModalWindow = function () {
		return this.closest('.modal');
	};

	/**
  * Set window content (only if not using iframe)
  * @param string|jQuery content the content to put: HTML or a jQuery object
  * @param boolean resize use true to resize window to fit content (height only)
  */
	$.fn.setModalContent = function (content, resize) {
		this.each(function () {
			var modal = $(this).getModalWindow(),
			    data = modal.length > 0 ? modal.data('modal') : false;

			// If valid
			if (data) {
				data.setContent(content);

				// Resizing
				if (resize) {
					data.setContentSize(true, false);
				}
			}
		});

		return this;
	};

	/**
  * Set window content-block size
  * @param int|boolean width the width to set, true to keep current or false for fluid width (false only works if not iframe)
  * @param int|boolean height the height to set, true to keep current or false for fluid height (false only works if not iframe)
  */
	$.fn.setModalContentSize = function (width, height) {
		this.each(function () {
			var modal = $(this).getModalWindow(),
			    data = modal.length > 0 ? modal.data('modal') : false;

			// If valid
			if (data) {
				data.setContentSize(width, height);
			}
		});

		return this;
	};

	/**
  * Load AJAX content
  * @param string url the content url
  * @param object options (see defaults.ajax for details)
  */
	$.fn.loadModalContent = function (url, options) {
		var settings = $.extend({}, $.modal.defaults.ajax, options);

		this.each(function () {
			var modal = $(this).getModalWindow(),
			    data = modal.length > 0 ? modal.data('modal') : false;

			// If valid
			if (data) {
				data.load(url, settings);
			}
		});

		return this;
	};

	/**
  * Set modal title
  * Note: if the option titleBar was set to false on opening, this will have no effect
  * @param string title the new title (may contain HTML), or an empty string to remove the title
  */
	$.fn.setModalTitle = function (title) {
		this.each(function () {
			var modal = $(this).getModalWindow(),
			    data = modal.length > 0 ? modal.data('modal') : false;

			// If valid
			if (data) {
				data.setTitle(title);
			}
		});

		return this;
	};

	/**
  * Center the modal
  * @param boolean animate true to animate the window movement
  */
	$.fn.centerModal = function (animate) {
		this.each(function () {
			var modal = $(this).getModalWindow(),
			    data = modal.length > 0 ? modal.data('modal') : false;

			// If valid
			if (data) {
				data.setPosition(Math.round((viewportWidth - modal.outerWidth()) / 2), Math.round((viewportHeight - modal.outerHeight()) / 2), animate);
			}
		});

		return this;
	};

	/**
  * Set the modal postion in screen, and make sure the window does not go out of the viewport
  * @param int x the horizontal position
  * @param int y the vertical position
  * @param boolean animate true to animate the window movement
  */
	$.fn.setModalPosition = function (x, y, animate) {
		this.each(function () {
			var modal = $(this).getModalWindow(),
			    data = modal.length > 0 ? modal.data('modal') : false;

			// If valid
			if (data) {
				data.setPosition(x, y, animate);
			}
		});

		return this;
	};

	/**
  * Put modal on front
  */
	$.fn.putModalOnFront = function () {
		if ($.modal.all.length > 1) {
			var root = getModalRoot();
			this.each(function () {
				var modal = $(this).getModalWindow();
				if (modal.next('.modal').length > 0) {
					modal.detach().appendTo(root);
				}
			});
		}

		return this;
	};

	/**
  * Closes the window
  */
	$.fn.closeModal = function () {
		return this.each(function () {
			var modal = $(this).getModalWindow(),
			    data = modal.data('modal');

			// If valid
			if (data) {
				data.close();
			}
		});
	};

	/**
  * Default modal window options
  */
	$.modal.defaults = {
		/**
   * Add a blocking layer to prevent interaction with background content
   * @var boolean
   */
		blocker: true,

		/**
   * Color the blocking layer (translucid black)
   * @var boolean
   */
		blockerVisible: true,

		/**
   * CSS classes for the modal
   * @var string
   */
		classes: '',

		/**
   * HTML before the content
   * @var string
   */
		beforeContent: '',

		/**
   * HTML after the content
   * @var string
   */
		afterContent: '',

		/**
   * Content of the window: HTML or jQuery object
   * @var string|jQuery|boolean
   */
		content: false,

		/**
   * Add a white background behind content
   * @var boolean
   */
		contentBg: true,

		/**
   * Alignement of contents ('left', 'center' or 'right') ignored for iframes
   * @var string
   */
		contentAlign: 'left',

		/**
   * Uses an iframe for content instead of a div
   * @var boolean
   */
		useIframe: false,

		/**
   * Url for loading content or iframe src
   * @var string|boolean
   */
		url: false,

		/**
   * Options for ajax loading
   * @var objects
   */
		ajax: {

			/**
    * Any message to display while loading, or leave empty to keep current content
    * @var string|jQuery
    */
			loadingMessage: null,

			/**
    * The message to display if a loading error happened. May be a function: function(jqXHR, textStatus, errorThrown)
    * Ignored if error callback is set
    * @var string|jQuery
    */
			errorMessage: 'Error while loading content. Please try again.',

			/**
    * Use true to resize window on loading message and when content is loaded. To define separately, use options below:
    * @var boolean
    */
			resize: false,

			/**
    * Use true to resize window on loading message
    * @var boolean
    */
			resizeOnMessage: false,

			/**
    * Use true to resize window when content is loaded
    * @var boolean
    */
			resizeOnLoad: false

		},

		/**
   * Show the title bar (use null to auto-detect when title is not empty)
   * @var boolean|null
   */
		titleBar: null,

		/**
   * Title of the window, or false for none
   * @var string|boolean
   */
		title: false,

		/**
   * Enable window moving
   * @var boolean
   */
		draggable: true,

		/**
   * Enable window resizing
   * @var boolean
   */
		resizable: true,

		/**
   * If  true, enable content vertical scrollbar if content is higher than 'height' (or 'maxHeight' if 'height' is undefined)
   * If useIframe is true, you may pass one one the scrolling attribute values: 'yes', 'no', 'auto'
   * @var boolean|string
   */
		scrolling: true,

		/**
   * Actions leds on top left corner, with text as key and function on click or config object as value
   * Ex:
   *
   *  {
   *      'Close' : function(modal) { modal.closeModal(); }
   *  }
   *
   * Or:
   *
   *  {
   *      'Close' : {
   *          color :		'red',
   *          click :		function(modal) { modal.closeModal(); }
   *      }
   *  }
   * @var boolean
   */
		actions: {
			'Close': {
				color: 'red',
				click: function click(modal) {
					modal.closeModal();
				}
			}
		},

		/**
   * Configuration for action tooltips
   * @var object
   */
		actionsTooltips: {
			spacing: 5,
			classes: ['black-gradient'],
			animateMove: 5
		},

		/**
   * Map of bottom buttons, with text as key and function on click or config object as value
   * Ex:
   *
   *  {
   *      'Close' : function(modal) { modal.closeModal(); }
   *  }
   *
   * Or:
   *
   *  {
   *      'Close' : {
   *          classes :	'blue-gradient glossy huge full-width',
   *          click :		function(modal) { modal.closeModal(); }
   *      }
   *  }
   * @var object
   */
		buttons: {
			'Close': {
				classes: 'blue-gradient glossy big full-width',
				click: function click(modal) {
					modal.closeModal();
				}
			}
		},

		/**
   * Alignement of buttons ('left', 'center' or 'right')
   * @var string
   */
		buttonsAlign: 'right',

		/**
   * Use low padding for buttons block
   * @var boolean
   */
		buttonsLowPadding: false,

		/**
   * Function called when opening window
   * Scope: the modal window
   * @var function
   */
		onOpen: false,

		/**
   * Function called when closing window.
   * Note: the function may return false to prevent close.
   * Scope: the modal window
   * @var function
   */
		onClose: false,

		/**
   * Minimum margin to viewport border around window when the max-size is reached
   * @var int
   */
		maxSizeMargin: 10,

		/**
   * Minimum content height
   * @var int
   */
		minHeight: 16,

		/**
   * Minimum content width
   * @var int
   */
		minWidth: 200,

		/**
   * Maximum content width, or false for no limit
   * @var int|boolean
   */
		maxHeight: false,

		/**
   * Maximum content height, or false for no limit
   * @var int|boolean
   */
		maxWidth: false,

		/**
   * Initial content height, or false for fluid size
   * @var int|boolean
   */
		height: false,

		/**
   * Initial content width, or false for fluid size
   * @var int|boolean
   */
		width: false,

		/**
   * Default options for alert() method
   * @var object
   */
		alertOptions: {
			contentBg: false,
			contentAlign: 'center',
			minWidth: 120,
			width: false,
			maxWidth: 260,
			resizable: false,
			actions: {},
			buttons: {

				'Close': {
					classes: 'blue-gradient glossy big full-width',
					click: function click(modal) {
						modal.closeModal();
					}
				}

			},
			buttonsAlign: 'center',
			buttonsLowPadding: true
		},

		/**
   * Default options for prompt() method
   * @var object
   */
		promptOptions: {
			width: false,
			maxWidth: 260,
			resizable: false,
			actions: {},

			/**
    * Text for cancel button for prompt windows
    * @var string
    */
			textCancel: 'Cancel',

			/**
    * Text for submit button for prompt windows
    * @var string
    */
			textSubmit: 'Submit'
		},

		/**
   * Default options for confirm() method
   * @var object
   */
		confirmOptions: {
			contentAlign: 'center',
			minWidth: 120,
			width: false,
			maxWidth: 260,
			buttonsAlign: 'center',

			/**
    * Text for cancel button for confirm windows
    * @var string
    */
			textCancel: 'Cancel',

			/**
    * Text for submit button for confirm windows
    * @var string
    */
			textConfirm: 'Confirm'
		}
	};
})(jQuery, window, document);

/***/ }),

/***/ 49:
/***/ (function(module, exports) {

/**
 *
 * '||''|.                            '||
 *  ||   ||    ....  .... ...   ....   ||    ...   ... ...  ... ..
 *  ||    || .|...||  '|.  |  .|...||  ||  .|  '|.  ||'  ||  ||' ''
 *  ||    || ||        '|.|   ||       ||  ||   ||  ||    |  ||
 * .||...|'   '|...'    '|     '|...' .||.  '|..|'  ||...'  .||.
 *                                                  ||
 * --------------- By Display:inline ------------- '''' -----------
 *
 * Form inputs styling plugin
 *
 * Structural good practices from the article from Addy Osmani 'Essential jQuery plugin patterns'
 * @url http://coding.smashingmagazine.com/2011/10/11/essential-jquery-plugin-patterns/
 */

/*
 * The semi-colon before the function invocation is a safety
 * net against concatenated scripts and/or other plugins
 * that are not closed properly.
 */
;(function ($, window, document, undefined) {
	/*
  * undefined is used here as the undefined global variable in ECMAScript 3 is mutable (i.e. it can
  * be changed by someone else). undefined isn't really being passed in so we can ensure that its value is
  * truly undefined. In ES5, undefined can no longer be modified.
  */

	/*
  * window and document are passed through as local variables rather than as globals, because this (slightly)
  * quickens the resolution process and can be more efficiently minified.
  */

	// Objects cache
	var win = $(window),
	    doc = $(document);

	/**
  * Convert switches, checkboxes and radios
  * @param object options an object with any of the $.fn.styleCheckable.defaults options.
  */
	$.fn.styleCheckable = function (options) {
		// Settings
		var globalSettings = $.extend({}, $.fn.styleCheckable.defaults, options);

		return this.each(function (i) {
			var element = $(this),
			    settings = $.extend({}, globalSettings, element.data('checkable-options')),
			    checked = this.checked ? ' checked' : '',
			    disabled = this.disabled ? ' disabled' : '',
			    replacement = element.data('replacement'),
			    title = this.title && this.title.length > 0 ? ' title="' + this.title + '"' : '',
			    tabIndex = this.tabIndex > 0 ? this.tabIndex : 0,
			    isWatching;

			// If already set
			if (replacement) {
				return;
			}

			// Stop DOM watching
			isWatching = $.template.disableDOMWatch();

			// Create replacement
			if (element.hasClass('switch')) {
				replacement = $('<span class="' + this.className.replace(/validate\[.*\]/, '') + checked + disabled + ' replacement"' + title + ' tabindex="' + tabIndex + '">' + '<span class="switch-on"><span>' + (element.data('text-on') || settings.textOn) + '</span></span>' + '<span class="switch-off"><span>' + (element.data('text-off') || settings.textOff) + '</span></span>' + '<span class="switch-button"></span>' + '</span>');
			} else {
				replacement = $('<span class="' + this.className.replace(/validate\[.*\]/, '') + checked + disabled + ' replacement"' + title + ' tabindex="' + tabIndex + '">' + '<span class="check-knob"></span>' + '</span>');
			}

			// Prevent the element from being focusable by keyboard
			this.tabIndex = -1;

			// Insert
			replacement.insertAfter(element).data('replaced', element);

			// Store reference
			element.data('replacement', replacement);

			// Add clear function
			element.addClearFunction(_removeCheckableReplacement);

			// Move select inside replacement, and remove styling
			element.detach().appendTo(replacement).data('initial-classes', this.className);
			this.className = this.className.indexOf('validate[') > -1 ? this.className.match(/validate\[.*\]/)[0] : '';

			// Re-enable DOM watching if required
			if (isWatching) {
				$.template.enableDOMWatch();
			}
		});
	};

	/*
  * Options for styled switches, checkboxes and radios
  */
	$.fn.styleCheckable.defaults = {
		/**
   * Default text for ON value
   * @var string
   */
		textOn: 'ON',

		/**
   * Default text for OFF value
   * @var string
   */
		textOff: 'OFF'
	};

	/**
  * Convert selects
  * @param object options an object with any of the $.fn.styleSelect.defaults options.
  */
	$.fn.styleSelect = function (options) {
		// Settings
		var globalSettings = $.extend({}, $.fn.styleSelect.defaults, options);

		return this.each(function (i) {
			var element = $(this),
			    settings = $.extend({}, globalSettings, element.data('select-options')),
			    replacement = element.data('replacement'),
			    hidden,
			    extraWidth = 0,
			    disabled = this.disabled ? ' disabled' : '',
			    showAsMultiple = (this.multiple || element.hasClass('multiple')) && !element.hasClass('multiple-as-single'),
			    isSized = element.attr('size') > 1,
			    title = this.title && this.title.length > 0 ? ' title="' + this.title + '"' : '',
			    tabIndex = this.tabIndex > 0 ? this.tabIndex : 0,
			    width,
			    widthString,
			    select,
			    dropDown,
			    text,
			    isWatching,
			    values;

			// If already set
			if (replacement) {
				return;
			}

			// Stop DOM watching
			isWatching = $.template.disableDOMWatch();

			// Reveal hidden parents for correct width processing
			hidden = element.tempShow();

			// Element width
			if (element.is(':hidden')) {
				element.show();
			}
			width = element.width();

			// Restore hidden parents
			hidden.tempShowRevert();

			// If full width, no need to set width
			if (element.hasClass('full-width')) {
				widthString = '';
			} else {
				// Check if width has been set in the element styling
				if (this.style.width !== '' && this.style.width != 'auto') {
					extraWidth = showAsMultiple ? 0 : -26;
				} else {
					// Size adjustment
					if (this.multiple) {
						if (showAsMultiple) {
							extraWidth = element.hasClass('check-list') ? 36 : 8;
						} else {
							extraWidth = element.hasClass('check-list') ? 10 : 8;
						}
					} else if (showAsMultiple) {
						extraWidth = element.hasClass('check-list') ? 21 : 0;
					}

					// Space for scrollbar
					if (showAsMultiple && isSized) {
						extraWidth += $.fn.customScroll ? 6 : 20;
					}

					// Extra width for safari
					if (navigator.userAgent.match(/Safari/) && !navigator.userAgent.match(/Chrome/)) {
						extraWidth += $.template.iPhone ? 6 : 23;
					}
				}

				// Final width string
				widthString = ' style="width:' + (width + extraWidth) + 'px"';
			}

			// Create replacement
			if (showAsMultiple) {
				// Create
				select = $('<span class="' + this.className.replace(/validate\[.*\]/, '').replace(/(\s*)select(\s*)/, '$1selectMultiple$2') + disabled + ' replacement"' + title + widthString + ' tabindex="' + tabIndex + '">' + '<span class="drop-down"></span>' + '</span>').insertAfter(element).data('replaced', element);

				// Register
				element.data('replacement', select);

				// Load options
				_refreshSelectValues.call(select);

				// If the number of visible options is set
				if (isSized && !element.getStyleString().match(/height\s*:\s*[0-9]+/i)) {
					// Set height
					dropDown = select.children('.drop-down');
					dropDown.height(element.hasClass('check-list') ? this.size * 37 - 1 : this.size * 26);

					// Enable scroll
					if ($.fn.customScroll) {
						dropDown.customScroll({
							padding: 4,
							showOnHover: false,
							usePadding: true
						});
					}
				}
			} else {
				// Create
				select = $('<span class="' + this.className.replace(/validate\[.*\]/, '') + disabled + ' replacement"' + title + widthString + ' tabindex="' + tabIndex + '">' + '<span class="select-value"></span>' + '<span class="select-arrow">' + ($.template.ie7 ? '<span class="select-arrow-before"></span><span class="select-arrow-after"></span>' : '') + '</span>' + '<span class="drop-down"></span>' + '</span>').insertAfter(element).data('replaced', element).on('select-prepare-open', _refreshSelectValues); // Load at first opening to reduce startup load

				// Gather selected values texts
				values = [];
				element.find(':selected').each(function (i) {
					values.push($(this).text());
				});

				// Update displayed value
				if (this.multiple) {
					switch (values.length) {
						case 1:
							_updateSelectValueText(select, values, element.data('single-value-text'), settings.singleValueText);
							break;

						case this.options.length:
							_updateSelectValueText(select, values, element.data('all-values-text'), settings.allValuesText);
							break;

						default:
							_updateSelectValueText(select, values, element.data('multiple-values-text'), settings.multipleValuesText);
							break;
					}
				} else {
					select.children('.select-value').html(values.length > 0 ? values.join(', ') : '&nbsp;');
				}

				// Register
				element.data('replacement', select);
			}

			// Custom event to refresh values list
			element.on('update-select-list', function (event) {
				_refreshSelectValues.apply(select[0]);
			});

			// Prevent the element from being focusable by keyboard
			this.tabIndex = -1;

			// Move select inside replacement, and remove styling
			element.detach().appendTo(select).data('initial-classes', this.className);
			this.className = this.className.indexOf('validate[') > -1 ? this.className.match(/validate\[.*\]/)[0] : '';

			// Add clear function
			element.addClearFunction(_removeSelectReplacement);

			// Store settings
			select.data('select-settings', settings);

			/*
    * To avoid triggering the default select UI, the select is hidden if:
    * - it is displayed as multiple (even if simple) OR
    * - it is multiple (no overlaying UI in most OS) OR
    * - The setting styledList is on AND
    *      - This is not a touch device OR
    *      - This is a touch device AND the setting styledOnTouch is:
    *          - true OR
    *          - null and the select has the class 'check-list'
    *
    * Ew. Now I need to get another brain.
    */
			if (showAsMultiple || this.multiple || settings.styledList && (!$.template.touchOs || $.template.touchOs && (settings.styledOnTouch === true || settings.styledOnTouch === null && select.hasClass('check-list')))) {
				element.hide();
			}

			// Re-enable DOM watching if required
			if (isWatching) {
				$.template.enableDOMWatch();
			}
		});
	};

	/*
  * Options for styled selects
  */
	$.fn.styleSelect.defaults = {
		/**
   * False to use system's drop-down UI, true to use style's drop-downs
   * @var boolean
   */
		styledList: true,

		/**
   * For touch devices: false to use system's drop-down UI, true to use style's drop-downs, or null to guess (true for check-list style, false for others)
   * Note: only works if styledList is true
   * @var boolean|null
   */
		styledOnTouch: null,

		/**
   * When focused, should the arrow down key open the drop-down or just scroll values?
   * @var boolean
   */
		openOnKeyDown: true,

		/**
   * Text for multiple select with no value selected
   * @var string
   */
		noValueText: '',

		/**
   * Text for multiple select with one value selected, or false to just display the selected value
   * @var string|boolean
   */
		singleValueText: false,

		/**
   * Text for multiple select with multiple values selected, or false to just display the selected list
   * Tip: use %d as a placeholder for the number of values
   * @var string|boolean
   */
		multipleValuesText: '%d selected',

		/**
   * Text for multiple select with all values selected, or false to just display the selected list
   * Tip: use %d as a placeholder for the number of values
   * @var string|boolean
   */
		allValuesText: 'All',

		/**
   * Enable search field when open - use null to automatically use when list has more than searchIfMoreThan elements
   * @var boolean|null
   */
		searchField: null,

		/**
   * Minimum number of elements to trigger a search field, if searchField is null
   * @var int
   */
		searchIfMoreThan: 40,

		/**
   * Helper text for seach field
   * @var string
   */
		searchText: 'Search'
	};

	/**
  * Convert file inputs
  * @param object options an object with any of the $.fn.styleFile.defaults options.
  */
	$.fn.styleFile = function (options) {
		// Settings
		var globalSettings = $.extend({}, $.fn.styleFile.defaults, options);

		return this.each(function (i) {
			var element = $(this).addClass('file'),
			    settings = $.extend({}, globalSettings, element.data('file-options')),
			    blackInput = element.hasClass('black-input') || element.closest('.black-inputs').length > 0 ? ' anthracite-gradient' : '',
			    multiple = !!this.multiple,
			    disabled = this.disabled ? ' disabled' : '',
			    isWatching;

			// If already set
			if (element.parent().hasClass('file')) {
				return;
			}

			// Stop DOM watching
			isWatching = $.template.disableDOMWatch();

			// Create styling
			styling = $('<span class="input ' + this.className.replace(/validate\[.*\]/, '') + disabled + '">' + '<span class="file-text">' + element.val() + '</span>' + '<span class="button compact' + blackInput + '">' + (multiple ? settings.textMultiple : settings.textSingle) + '</span>' + '</span>');

			// Insert
			styling.insertAfter(element);

			// Add clear function
			element.addClearFunction(_removeInputStyling);

			// Move select inside styling
			element.detach().appendTo(styling);

			// Re-enable DOM watching if required
			if (isWatching) {
				$.template.enableDOMWatch();
			}
		});
	};

	/*
  * Options for styled switches, checkboxes and radios
  */
	$.fn.styleFile.defaults = {
		/**
   * Button text - single file
   * @var string
   */
		textSingle: 'Select file',

		/**
   * Button text - multiple files
   * @var string
   */
		textMultiple: 'Select files'
	};

	/**
  * Set the value of a number input
  * @param number value the value to set
  */
	$.fn.setNumber = function (value) {
		return this.each(function (i) {
			var input;

			// Detect input
			if (this.nodeName.toLowerCase() === 'input') {
				input = $(this);
			} else {
				input = $(this).children('input:first');
				if (input.length === 0) {
					return;
				}
			}

			// Set value
			input.val(_formatNumberValue(value, _getNumberOptions(input)));
		});
	};

	/**
  * Increment/decrement the value of a number input
  * @param boolean up true if the value should be incremented, false for decremented
  * @param boolean shift whether to use shiftIncrement or not (optional, default: false)
  */
	$.fn.incrementNumber = function (up, shift) {
		return this.each(function (i) {
			var input, options, value;

			// Detect input
			if (this.nodeName.toLowerCase() === 'input') {
				input = $(this);
			} else {
				input = $(this).children('input:first');
				if (input.length === 0) {
					return;
				}
			}

			// Options
			options = _getNumberOptions(input);

			// Remove format
			value = _unformatNumberValue(input.val(), options);

			// Check if numeric
			if (isNaN(value)) {
				value = 0;
			}

			// Increment value
			value += up ? shift ? options.shiftIncrement : options.increment : shift ? -options.shiftIncrement : -options.increment;

			// Set value
			input.val(_formatNumberValue(value, options));
		});
	};

	/**
  * Helper function: load and format number input options
  * @param jQuery input the target input
  * @return object the options object
  */
	function _getNumberOptions(input) {
		var options = input.data('number-options'),
		    temp;

		// If not set yet or not formatted
		if (!options || !options.formatted) {
			// Extend
			options = $.extend({}, $.fn.setNumber.defaults, options);

			// Validate
			if (typeof options.min !== 'number') {
				options.min = null;
			}
			if (typeof options.max !== 'number') {
				options.max = null;
			}
			if (options.min !== null && options.max !== null) {
				if (options.min > options.max) {
					temp = options.max;
					options.max = options.min;
					options.min = temp;
				}
			}
			if (!options.precision) {
				options.precision = 1;
			}

			// Set as ready
			options.formatted = true;
			input.data('number-options', options);
		}

		return options;
	}

	/**
  * Helper function: remove user format of a number value according to options
  * @param value the value
  * @param object options the validated options
  * @return number the valid value
  */
	function _unformatNumberValue(value, options) {
		if (typeof value !== 'number') {
			if (options.thousandsSep.length) {
				value = value.replace(options.thousandsSep, '');
			}
			if (options.decimalPoint !== '.') {
				value = value.replace(options.decimalPoint, '.');
			}
			value = parseFloat(value);
			if (isNaN(value)) {
				value = 0;
			}
		}

		return value;
	}

	/**
  * Helper function: format a number value according to options
  * @param value the value
  * @param object options the validated options
  * @return number|string the valid value
  */
	function _formatNumberValue(value, options) {
		var parts;

		// Remove format
		value = _unformatNumberValue(value, options);

		// Round value
		value = Math.round(value / options.precision) * options.precision;

		// Check min/max
		if (options.min !== null) {
			value = Math.max(value, options.min);
		}
		if (options.max !== null) {
			value = Math.min(value, options.max);
		}

		// Format value
		parts = value.toString().split('.');

		// Thousands separator
		if (options.thousandsSep.length && parts[0].length > 3) {
			parts[0] = parts[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, options.thousandsSep);
		}

		return parts.join(options.decimalPoint);
	}

	/*
  * Options for number inputs
  */
	$.fn.setNumber.defaults = {
		/**
   * Minimum value (null for none)
   * @var number|null
   */
		min: null,

		/**
   * Maximum value (null for none)
   * @var number|null
   */
		max: null,

		/**
   * Increment of up/down arrows and keys
   * @var number
   */
		increment: 1,

		/**
   * Increment of up/down arrows and keys when holding shift key
   * @var number
   */
		shiftIncrement: 10,

		/**
   * Precision of the value: the user input will be rounded using it.
   * For instance, use 1 for rounded nombers, 0.25 to user quarter increments...
   * @var number
   */
		precision: 1,

		/**
   * Character used for decimal point
   * @var string
   */
		decimalPoint: '.',

		/**
   * Character used for thousands separator
   * @var string
   */
		thousandsSep: ''
	};

	/**
  * Helper function to check if an element is an input/select/textarea/button and may be disabled
  * @param jQuery element the element to check
  * @return boolean true if the element may be disabled, else false
  */
	function mayBeDisabled(element) {
		var nodeName = element[0].nodeName.toLowerCase();
		return nodeName === 'input' || nodeName === 'select' || nodeName === 'textarea' || nodeName === 'button';
	}

	/**
  * Enable a form input, and update the styled UI
  */
	$.fn.enableInput = function () {
		return this.each(function (i) {
			var element = $(this),
			    replacement,
			    replaced;

			// Inputs
			if (mayBeDisabled(element)) {
				// Enable
				element.prop('disabled', false);

				// Style replacement
				replacement = element.data('replacement');
				if (replacement) {
					replacement.removeClass('disabled');
				}
			}
			// Replacements
			else {
					// Look for input
					replaced = element.data('replaced');
					if (replaced && mayBeDisabled(replaced)) {
						// Enable input
						replaced.prop('disabled', false);

						// Style replacement
						element.removeClass('disabled');
					}
				}
		});
	};

	/**
  * Disable a form input, and update the styled UI
  */
	$.fn.disableInput = function () {
		return this.each(function (i) {
			var element = $(this),
			    replacement,
			    replaced;

			// Inputs
			if (mayBeDisabled(element)) {
				// Enable
				element.prop('disabled', true);

				// Style replacement
				replacement = element.data('replacement');
				if (replacement) {
					replacement.addClass('disabled');
				}
			}
			// Replacements
			else {
					// Look for input
					replaced = element.data('replaced');
					if (replaced && mayBeDisabled(replaced)) {
						// Enable input
						replaced.prop('disabled', true);

						// Style replacement
						element.addClass('disabled');
					}
				}
		});
	};

	// Add to template setup function
	$.template.addSetupFunction(function (self, children) {
		var elements = this;

		// Switches, checkboxes and radios
		elements.findIn(self, children, 'input.switch, input.checkbox, input.radio').each(function (i) {
			// Style element
			$(this).styleCheckable();

			// If in the root target, add to selection
			if (self && elements.is(this)) {
				elements = elements.add(this);
			}
		});

		// Checkables in buttons
		elements.findIn(self, children, 'label.button').children(':radio, :checkbox').each(function (i) {
			// Style element
			if (this.checked) {
				$(this).parent().addClass('active');
			}
		});

		// File inputs
		elements.findIn(self, children, '.file').filter('input[type="file"]').styleFile();

		// Placeholder polyfill
		if (!Modernizr.input.placeholder) {
			elements.findIn(self, children, 'input[placeholder][type!="password"]').each(function (i) {
				var input = $(this),
				    placeholder = input.attr('placeholder');

				// Mark and add data for validation plugin
				input.addClass('placeholder').attr('data-validation-placeholder', placeholder);

				// Fill if empty
				if ($.trim(input.val()) === '') {
					input.val(placeholder);
				}
			});
		}

		// Selects
		elements.findIn(self, children, 'select.select').each(function (i) {
			// Style element
			$(this).styleSelect();

			// If in the root target, add to selection
			if (self && elements.is(this)) {
				elements = elements.add(this);
			}
		});

		return elements;
	});

	/********************************************************/
	/*                   Helper functions                   */
	/********************************************************/

	/**
  * Open a select drop-down list
  *
  * @param jQuery select the replacement select
  * @param boolean onHover whether the select was open on hover or not (optional, default: none)
  * @param event the opening event (optional)
  * @return void
  */
	function _openSelect(select, onHover, event) {
		var replaced = select.data('replaced'),
		    settings = select.data('select-settings') || {},
		    list = select.children('.drop-down'),
		    formAttr,
		    form,
		    placeholder,
		    addedClasses = [],
		    inheritParent,
		    scrollParents,
		    hasFocus,
		    position,
		    listOffset,
		    winHeight,
		    listHeight,
		    optionHeight,
		    listExtra,
		    availableHeight,
		    fixedSize = false,
		    search = false,
		    searchSpan,
		    searchField,
		    date = new Date(),
		    time = date.getTime(),
		    isWatching,
		    updateList,
		    _onBlur;

		// Prevent event default
		if (event) {
			event.preventDefault();
		}

		// Do not handle if disabled
		if (select.closest('.disabled').length > 0 || replaced && replaced.is(':disabled')) {
			return;
		}

		// Do not handle if the OS UI should be used
		if (replaced && !replaced.is(':hidden')) {
			return;
		}

		// Parent form
		if (replaced) {
			formAttr = replaced.attr('form');
			form = !formAttr || formAttr === '' ? replaced.closest('form') : $('#' + formAttr);
		}

		// If not open yet
		if (!select.hasClass('open') && list.length > 0) {
			// List of scrolling parents
			scrollParents = select.parents('.custom-scroll');

			// Add class if the select is in a top-level element
			if (select.closest('.modal, .notification, .tooltip').length > 0) {
				select.addClass('over');
			}

			// Stop DOM watching
			isWatching = $.template.disableDOMWatch();

			// Position
			selectOffset = select.offset();

			// Check if has focus
			hasFocus = select.is(':focus');

			// Placeholder
			placeholder = $('<span class="' + select[0].className + '" style="' + 'width: ' + select.width() + 'px !important; ' + '-webkit-box-shadow: none !important; ' + '-moz-box-shadow: none !important; ' + 'box-shadow: none !important;' + '"></span>').insertBefore(select).append(select.children('.select-value').clone());

			// Size for fluid elements
			if (select.hasClass('full-width')) {
				select.css({ width: select.width() + 'px' });
				fixedSize = true;
			}

			/*
    * Inherited classes check
    */

			// Glossy
			if (!select.is('.glossy')) {
				inheritParent = select.closest('.glossy');
				if (inheritParent.length > 0) {
					addedClasses.push('glossy');
				}
			}

			// Size
			if (!select.is('.compact')) {
				inheritParent = select.parent('.compact');
				if (inheritParent.length > 0) {
					addedClasses.push('compact');
				}
			}

			// If any extra class found
			if (addedClasses.length > 0) {
				select.addClass(addedClasses.join(' '));
			}

			// Detach and put on top of everything, then track placeholder's position
			select.detach().appendTo(document.body).trackElement(placeholder);

			// Re-enable DOM watching if required
			if (isWatching) {
				$.template.enableDOMWatch();
			}

			// Restore focus if required
			if (hasFocus) {
				select.focus();
			}

			// Prepare and open
			select.removeClass('reversed').trigger('select-prepare-open').addClass('open').trigger('select-open').on('click', _preventSelectClick);

			/*
    * Search field
    */

			// If search field should be used
			if (!select.hasClass('auto-open') && (settings.searchField === true || settings.searchField === null && list.children('a, span').length >= settings.searchIfMoreThan)) {
				// Create elements
				search = $('<span class="select-search"></span>').appendTo(select);
				searchSpan = $('<span>' + settings.searchText + '</span>').appendTo(search);
				searchField = $('<input type="text" value="">').appendTo(search);

				// Behavior
				search.on('keydown click touchend', function (event) {
					event.stopPropagation();
				});
				searchField.focus(function () {
					select.addClass('focus');
				}).blur(function () {
					select.removeClass('focus');
				}).keyup(function (event) {
					var text = $.trim(searchField.val()),
					    searchRegex;

					// If search is empty
					if (text.length === 0) {
						list.children().show();
						searchSpan.fadeIn();
						return;
					}

					// Hide placeholder
					searchSpan.hide();

					// Regular expression
					searchRegex = new RegExp($.trim(searchField.val()).toLowerCase(), 'g');

					// Loop through values to find a match
					list.children('a, span').each(function (i) {
						var option = $(this);

						// If matches
						if ($.trim(option.text().toLowerCase()).match(searchRegex)) {
							option.show();
						} else {
							option.hide();
						}
					});
				});
			}

			/*
    * Set select list position according to available screen space
    */

			// Add scroll
			if ($.fn.customScroll) {
				if (!list.hasCustomScroll()) {
					list.customScroll({
						padding: 4,
						showOnHover: false,
						usePadding: true
					});
				}
			}

			// Get heights
			listOffset = list.removeClass('reversed').position().top;
			listHeight = list.outerHeight();
			listExtra = listHeight - list.height();

			// Function to refresh position on resize/scroll
			updateList = function updateList() {
				var scrollPos;

				// Refresh size
				listHeight = list.css('max-height', '').outerHeight();

				// Select vertical position
				position = select.offset().top - win.scrollTop();

				// Viewport height
				winHeight = win.height();

				// If too long to fit
				if (position + listOffset + listHeight > winHeight) {
					// Check if it fits on top
					if (position - listOffset - listHeight > 0) {
						// Display on top
						select.addClass('reversed');
					}
					/*
      * Now we know that the list can't be displayed full size, so we truncate it.
      * If the select is above 60% of screen height, it will show under, otherwise on top
      */
					else {
							if (position > winHeight * 0.6) {
								// Display on top
								select.addClass('reversed');
								availableHeight = position;
							} else {
								// Display under
								select.removeClass('reversed');
								availableHeight = winHeight - position - listOffset;
							}

							// Remove list padding/borders from available size
							availableHeight -= listExtra;

							// Set max-height to use available space
							list.css({
								maxHeight: availableHeight - 10 + 'px'
							});

							// Try to restore scroll position
							scrollPos = select.data('scrollPosition');
							if (scrollPos) {
								list[0].scrollTop = scrollPos;
							}
						}
				} else {
					// Clear changes
					select.removeClass('reversed');
				}

				// Clear data
				select.removeData('scrollPosition');

				// Update scroll
				if ($.fn.customScroll) {
					list.refreshCustomScroll();
				}
			};

			// Function to handle focus loss
			_onBlur = function onBlur(event) {
				// Remove events
				win.off('resize', updateList);
				doc.off('scroll', _onBlur);
				if (form) {
					form.off('submit', _onBlur);
				}
				scrollParents.off('scroll', _onBlur);
				if (onHover && !$.template.touchOs) {
					select.off('mouseleave', _onBlur);
				} else {
					doc.off('touchend click', _onBlur);
				}

				// Clear data
				select.removeData('selectCloseFunction');

				// Check if has focus
				var hasFocus = select.is(':focus');

				// Remove search field
				if (search) {
					if (searchField.is(':focus')) {
						hasFocus = true;
					}
					search.remove();
					list.children().show();
				}

				// Size for fluid elements
				if (fixedSize) {
					select.css({ width: '' });
				}

				// Inherited classes
				if (addedClasses.length > 0) {
					select.removeClass(addedClasses.join(' '));
				}

				// Store scroll position for later re-opening
				select.data('scrollPosition', list[0].scrollTop);

				// Stop DOM watching
				isWatching = $.template.disableDOMWatch();

				// Put element back in place
				select.stopTracking(true).off('click', _preventSelectClick).removeClass('over').detach().insertAfter(placeholder).trigger('select-prepare-close').removeClass('open').trigger('select-close');
				placeholder.remove();

				// Re-enable DOM watching if required
				if (isWatching) {
					$.template.enableDOMWatch();
				}

				// Restore focus if required
				if (hasFocus) {
					select.focus();
				}
			};

			// Store for external calls
			select.data('selectCloseFunction', _onBlur);

			// First call and binding
			updateList();
			win.on('resize', updateList);
			doc.on('scroll', _onBlur);
			if (form) {
				form.on('submit', _onBlur);
			}
			scrollParents.on('scroll', _onBlur);
			if (onHover && !$.template.touchOs) {
				select.on('mouseleave', _onBlur);
			} else {
				doc.on('click', _onBlur);
			}
		}
	}

	/**
  * Prevent the click event from bubbling when open
  *
  * @return void
  */
	function _preventSelectClick(event) {
		event.preventDefault();
	}

	/**
  * Refresh select values
  *
  * @return void
  */
	function _refreshSelectValues() {
		var select = $(this),
		    list = select.children('.drop-down'),
		    replaced = select.data('replaced'),
		    checkList = select.hasClass('check-list') ? '<span class="check"></span>' : '',
		    isWatching;

		// If valid
		if (list.length > 0 && replaced) {
			// Disable DOM watching for better performance
			isWatching = $.template.disableDOMWatch();

			list.empty();
			replaced.find('option, optgroup').each(function (i) {
				var classes = [],
				    option = this.nodeName.toLowerCase() === 'option',
				    node = option ? 'span' : 'strong',
				    text = option ? $(this).text() : this.label;

				// Mode
				if (option) {
					// State
					if (this.selected) {
						classes.push('selected');
					}

					// If in an optgroup
					if (this.parentNode.nodeName.toLowerCase() === 'optgroup') {
						classes.push('in-group');
					}

					// If disabled
					if (this.disabled) {
						classes.push('disabled');
					}
				}

				// Empty text
				if (text.length === 0) {
					text = '&nbsp;';
				}

				$('<' + node + (classes.length > 0 ? ' class="' + classes.join(' ') + '"' : '') + '>' + checkList + text + '</' + node + '>').appendTo(list).data('select-value', this);
			});
			list.children('span').not('.disabled').on('touchend click', _clickSelectValue);

			// Re-enable DOM watching if required
			if (isWatching) {
				$.template.enableDOMWatch();
			}

			// Remove binding
			select.off('select-prepare-open', _refreshSelectValues);
		}
	}

	/**
  * Select a list value
  *
  * @param object event
  * @return void
  */
	function _clickSelectValue(event) {
		// Check if valid touch-click event
		if (!$.template.processTouchClick(this, event)) {
			event.stopPropagation();
			return;
		}

		var option = $(this),
		    list = option.parent(),
		    select = list.parent(),
		    replaced = select.data('replaced'),
		    replacedOption = option.data('select-value'),
		    multiple = replaced[0].multiple,
		    selected,
		    value;

		// Detect touch scrolling
		if (list.data('touch-scrolling')) {
			return;
		}

		// If valid
		if (replaced && replacedOption) {
			// If multiple selection and holding ctrl/cmd
			if (multiple && ($.template.touchOs || event.ctrlKey || event.metaKey || select.hasClass('easy-multiple-selection'))) {
				// Current option state
				selected = option.hasClass('selected');

				// Multiple selects require a last one selected option, except if marked
				if (!select.hasClass('allow-empty')) {
					// Only change if the option wasn't selected, or if there is at least one other selected option
					if (!selected || selected && (value = replaced.val()) && value.length > 1) {
						// Update select
						replacedOption.selected = !selected;
						replaced.trigger('change');
					}
				} else {
					// Default behavior
					replacedOption.selected = !selected;
					replaced.trigger('change');
				}

				// Stop propagation to allow multiple selection
				if (event.type === 'touchend' || !select.hasClass('selectMultiple')) {
					event.stopPropagation();
				}
			}
			// Standard selection mode
			else {
					// Get current value
					value = replaced.val();
					if (multiple && (value === null || value === undefined)) {
						value = [];
					}

					// Compare depending on mode
					if (multiple && (value.length !== 1 || value[0] !== replacedOption.value) || !multiple && value !== replacedOption.value) {
						// Update select
						replaced.val(replacedOption.value).trigger('change');
					}
				}
		}
	}

	/**
  * Set the select replacement text according to options
  *
  * @param jQuery select the replacement select
  * @param array values the list of selected values text
  * @param string|boolean dataText template specified in the element's data, if any
  * @param string|boolean defaultText default value
  * @return void
  */
	function _updateSelectValueText(select, values, dataText, defaultText) {
		// If no user value, use default
		if (!dataText) {
			dataText = defaultText;
		}

		// Must not be empty to preserve vertical-align
		if (typeof dataText === 'string' && dataText.length === 0) {
			dataText = '&nbsp;';
		}

		// Check format
		if (typeof dataText === 'boolean') {
			select.children('.select-value').removeClass('alt').html(values.length > 0 ? values.join(', ') : '&nbsp;');
		} else {
			select.children('.select-value').addClass('alt').html(dataText.replace('%d', values.length));
		}
	}

	/**
  * Get a select selected value index
  *
  * @param jQuery select the select selection
  * @return int|boolean, the selected index, or -1 if none, or false if several values are selected
  */
	function _getSelectedIndex(select) {
		// Mode
		if (select[0].multiple) {
			// Multiple select values
			val = select.val();

			// If several values
			if (val && val.length > 1) {
				selectedIndex = false;
			} else {
				selectedIndex = select[0].selectedIndex;
			}
		} else {
			selectedIndex = select[0].selectedIndex;
		}

		// Detect if undefined
		if (selectedIndex === null || selectedIndex === undefined) {
			selectedIndex = -1;
		}

		return selectedIndex;
	}

	/**
  * Clean delete of a radio/checkbox replacement
  *
  * @return void
  */
	function _removeCheckableReplacement() {
		var element = $(this),
		    replacement = element.data('replacement'),
		    blurFunc;

		// If not replaced
		if (!replacement) {
			return;
		}

		// If focused
		blurFunc = replacement.data('checkableBlurFunction');
		if (blurFunc) {
			blurFunc();
		}

		// Tabindex
		this.tabIndex = select[0].tabIndex;

		// Remove select from replacement and restore classes
		element.detach().insertBefore(replacement).css('display', '');
		this.className = element.data('initial-classes');
		element.removeData('initial-classes');

		// Remove references
		element.removeData('replacement');

		// Delete replacement
		replacement.remove();
	}

	/**
  * Clean delete of a select replacement
  *
  * @return void
  */
	function _removeSelectReplacement() {
		var element = $(this),
		    select = element.data('replacement'),
		    closeFunc,
		    blurFunc;

		// If not replaced
		if (!select) {
			return;
		}

		// If open
		closeFunc = select.data('selectCloseFunction');
		if (closeFunc) {
			closeFunc();
		}

		// If focused
		blurFunc = select.data('selectBlurFunction');
		if (blurFunc) {
			blurFunc();
		}

		// Tabindex
		this.tabIndex = select[0].tabIndex;

		// Remove select from replacement and restore classes
		element.detach().insertBefore(select).css('display', '');
		this.className = element.data('initial-classes');
		element.removeData('initial-classes');

		// Remove references
		element.removeData('replacement');

		// Stop scrolling
		if ($.fn.customScroll) {
			select.children('.drop-down').removeCustomScroll();
		}

		// Delete select
		select.remove();
	}

	/**
  * Clean delete of a file input replacement
  *
  * @return void
  */
	function _removeInputStyling() {
		var element = $(this),
		    parent = element.parent();

		// If not replaced
		if (!parent.hasClass('file')) {
			return;
		}

		// Remove input from styling
		element.detach().insertBefore(parent);

		// Delete styling
		parent.remove();
	}

	/********************************************************/
	/*        Event delegation for template elements        */
	/********************************************************/

	/*
  * Event delegation is used to handle most of the template setup, as it does also apply to dynamically added elements
  * @see http://api.jquery.com/on/
  */

	doc.on('click', 'label', function (event) {
		var label = $(this),
		    element = $('#' + this.htmlFor),
		    replacement;

		// If no input, exit
		if (element.length === 0) {
			return;
		}

		// Replacement
		replacement = element.data('replacement');

		// IE7/8 only triggers 'change' on blur and does not handle change on 'click' for hidden elements, so we need to use a workaround
		if ($.template.ie7 || $.template.ie8) {
			// If checkbox/radio
			if (element.is(':checkbox, :radio')) {
				// If replaced
				if (replacement) {
					// Trigger event
					replacement.trigger('click');
					return;
				}

				// If checkable is included in label
				if (label.hasClass('button') && element.closest('label').is(label)) {
					// Do not handle if disabled
					if (element.closest('.disabled').length > 0 || element.is(':disabled')) {
						return;
					}

					// Check if state can be changed
					if (element.is(':checkbox') || !element.prop('checked')) {
						element.prop('checked', !element.prop('checked')).trigger('change');
					}
				}

				return;
			}
		}

		// If hidden select
		if (element.is('select')) {
			// Only process if hidden
			if (replacement && element.is(':hidden')) {
				replacement.focus();
			}
		}
	});

	// Change radio/checkboxes
	doc.on('click', 'span.switch, span.radio, span.checkbox', function (event) {
		var element = $(this),
		    replaced = element.data('replaced');

		// If not valid, exit
		if (!replaced) {
			return;
		}

		// If not valid, exit
		if (replaced.length === 0) {
			return;
		}

		// Only process if not clicking in the inner checkable
		if (event.target === replaced[0]) {
			return;
		}

		// Do not handle if disabled
		if (element.closest('.disabled').length > 0 || replaced.is(':disabled')) {
			return;
		}

		// If dragged too recently
		if (element.data('switch-dragged')) {
			return;
		}

		// Check if state can be changed
		if (replaced.is(':checkbox') || !replaced.prop('checked')) {
			replaced.prop('checked', !replaced.prop('checked')).trigger('change');
		}
	});

	// Drag switches
	doc.on('mousedown touchstart', 'span.switch', function (event) {
		// Parent switch
		var switchEl = $(this),
		    replaced = switchEl.data('replaced'),
		    reversed = switchEl.closest('.reversed-switches').length > 0,


		// Button
		button = switchEl.children('.switch-button'),


		// Is it a mini/tiny switch
		mini = switchEl.hasClass('mini'),
		    tiny = switchEl.hasClass('tiny'),


		// Size adjustments
		buttonOverflow = tiny ? 2 : 0,
		    valuesOverflow = (mini || tiny ? 7 : 4) + 2 * buttonOverflow,
		    marginIE7 = $.template.ie7 && !mini && !tiny ? 4 : 0,


		// Original button position
		initialPosition = button.position().left,


		// Inner elements
		onEl = switchEl.children('.switch-on'),
		    onSpan = onEl.children(),
		    offEl = switchEl.children('.switch-off'),
		    offSpan = offEl.children(),


		// Available space
		switchWidth = switchEl.width(),
		    buttonWidth = button.outerWidth(true),
		    availableSpace = switchWidth - buttonWidth + 2 * buttonOverflow,


		// Type of event
		touchEvent = event.type === 'touchstart',


		// Event start position
		offsetHolder = touchEvent ? event.originalEvent.touches[0] : event,
		    mouseX = offsetHolder.pageX,


		// Work vars
		ieSelectStart,
		    dragged = false,
		    value;

		// If not valid, exit
		if (replaced.length === 0) {
			return;
		}

		// Do not handle if disabled
		if (switchEl.closest('.disabled').length || replaced.is(':disabled')) {
			return;
		}

		// Stop text selection
		event.preventDefault();
		ieSelectStart = document.onselectstart;
		document.onselectstart = function () {
			return false;
		};

		// Add class to prevent animation
		switchEl.addClass('dragging');

		// Watch mouse/finger move
		function watchMouse(event) {
			var offsetHolder = touchEvent ? event.originalEvent.touches[0] : event,
			    position = Math.max(0, Math.min(availableSpace, initialPosition + (offsetHolder.pageX - mouseX)));

			// Actual value
			value = position > availableSpace / 2 ? !reversed : reversed;

			// Move inner elements
			if (reversed) {
				button.css('right', availableSpace - position - buttonOverflow + 'px');
				offEl.css('right', switchWidth - position - valuesOverflow + 'px');
				offSpan.css('margin-left', -(availableSpace - position + marginIE7) + 'px');
				onEl.css('left', buttonWidth + position - valuesOverflow + 'px');
			} else {
				button.css('left', position - buttonOverflow + 'px');
				onEl.css('right', switchWidth - position - valuesOverflow + 'px');
				onSpan.css('margin-left', -(availableSpace - position + marginIE7) + 'px');
				offEl.css('left', buttonWidth + position - valuesOverflow + 'px');
			}

			// Drag is effective
			dragged = true;
		}
		doc.on(touchEvent ? 'touchmove' : 'mousemove', watchMouse);

		// Watch for mouseup/touchend
		function endDrag() {
			doc.off(touchEvent ? 'touchmove' : 'mousemove', watchMouse);
			doc.off(touchEvent ? 'touchend' : 'mouseup', endDrag);

			// Remove class preventing animation
			switchEl.removeClass('dragging');

			// Reset positions
			if (reversed) {
				button.css('right', '');
				offEl.css('right', '');
				offSpan.css('margin-left', '');
				onEl.css('left', '');
			} else {
				button.css('left', '');
				onEl.css('right', '');
				onSpan.css('margin-left', '');
				offEl.css('left', '');
			}

			// Re-enable text selection
			document.onselectstart = ieSelectStart ? ieSelectStart : null;

			// If dragged, update value
			if (dragged) {
				// Set new value
				if (replaced.prop('checked') != value) {
					replaced.prop('checked', value).change();
				}

				// Prevent change on upcoming click event
				switchEl.data('switch-dragged', true);
				setTimeout(function () {
					switchEl.removeData('switch-dragged');
				}, 40);
			} else if (touchEvent) {
				// Click event is not trigerred for touch devices when touch events were handled
				switchEl.click();
			}
		}
		doc.on(touchEvent ? 'touchend' : 'mouseup', endDrag);
	});

	// Radios and checkboxes changes
	doc.on('change', ':radio, :checkbox', function (event) {
		var element = $(this),
		    replacement = element.data('replacement'),
		    checked = this.checked;

		// Update visual style
		if (replacement) {
			// Update style
			replacement[checked ? 'addClass' : 'removeClass']('checked');
		}
		// Button labels
		else if (element.parent().is('label.button')) {
				element.parent()[checked ? 'addClass' : 'removeClass']('active');
			}

		// If radio, refresh others without triggering 'change'
		if (this.type === 'radio') {
			$('input[name="' + this.name + '"]:radio').not(this).each(function (i) {
				var input = $(this),
				    replacement = input.data('replacement');

				// Switch
				if (replacement) {
					replacement[checked ? 'removeClass' : 'addClass']('checked');
				}
				// Button labels
				else if (input.parent().is('label.button')) {
						input.parent()[checked ? 'removeClass' : 'addClass']('active');
					}

				// Trigger special event
				input.trigger('silent-change');
			});
		}
	});

	// Switches, radios and checkboxes focus
	doc.on('focus', 'span.switch, span.radio, span.checkbox', function (event) {
		var element = $(this),
		    replaced = element.data('replaced'),
		    handleKeysEvents = false;

		// If not valid, exit
		if (!replaced) {
			return;
		}

		// If not valid, exit
		if (replaced.length === 0) {
			return;
		}

		// Do not handle if disabled
		if (element.closest('.disabled').length > 0 || replaced.is(':disabled')) {
			event.preventDefault();
			return;
		}

		// IE7-8 focus handle is different from modern browsers
		if ($.template.ie7 || $.template.ie8) {
			doc.find('.focus').not(element).blur();
		}

		// Show focus
		element.addClass('focus');

		/*
   * Keyboard events handling
   */
		handleKeysEvents = function handleKeysEvents(event) {
			if (event.keyCode == $.template.keys.space) {
				// If radio, do not allow uncheck as this may leave all radios unchecked
				if (!replaced.is(':radio') || !replaced[0].checked) {
					// Change replaced state, listener will update style
					replaced[0].checked = !replaced[0].checked;
					replaced.change();
				}
				event.preventDefault();
			}
		};

		// Blur function
		function onBlur() {
			// Remove styling
			element.removeClass('focus');

			// Clear data
			element.removeData('checkableBlurFunction');

			// Stop listening
			doc.off('keydown', handleKeysEvents);
			element.off('blur', onBlur);
		}

		// Store for external calls
		element.data('checkableBlurFunction', onBlur);

		// Start listening
		element.on('blur', onBlur);
		doc.on('keydown', handleKeysEvents);
	});

	// Textareas focus
	doc.on('focus', 'textarea', function (event) {
		var element = $(this);

		// IE7-8 focus handle is different from modern browsers
		if ($.template.ie7 || $.template.ie8) {
			doc.find('.focus').not(element).blur();
		}

		// Styling
		element.addClass('focus');
	}).on('blur', 'textarea', function () {
		$(this).removeClass('focus');
	});

	// Inputs focus
	doc.on('focus', 'input', function (event) {
		var input = $(this),
		    replacement,
		    wrapper,
		    last;

		// Do not handle if disabled
		if (input.closest('.disabled').length > 0 || input.is(':disabled')) {
			event.preventDefault();
			return;
		}

		// For radios and focus, pass focus to replacement element
		if (this.type === 'radio' || this.type === 'checkbox') {
			replacement = input.data('replacement');

			// Update visual style
			if (replacement) {
				replacement.addClass('focus');
			}

			// Done, even if no replacement
			return;
		}

		// IE7-8 focus handle is different from modern browsers
		if ($.template.ie7 || $.template.ie8) {
			doc.find('.focus').not(input).blur();
		}

		// Placeholder polyfill
		if (!Modernizr.input.placeholder && input.attr('placeholder') && input.val() === input.attr('placeholder')) {
			input.removeClass('placeholder').val('');
		}

		// Look for wrapped inputs
		wrapper = input.closest('.input, .inputs');

		// If wrapped
		if (wrapper.length > 0) {
			// Styling
			wrapper.addClass('focus');

			// For number inputs
			if (wrapper.hasClass('number')) {
				// Watch keydown
				input.on('keydown.number', function (event) {
					// If up and down
					if (event.which === 38 || event.which === 40) {
						input.incrementNumber(event.which === 38, event.shiftKey);
					}
				});

				// Watch keyup
				input.on('keyup.number', function (event) {
					var value = input.val();

					// Only trigger change if the content has changed
					if (value === last) {
						return;
					}

					// Update slider
					input.trigger('change');

					// Store for next check
					last = value;
				});
			}
		} else {
			// Styling
			input.addClass('focus');
		}
	}).on('blur', 'input', function () {
		var input = $(this),
		    replacement,
		    wrapper;

		// Not for radios and checkboxes
		if (this.type === 'radio' || this.type === 'checkbox') {
			replacement = input.data('replacement');

			// Update visual style
			if (replacement) {
				replacement.removeClass('focus');
			}

			// Done, even if no replacement
			return;
		}

		// Placeholder polyfill
		if (!Modernizr.input.placeholder && input.attr('placeholder') && input.val() === '' && input.attr('type') != 'password') {
			input.addClass('placeholder').val(input.attr('placeholder'));
		}

		// Remove styling
		wrapper = input.closest('.focus');
		wrapper.removeClass('focus');

		// For number inputs
		if (wrapper.hasClass('number')) {
			// Stop watching keyboard events
			input.off('keydown.number').off('keyup.number');

			// Validate value
			input.setNumber(input.val());
		}
	});

	// Placehoder support
	if (!Modernizr.input.placeholder) {
		// Empty placehoder on form submit
		doc.on('submit', 'form', function (event) {
			$(this).find('input.placeholder').each(function () {
				var input = $(this);

				if (input.attr('placeholder') && input.val() === input.attr('placeholder')) {
					input.val('');
				}
			});
		});
	}

	// File inputs
	doc.on('change', '.file > input[type="file"]', function (event) {
		var input = $(this),
		    files = [],
		    text,
		    i;

		// Update styling text
		if (this.multiple && this.files) {
			for (i = 0; i < this.files.length; i++) {
				files.push(this.files[i].name.split(/(\/|\\)/).pop());
			}
			text = files.join(', ');
		} else {
			text = input.val().split(/(\/|\\)/).pop();
		}

		// Set text
		input.siblings('.file-text').text(text);
	});

	// Value inputs
	doc.on('click', '.number-up, .number-down', function (event) {
		var button = $(this),
		    wrapper = button.parent(),
		    input = wrapper.children('input:first'),
		    value;

		// Check if valid
		if (input.length === 0) {
			return;
		}

		// Increment
		input.incrementNumber(button.hasClass('number-up'), event.shiftKey).focus().trigger('change');
	});

	// Scroll on value inputs
	doc.on('mousewheel', '.number', function (event, delta, deltaX, deltaY) {
		// If the element scrolled
		$(this).incrementNumber(delta > 0, event.shiftKey).focus().trigger('change');

		// Prevent parents from scrolling
		event.preventDefault();
	});

	// Handle select focus
	if (!$.template.touchOs) {
		doc.on('focus', 'select', function () {
			var select = $(this).data('replacement');
			if (select) {
				select.focus();
			}
		});
	}
	doc.on('change', 'select', function () {
		var replaced = $(this),
		    selected = replaced.find(':selected'),
		    select = replaced.data('replacement'),
		    values = [],
		    displayAsMultiple,
		    text,
		    settings;

		// If valid
		if (select) {
			// Settings
			settings = select.data('select-settings');

			// Mode
			displayAsMultiple = select.hasClass('selectMultiple');

			// If nothing selected
			if (selected.length === 0) {
				// Update displayed value
				if (!displayAsMultiple) {
					// Get empty placeholder
					text = replaced.data('no-value-text') || settings.noValueText;

					// Must not be empty to preserve vertical-align
					if (!text || text.length === 0) {
						text = '&nbsp;';
					}

					// Set text
					select.children('.select-value').addClass('alt').html(text);
				}

				// If open, deselect all
				if (select.hasClass('open') || displayAsMultiple) {
					select.children('.drop-down').children('a, span').removeClass('selected');
				}
			} else {
				if (!displayAsMultiple) {
					// Gather selected values texts
					selected.each(function (i) {
						values.push($(this).text());
					});

					// Update displayed value
					if (this.multiple) {
						switch (values.length) {
							case 1:
								_updateSelectValueText(select, values, replaced.data('single-value-text'), settings.singleValueText);
								break;

							case this.options.length:
								_updateSelectValueText(select, values, replaced.data('all-values-text'), settings.allValuesText);
								break;

							default:
								_updateSelectValueText(select, values, replaced.data('multiple-values-text'), settings.multipleValuesText);
								break;
						}
					} else {
						select.children('.select-value').text(values.length > 0 ? values.join(', ') : '&nbsp;');
					}
				}

				// Update selected element
				select.children('.drop-down').children('a, span').each(function () {
					var option = $(this),
					    selectValue = option.data('select-value');
					if (selectValue) {
						option[selectValue.selected ? 'addClass' : 'removeClass']('selected');
					}
				});
			}
		}
	});

	// Handle select focus
	doc.on('focus', 'span.select, span.selectMultiple', function (event) {
		// Only work if the element is the event's target
		if (event.target !== this) {
			return;
		}

		var select = $(this),
		    settings = select.data('select-settings'),
		    replaced = select.data('replaced'),
		    list = select.children('.drop-down'),
		    handleKeysEvents,
		    search = '',
		    blurTimeout,
		    searchTimeout;

		// Do not handle if disabled
		if (select.closest('.disabled').length > 0 || replaced && replaced.is(':disabled')) {
			event.preventDefault();
			return;
		}

		// Handle really close blur/focus events
		blurTimeout = select.data('selectBlurTimeout');
		if (blurTimeout) {
			// The select is still focused but about to blur, prevent and remain focused
			clearTimeout(blurTimeout);
			select.removeData('selectBlurTimeout');
			return;
		}

		// Do not handle if already focused
		if (select.hasClass('focus')) {
			return;
		}

		// Visual style
		select.addClass('focus');

		/**
   * Keyboard events handling
   */

		// Affect original element, listeners will update the replacement
		handleKeysEvents = function handleKeysEvents(event) {
			var keys = $.template.keys,
			    closeFunc,
			    selectedIndex,
			    mode,
			    focus,
			    next,
			    replacedOption,
			    character,
			    searchRegex;

			// If using easy multiple selection, use focus instead of selection
			mode = select.hasClass('easy-multiple-selection') ? 'focus' : 'selected';

			// Key handling
			switch (event.keyCode) {
				case keys.tab:
					// If open, close before tabultation triggers to preserve natural tabultation order
					closeFunc = select.data('selectCloseFunction');
					if (closeFunc) {
						closeFunc();
					}
					break;

				case keys.up:
					// If open or multiple, work on displayed options
					if (select.hasClass('open') || select.hasClass('selectMultiple')) {
						// Focused element
						focus = list.children('.' + mode + ':first');
						if (focus.length === 0) {
							next = list.children('a:last, span:last');
						} else {
							next = focus.prevAll('a:first, span:first');
						}

						// Focus previous option
						if (next.length > 0) {
							focus.removeClass(mode);
							next.addClass(mode).scrollToReveal();

							// If selection mode, update replaced and trigger change
							if (mode === 'selected' && replaced) {
								replacedOption = next.data('select-value');
								if (replacedOption) {
									// If multiple selection, clear all before
									if (replaced[0].multiple) {
										replaced.find('option:selected').prop('selected', false);
									}

									replacedOption.selected = true;
									replaced.trigger('change');
								}
							}
						}

						event.preventDefault();
					}
					// If replacement
					else if (replaced) {
							// Update original, listeners will update the replacement
							selectedIndex = _getSelectedIndex(replaced);
							if (selectedIndex !== false && selectedIndex > 0) {
								replaced[0].selectedIndex = selectedIndex - 1;
							}
							replaced.change();
							event.preventDefault();
						}
					break;

				case keys.down:
					// If not open yet, check if we have to
					if (select.hasClass('select') && !select.hasClass('open') && settings.openOnKeyDown) {
						_openSelect(select);
						event.preventDefault();
					} else {
						// If open or multiple, work on displayed options
						if (select.hasClass('open') || select.hasClass('selectMultiple')) {
							// Focused element
							focus = list.children('.' + mode + ':last');
							if (focus.length === 0) {
								next = list.children('a:first, span:first');
							} else {
								next = focus.nextAll('a:first, span:first');
							}

							// Focus next option
							if (next.length > 0) {
								focus.removeClass(mode);
								next.addClass(mode).scrollToReveal();

								// If selection mode, update replaced and trigger change
								if (mode === 'selected' && replaced) {
									replacedOption = next.data('select-value');
									if (replacedOption) {
										// Set value
										replaced.val(replacedOption.value).trigger('change');
									}
								}
							}

							event.preventDefault();
						}
						// If replacement
						else if (replaced) {
								// Update original, listeners will update the replacement
								selectedIndex = _getSelectedIndex(replaced);
								if (selectedIndex !== false && selectedIndex < replaced[0].options.length - 1) {
									replaced[0].selectedIndex = selectedIndex + 1;
								}
								replaced.change();
								event.preventDefault();
							}
					}
					break;

				case keys.enter:
				case keys.space:
					// If focus mode on, simulate click
					if (mode === 'focus' && (select.hasClass('selectMultiple') || select.hasClass('open'))) {
						// Focused element
						focus = list.children('.' + mode);
						if (focus.length === 1) {
							event.preventDefault();
							focus.click();
						}
					}
					// Else, just close the select if open
					else if (select.hasClass('open')) {
							closeFunc = select.data('selectCloseFunction');
							if (closeFunc) {
								closeFunc();
								event.preventDefault();
							}
						}
					break;

				default:
					// Get pressed key character
					character = String.fromCharCode(event.keyCode);

					// If regular character
					if (character && character.length === 1) {
						// If a search timeout is in, stop it
						if (searchTimeout) {
							clearTimeout(searchTimeout);
						}

						// Add to search
						search += character.toLowerCase();
						searchRegex = new RegExp('^' + search, 'g');

						// Start timeout to clear search string when no more key are pressed
						searchTimeout = setTimeout(function () {
							search = '';
						}, 1500);

						// Mode
						if (select.hasClass('open') || select.hasClass('selectMultiple')) {
							// Loop through values to find a match
							list.children('a, span').each(function (i) {
								var option = $(this);

								// If matches
								if ($.trim(option.text().toLowerCase()).match(searchRegex)) {
									// Focused element
									focus = list.children('.' + mode + ':last');

									// Focus option
									focus.removeClass(mode);
									option.addClass(mode).scrollToReveal();

									// If selection mode, update replaced and trigger change
									if (mode === 'selected' && replaced) {
										replacedOption = option.data('select-value');
										if (replacedOption) {
											// Set value
											replaced.val(replacedOption.value).trigger('change');
										}
									}

									// Prevent default key event
									event.preventDefault();

									// Stop search
									return false;
								}
							});
						}
						// Closed mode only works for replacements
						else if (replaced) {
								// Loop through values to find a match
								replaced.find('option').each(function (i) {
									// If matches
									if ($.trim($(this).text().toLowerCase()).match(searchRegex)) {
										// Set value
										replaced.val(this.value).trigger('change');

										// Prevent default key event
										event.preventDefault();

										// Stop search
										return false;
									}
								});
							}
					}
					break;
			}
		};

		// Blur function
		function onBlur(event) {
			var closeFunc;

			// Handle really close blur/focus events
			blurTimeout = select.data('selectBlurTimeout');
			if (!blurTimeout) {
				// Wait, are you sure you want me to blur? Let's just wait a little...
				select.data('selectBlurTimeout', setTimeout(function () {
					onBlur.call(this, event);
				}, 40));
				return;
			} else {
				// The blur timeout has ended without getting back focus, so let's blur!
				select.removeData('selectBlurTimeout');
			}

			// Clear data
			select.removeData('selectBlurFunction');

			// Remove styling
			if (select.children('.select-search').children('input:focus').length === 0) {
				select.removeClass('focus');
			}
			list.children('.focus').removeClass('focus');

			// Stop listening
			doc.off('keydown', handleKeysEvents);
			select.off('blur', onBlur);
		}

		// Store for external calls
		select.data('selectBlurFunction', onBlur);

		// Start listening
		select.on('blur', onBlur);
		doc.on('keydown', handleKeysEvents);
	});

	// Opening when on touch device
	if ($.template.touchOs) {
		// Open on tap
		doc.on('touchend', '.select', function (event) {
			_openSelect($(this), false, event);
		});
	} else {
		// Selects opening arrow
		doc.on('click', '.select-arrow, span.select-value', function (event) {
			var select = $(this).parent();

			// Filter here rather than in the delegated event, a little bit faster overall
			if (!select.hasClass('auto-open')) {
				_openSelect($(this).parent(), false, event);
			}
		});

		// Auto-opening selects
		doc.on('mouseenter', '.select.auto-open', function (event) {
			_openSelect($(this), true, event);
		});
	}

	/*
  * Form validation hooks:
  * The replaced selects need to be un-hidden to be validated, then hidden back
  */
	doc.on('jqv.form.validating', 'form', function (event) {
		var form = $(this),
		    hidden = form.find('span.select > select, span.selectMultiple > select').filter(':hidden').show(),


		// Return to normal state
		validateEnd = function validateEnd() {
			hidden.hide();
			form.off('jqv.form.result', validateEnd);
		};

		// Listen for end of validation
		form.on('jqv.form.result', validateEnd);
	});
})(jQuery, window, document);

/***/ }),

/***/ 50:
/***/ (function(module, exports) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 *
 * '||''|.                            '||
 *  ||   ||    ....  .... ...   ....   ||    ...   ... ...  ... ..
 *  ||    || .|...||  '|.  |  .|...||  ||  .|  '|.  ||'  ||  ||' ''
 *  ||    || ||        '|.|   ||       ||  ||   ||  ||    |  ||
 * .||...|'   '|...'    '|     '|...' .||.  '|..|'  ||...'  .||.
 *                                                  ||
 * --------------- By Display:inline ------------- '''' -----------
 *
 * Custom scroll plugin
 *
 * Structural good practices from the article from Addy Osmani 'Essential jQuery plugin patterns'
 * @url http://coding.smashingmagazine.com/2011/10/11/essential-jquery-plugin-patterns/
 */

/*
 * The semi-colon before the function invocation is a safety
 * net against concatenated scripts and/or other plugins
 * that are not closed properly.
 */
;(function ($, document) {
	/*
  * document is passed through as local variable rather than as global, because this (slightly)
  * quickens the resolution process and can be more efficiently minified.
  */

	// Objects cache
	var doc = $(document),


	// Check if device has a touch screen
	touch = $('html').hasClass('touch');

	/**
  * Enable custom scroll bar
  */
	$.fn.customScroll = function (options) {
		var globalSettings = $.extend({}, $.fn.customScroll.defaults, options);

		// For elements already scrolling, refresh
		this.filter('.custom-scroll').refreshCustomScroll();

		// Initial setup for others
		this.not('.custom-scroll').addClass('custom-scroll').each(function (i) {
			var element = $(this),


			// CSS position
			cssPos = element.css('position'),


			// Type of node for scrollbars
			scrollbarNodeType = element.is('ul, ol') ? 'li' : 'div',


			// Local settings, if inline options are found
			settings = $.extend({}, globalSettings, element.data('scroll-options')),


			// Work vars init
			scrollingH = element[0].scrollWidth > element.innerWidth(),
			    scrollingV = element[0].scrollHeight > element.innerHeight(),
			    scrollH = element.scrollLeft(),
			    scrollV = element.scrollTop(),


			// References
			_hscrollbar,
			    _hscroller,
			    _vscrollbar,
			    _vscroller,


			// Create and refresh functions
			createH = false,
			    createV = false,
			    refreshH = false,
			    refreshV = false,


			// Scrollbars visibility
			hiddenH = false,
			    hiddenV = false,


			// Check if scrollbar position was already set once
			init = false;

			// The plugin needs position relative, absolute or fixed
			if (cssPos !== 'relative' && cssPos !== 'absolute' && cssPos !== 'fixed') {
				element.css('position', 'relative');
			}

			// Format
			if (_typeof(settings.padding) !== 'object') {
				settings.padding = {
					top: settings.padding,
					right: settings.padding,
					bottom: settings.padding,
					left: settings.padding
				};
			}
			settings.padding = $.extend({ top: 0, right: 0, bottom: 0, left: 0 }, settings.padding);

			/*
    * Horizontal scrolling
    */
			if (settings.horizontal) {
				/**
     * Create horizontal scrollbar
     */
				createH = function createH() {
					// Create elements
					_hscrollbar = $('<' + scrollbarNodeType + ' class="custom-hscrollbar"></' + scrollbarNodeType + '>').appendTo(element);
					_hscroller = $('<div></div>').appendTo(_hscrollbar);

					// Prevent click events from scrollbar
					_hscrollbar.click(function (event) {
						event.stopPropagation();
					});

					// Prevent text selection for IE7
					_hscroller.on('selectstart', _preventTextSelectionIE);

					// Scroller handling
					_hscroller.on('mousedown', function (event) {
						// Get initial values
						var mouseX = event.pageX,
						    hscrollerLeft = _hscroller.parseCSSValue('left');

						// Stop text selection
						event.preventDefault();

						// Watch mouse move
						function watchMouse(event) {
							var availableSpace = _hscrollbar.width() - _hscroller.innerWidth(),
							    hscrollerPos = Math.max(0, Math.min(availableSpace, hscrollerLeft + (event.pageX - mouseX)));

							// Scroller new position
							_hscrollbar[0].style.display = 'none';
							scrollH = availableSpace > 0 ? Math.round(hscrollerPos / availableSpace * (element[0].scrollWidth - element.innerWidth())) : 0;
							_hscrollbar[0].style.display = 'block';

							// Move
							if (settings.animate && init) {
								// Scroll
								element.stop(true).animate({ scrollLeft: scrollH }, {
									step: function step() {
										$(this).refreshInnerTrackedElements();
									}
								});
							} else {
								// Scroll
								element.stop(true).scrollLeft(scrollH).refreshInnerTrackedElements();
							}

							// Update scrollbars
							if (refreshH) refreshH();
							if (refreshV) refreshV();
						};
						doc.on('mousemove', watchMouse);

						// Watch for mouseup
						function endDrag() {
							doc.off('mousemove', watchMouse);
							doc.off('mouseup', endDrag);
						};
						doc.on('mouseup', endDrag);
					});
				};

				// Init
				createH();

				/**
     * Refresh horizontal scrollbar and scroll positions/sizes
     */
				refreshH = function refreshH() {
					// If disabled
					if (hiddenH) {
						return;
					}

					// If scrollbar was removed by a random script
					if (!_hscrollbar[0].parentNode) {
						createH();
					}

					// Element height
					var elementWidth = element.width(),
					    elementInnerWidth = element.innerWidth(),


					// Margin if vertical scrollbar is enabled too
					vMargin = settings.vertical && scrollingV && !hiddenV ? settings.cornerWidth : 0,


					// Scroolbar width
					width = (settings.usePadding ? elementWidth : elementInnerWidth) - settings.padding.top - settings.padding.bottom - vMargin,


					// Minimum scroller width
					minWidth = width > settings.minScrollerSize * 1.5 ? settings.minScrollerSize : Math.round(width / 1.5),


					// Available space for scroller
					available = width - minWidth,


					// Scroller size
					size = Math.round(available * (elementWidth / element[0].scrollWidth)) + minWidth,


					// Scroller position
					position = Math.round((width - size) * (scrollH / (element[0].scrollWidth - elementInnerWidth)));

					// Reveal scrollbar (hidden in refresh()
					_hscrollbar.show();

					// Set scrollbar style
					_hscrollbar.stop(true)[settings.animate && init ? 'animate' : 'css']({

						// Position
						top: element.innerHeight() - (settings.usePadding ? element.parseCSSValue('padding-bottom') + settings.padding.top : settings.padding.bottom) - settings.width + scrollV + 'px',
						left: (settings.usePadding ? element.parseCSSValue('padding-left') + settings.padding.right : settings.padding.left) + scrollH + 'px',

						// Size
						width: width + 'px',
						height: settings.width + 'px',

						// Opacity
						opacity: element.data('scroll-focus') || !settings.showOnHover ? 1 : 0

					});

					// Set scroller style
					_hscroller.stop(true)[settings.animate && init ? 'animate' : 'css']({

						// Position
						left: position + 'px',

						// Size
						width: Math.round(size) + 'px'

					});
				};
			}

			/*
    * Vertical scrolling
    */
			if (settings.vertical) {
				/**
     * Create horizontal scrollbar
     */
				createV = function createV() {
					// Create elements
					_vscrollbar = $('<' + scrollbarNodeType + ' class="custom-vscrollbar"></' + scrollbarNodeType + '>').appendTo(element);
					_vscroller = $('<div></div>').appendTo(_vscrollbar);

					// Prevent click events from scrollbar
					_vscrollbar.click(function (event) {
						event.stopPropagation();
					});

					// Prevent text selection for IE7
					_vscroller.on('selectstart', _preventTextSelectionIE);

					// Scroller handling
					_vscroller.on('mousedown', function (event) {
						// Get initial values
						var mouseY = event.pageY,
						    vscrollerTop = _vscroller.parseCSSValue('top');

						// Prevent text selection
						event.preventDefault();

						// Watch mouse move
						function watchMouse(event) {
							// Scroller new position
							var availableSpace = _vscrollbar.height() - _vscroller.innerHeight(),
							    vscrollerPos = Math.max(0, Math.min(availableSpace, vscrollerTop + (event.pageY - mouseY)));

							// Scroller new position
							_vscrollbar[0].style.display = 'none';
							scrollV = availableSpace > 0 ? Math.round(vscrollerPos / availableSpace * (element[0].scrollHeight - element.innerHeight())) : 0;
							_vscrollbar[0].style.display = 'block';

							// Move
							if (settings.animate && init) {
								// Scroll
								element.stop(true).animate({ scrollTop: scrollV }, {
									step: function step() {
										$(this).refreshInnerTrackedElements();
									}
								});
							} else {
								// Scroll
								element.stop(true).scrollTop(scrollV).refreshInnerTrackedElements();
							}

							// Update scrollbars
							if (refreshH) refreshH();
							if (refreshV) refreshV();
						};
						doc.on('mousemove', watchMouse);

						// Watch for mouseup
						function endDrag(event) {
							event.preventDefault();

							doc.off('mousemove', watchMouse);
							doc.off('mouseup', endDrag);
						};
						doc.on('mouseup', endDrag);
					});
				};

				// Init
				createV();

				/**
     * Refresh vertical scrollbar and scroll positions/sizes
     */
				refreshV = function refreshV() {
					// If disabled
					if (hiddenV) {
						return;
					}

					// If scrollbar was removed by a random script
					if (!_vscrollbar[0].parentNode) {
						createV();
					}

					// Element height
					var elementHeight = element.height(),
					    elementInnerHeight = element.innerHeight(),


					// Margin if horizontal scrollbar is enabled too
					hMargin = settings.horizontal && scrollingH && !hiddenH ? settings.cornerWidth : 0,


					// Scroolbar height
					height = (settings.usePadding ? elementHeight : elementInnerHeight) - settings.padding.top - settings.padding.bottom - hMargin,


					// Minimum scroller height
					minHeight = height > settings.minScrollerSize * 1.5 ? settings.minScrollerSize : Math.round(height / 1.5),


					// Available space for scroller
					available = height - minHeight,


					// Scroller size
					size = available * (elementHeight / element[0].scrollHeight) + minHeight,


					// Scroller position
					position = Math.round((height - size) * (scrollV / (element[0].scrollHeight - elementInnerHeight)));

					// Reveal scrollbar (hidden in refresh()
					_vscrollbar.show();

					// Set scrollbar style
					_vscrollbar.stop(true)[settings.animate && init ? 'animate' : 'css']({

						// Position
						top: (settings.usePadding ? element.parseCSSValue('padding-top') + settings.padding.top : settings.padding.top) + scrollV + 'px',
						left: element.innerWidth() - (settings.usePadding ? element.parseCSSValue('padding-right') + settings.padding.right : settings.padding.right) - settings.width + scrollH + 'px',

						// Size
						height: height + 'px',
						width: settings.width + 'px',

						// Opacity
						opacity: element.data('scroll-focus') || !settings.showOnHover ? 1 : 0

					});

					// Set scroller style
					_vscroller.stop(true)[settings.animate && init ? 'animate' : 'css']({

						// Position
						top: position + 'px',

						// Size
						height: Math.round(size) + 'px'

					});
				};
			}

			/**
    * Move function
    * @param int deltaX move on the horizontal axis
    * @param int deltaY move on the vertical axis
    * @param boolean doNotAnimate true to skip animation
    * @return object an object with two keys reporting effective movement { x:0, y:0 }
    */
			function move(deltaX, deltaY, doNotAnimate) {
				// Store initial values
				var initScrollH = scrollH,
				    initScrollV = scrollV;

				// New scroll values
				scrollH = Math.max(0, Math.min(scrollH + deltaX, element[0].scrollWidth - element.innerWidth()));
				scrollV = Math.max(0, Math.min(scrollV - deltaY, element[0].scrollHeight - element.innerHeight()));

				// Move
				if (settings.animate && !doNotAnimate && init) {
					// Scroll
					element.stop(true).animate({
						scrollLeft: scrollH,
						scrollTop: scrollV
					}, {
						step: function step() {
							element.refreshInnerTrackedElements();
						}
					});
				} else {
					// Scroll
					element.scrollLeft(scrollH).scrollTop(scrollV).refreshInnerTrackedElements();
				}

				// Update scrollbars
				if (refreshH && deltaX != 0) {
					refreshH();
				}
				if (refreshV && deltaY != 0) {
					refreshV();
				}

				// Send report
				return {
					x: scrollH - initScrollH,
					y: scrollV - initScrollV
				};
			};

			/**
    * Handle mouse wheel
    * @param int deltaX scroll increment on the horizontal axis
    * @param int deltaY scroll increment on the vertical axis
    * @param boolean doNotAnimate true to skip animation
    * @return object an object with two keys reporting effective movement { x:0, y:0 }
    */
			// Handle mouse wheel
			function mousewheel(deltaX, deltaY, doNotAnimate) {
				/*
     * Some mouse wheels send really small custom scroll deltas when using a custom driver,
     * for instance 0.05 instead of 1, so we use a minimum value here to prevent these mouses
     * to scroll too slow
     */
				if (deltaX != 0) {
					deltaX = deltaX > 0 ? Math.max(deltaX, settings.minWheelScroll) : Math.min(deltaX, -settings.minWheelScroll);
				}
				if (deltaY != 0) {
					deltaY = deltaY > 0 ? Math.max(deltaY, settings.minWheelScroll) : Math.min(deltaY, -settings.minWheelScroll);
				}

				// Move
				return move(deltaX * settings.speed, deltaY * settings.speed, doNotAnimate);
			};

			// Global refresh function
			function refresh() {
				// Hide scrollbars to prevent erroneous values
				if (refreshH) {
					_hscrollbar.hide();
				}
				if (refreshV) {
					_vscrollbar.hide();
				}

				// Scrolling status
				scrollingH = element[0].scrollWidth > element.innerWidth();
				scrollingV = element[0].scrollHeight > element.innerHeight();

				// Update positions
				scrollH = element.scrollLeft();
				scrollV = element.scrollTop();

				// Horizontal scroll status
				if (refreshH) {
					hiddenH = !scrollingH && settings.autoHide;
					refreshH();
				}

				// Vertical scroll status
				if (refreshV) {
					hiddenV = !scrollingV && settings.autoHide;
					refreshV();
				}
			};

			// Store for further calls
			element.data('custom-scroll', {

				// Configuration
				settings: settings,

				// Objects
				hscrollbar: function hscrollbar() {
					return _hscrollbar;
				},
				hscroller: function hscroller() {
					return _hscroller;
				},
				vscrollbar: function vscrollbar() {
					return _vscrollbar;
				},
				vscroller: function vscroller() {
					return _vscroller;
				},

				// Functions
				refresh: refresh,
				refreshH: refreshV,
				refreshV: refreshV,
				move: move,
				mousewheel: mousewheel

			});

			// First call
			refresh();

			// Fade effect
			if (settings.showOnHover) {
				// Initial hiding
				if (_hscrollbar) _hscrollbar.css({ opacity: 0 });
				if (_vscrollbar) _vscrollbar.css({ opacity: 0 });

				// Watch
				if (touch) {
					element.on('touchstart', _handleScrolledMouseEnter).on('touchend', _handleScrolledMouseLeave);
				} else {
					element.on('mouseenter', _handleScrolledMouseEnter).on('mouseleave', _handleScrolledMouseLeave);
				}
			}

			// Mark as inited
			init = true;
		}).on('mousewheel', _handleMouseWheel).on('scroll sizechange scrollsizechange', _handleScroll).on('touchstart', _handleTouchScroll);

		return this;
	};

	/**
  * Remove custom scroll
  */
	$.fn.removeCustomScroll = function () {
		this.filter('.custom-scroll').off('mousewheel', _handleMouseWheel).off('scroll sizechange scrollsizechange', _handleScroll).off('touchstart', _handleTouchScroll).off('touchstart', _handleScrolledMouseEnter).off('touchend', _handleScrolledMouseLeave).off('mouseenter', _handleScrolledMouseEnter).off('mouseleave', _handleScrolledMouseLeave).removeData('scroll-options').removeData('touch-scrolling').removeClass('custom-scroll').children('.custom-hscrollbar, .custom-vscrollbar').remove().scrollLeft(0).scrollTop(0);

		return this;
	};

	/**
  * Internal function: used to prevent text selection under IE (event distint from 'mousedown')
  *
  * @return void
  */
	function _preventTextSelectionIE(event) {
		event.preventDefault();
	}

	/**
  * Internal function: handle fade in effect on mouse hover
  *
  * @return void
  */
	function _handleScrolledMouseEnter() {
		var element = $(this),
		    object = element.data('custom-scroll');

		// If valid
		if (object) {
			element.data('scroll-focus', true);
			if (object.hscrollbar()) object.hscrollbar().animate({ opacity: 1 });
			if (object.vscrollbar()) object.vscrollbar().animate({ opacity: 1 });
		}
	};

	/**
  * Internal function: handle fade out effect on mouse leave
  *
  * @return void
  */
	function _handleScrolledMouseLeave() {
		var element = $(this),
		    object = element.data('custom-scroll');

		// If valid
		if (object) {
			element.removeData('scroll-focus');
			if (object.hscrollbar()) object.hscrollbar().animate({ opacity: 0 });
			if (object.vscrollbar()) object.vscrollbar().animate({ opacity: 0 });
		}
	};

	/**
  * Internal function: handle mousewheel event
  *
  * @param object event the event object
  * @param float delta the vertical delta (historical)
  * @param float deltaX the vertical delta
  * @param float deltaY the horizontal delta
  * @return void
  */
	function _handleMouseWheel(event, delta, deltaX, deltaY) {
		if (object = $(this).data('custom-scroll')) {
			// Send scroll
			var movement = object.mousewheel(deltaX, deltaY);

			// If the element scrolled
			if (movement.x != 0 || movement.y != 0 || !object.settings.continuousWheelScroll) {
				// Prevent parents from scrolling
				event.preventDefault();
			}
		}
	};

	/**
  * Internal function: handle scroll event
  */
	function _handleScroll(event) {
		$(this).refreshCustomScroll();
	};

	/**
  * Internal function: handle touch scroll
  */
	function _handleTouchScroll(event) {
		// Init
		var element = $(this),
		    object = element.data('custom-scroll'),
		    posX = event.originalEvent.touches[0].pageX,
		    /* jQuery event normalization does not preserve touch events properties */
		posY = event.originalEvent.touches[0].pageY,
		    moveFunc,
		    _endFunc,
		    movement;

		// If not already touching
		if (object && !element.data('touch-scrolling')) {
			// Handle moves
			moveFunc = function moveFunc(event) {
				// Mark as touching
				element.data('touch-scrolling', true);

				// Movement
				var newX = event.originalEvent.touches[0].pageX,
				    newY = event.originalEvent.touches[0].pageY;

				// Scroll
				movement = object.move(posX - newX, newY - posY, true);

				// If the element scrolled
				if (movement.x !== 0 || movement.y !== 0 || !object.settings.continuousTouchScroll) {
					// Prevent parents from scrolling
					event.preventDefault();
				}

				// Store for next move
				posX = newX;
				posY = newY;
			};

			// Handle end of touch event
			_endFunc = function endFunc(event) {
				// Stop watching
				element.off('touchmove', moveFunc);
				element.off('touchend touchcancel', _endFunc);

				// Clear data
				element.removeData('touch-scrolling');
			};

			// Start watching
			element.on('touchmove', moveFunc);
			element.on('touchend touchcancel', _endFunc);
		}
	}

	/**
  * Tell whether the element has custom scrolling
  * @return boolean true if scrolling, else false
  */
	$.fn.hasCustomScroll = function () {
		return this.data('custom-scroll') ? true : false;
	};

	/**
  * Refreshes custom scroll bar position
  */
	$.fn.refreshCustomScroll = function () {
		this.each(function (i) {
			var object = $(this).data('custom-scroll');
			if (object) {
				object.refresh();
			}
		});

		return this;
	};

	/**
  * Refreshes custom scroll bar position
  * @param int deltaX the move on the X axis
  * @param int deltaY the move on the Y axis
  * @param boolean doNotAnimate true to skip animation
  */
	$.fn.moveCustomScroll = function (deltaX, deltaY, doNotAnimate) {
		this.each(function (i) {
			var object = $(this).data('custom-scroll');
			if (object) {
				object.move(deltaX, deltaY, doNotAnimate);
			}
		});

		return this;
	};

	/**
  * Scroll all custom-scroll parent if required to reveal the element
  */
	$.fn.scrollToReveal = function () {
		this.each(function (i) {
			var element = $(this),
			    scrollParents = element.parents('.custom-scroll');

			// Check for each scroll parent
			scrollParents.each(function (i) {
				var scrollParent = $(this),
				    scrollOffset,
				    offset,
				    parent,
				    object,
				    width,
				    height,
				    viewWidth,
				    viewHeight,
				    paddings,
				    scrollX = 0,
				    scrollY = 0;

				// Scroll object
				object = scrollParent.data('custom-scroll');
				if (!object) {
					return;
				}

				// DOM element
				parent = scrollParent[0];

				// Element position
				offset = element.offset();
				scrollOffset = scrollParent.offset();
				offset.top -= scrollOffset.top + scrollParent.parseCSSValue('border-top-width');
				offset.left -= scrollOffset.left + scrollParent.parseCSSValue('border-left-width');

				// Size
				width = element.outerWidth();
				height = element.outerHeight();

				// Paddings
				paddings = {
					top: object.settings.usePadding ? scrollParent.parseCSSValue('padding-top') : 0,
					right: object.settings.usePadding ? scrollParent.parseCSSValue('padding-right') : 0,
					bottom: object.settings.usePadding ? scrollParent.parseCSSValue('padding-bottom') : 0,
					left: object.settings.usePadding ? scrollParent.parseCSSValue('padding-left') : 0
				};

				// Visible range
				viewWidth = scrollParent.innerWidth();
				viewHeight = scrollParent.innerHeight();

				// Horizontal scroll
				if (offset.left < paddings.left) {
					scrollX = paddings.left - offset.left;
				} else if (offset.left + width > viewWidth - paddings.right) {
					scrollX = viewWidth - paddings.right - offset.left - width;
				}

				// Vertical scroll
				if (offset.top < paddings.top) {
					scrollY = paddings.top - offset.top;
				} else if (offset.top + height > viewHeight - paddings.bottom) {
					scrollY = viewHeight - paddings.bottom - offset.top - height;
				}

				// If any scroll is required
				if (scrollX !== 0 || scrollY !== 0) {
					object.move(scrollX, scrollY);
				}
			});
		});

		return this;
	};

	/**
  * Custom scroll function defaults
  * @var object
  */
	$.fn.customScroll.defaults = {
		/**
   * Horizontal scrolling
   * @var boolean
   */
		horizontal: false,

		/**
   * Vertical scrolling
   * @var boolean
   */
		vertical: true,

		/**
   * Whether to use or ignore element's padding in the scrollbar position
   * @var boolean
   */
		usePadding: false,

		/**
   * Padding around scrollbar (can be a single value if regular, or an object
   * with 'top', 'right', 'bottom' and 'left' - unset values will be set to 0)
   * @var int|object
   */
		padding: 6,

		/**
   * Scrollbar's width in pixels
   * @var int
   */
		width: 8,

		/**
   * Size of empty space in the corner of both scrollbars when they are enabled
   * @var int
   */
		cornerWidth: 10,

		/**
   * Scroller minimum size, in pixels (will automatically be resized for scrollbars smaller than this value)
   * @var int
   */
		minScrollerSize: 30,

		/**
   * Minimun wheel scroll increment (prevent mouses with custom driver to scroll too slowly)
   * @var float
   */
		minWheelScroll: 0.25,

		/**
   * Use true to let the parent element scroll when the target can not scroll no more (on mouse wheel)
   * @var boolean
   */
		continuousWheelScroll: true,

		/**
   * Use true to let the parent element scroll when the target can not scroll no more (on touch move)
   * @var boolean
   */
		continuousTouchScroll: true,

		/**
   * Speed: move for each mouse scroll
   * @var int
   */
		speed: 48,

		/**
   * Animate scroll movement
   * @var boolean
   */
		animate: false,

		/**
   * Show scrollbars only on hover
   * @var boolean
   */
		showOnHover: true,

		/**
   * Hide useless scrollbars
   * @var boolean
   */
		autoHide: true
	};

	// Add to template setup function
	$.template.addSetupFunction(function (self, children) {
		// Custom scroll
		this.findIn(self, children, '.scrollable').customScroll();

		return this;
	});
})(jQuery, document);

/***/ }),

/***/ 51:
/***/ (function(module, exports) {

/**
 * Bunch of useful filters for angularJS(with no external dependencies!)
 * @version v0.5.17 - 2017-09-22 * @link https://github.com/a8m/angular-filter
 * @author Ariel Mashraki <ariel@mashraki.co.il>
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */!function (a, b, c) {
  "use strict";
  function d(a) {
    return E(a) ? a : Object.keys(a).map(function (b) {
      return a[b];
    });
  }function e(a) {
    return null === a;
  }function f(a, b) {
    var d = Object.keys(a);return d.map(function (d) {
      return b[d] !== c && b[d] == a[d];
    }).indexOf(!1) == -1;
  }function g(a, b) {
    function c(a, b, c) {
      for (var d = 0; b + d <= a.length;) {
        if (a.charAt(b + d) == c) return d;d++;
      }return -1;
    }for (var d = 0, e = 0; e <= b.length; e++) {
      var f = c(a, d, b.charAt(e));if (f == -1) return !1;d += f + 1;
    }return !0;
  }function h(a, b, c) {
    var d = 0;return a.filter(function (a) {
      var e = y(c) ? d < b && c(a) : d < b;return d = e ? d + 1 : d, e;
    });
  }function i(a, b) {
    return Math.round(a * Math.pow(10, b)) / Math.pow(10, b);
  }function j(a, b, c) {
    b = b || [];var d = Object.keys(a);return d.forEach(function (d) {
      if (D(a[d]) && !E(a[d])) {
        var e = c ? c + "." + d : c;j(a[d], b, e || d);
      } else {
        var f = c ? c + "." + d : d;b.push(f);
      }
    }), b;
  }function k(a) {
    return a && a.$evalAsync && a.$watch;
  }function l() {
    return function (a, b) {
      return a > b;
    };
  }function m() {
    return function (a, b) {
      return a >= b;
    };
  }function n() {
    return function (a, b) {
      return a < b;
    };
  }function o() {
    return function (a, b) {
      return a <= b;
    };
  }function p() {
    return function (a, b) {
      return a == b;
    };
  }function q() {
    return function (a, b) {
      return a != b;
    };
  }function r() {
    return function (a, b) {
      return a === b;
    };
  }function s() {
    return function (a, b) {
      return a !== b;
    };
  }function t(a) {
    return function (b, c) {
      return b = D(b) ? d(b) : b, !(!E(b) || z(c)) && b.some(function (b) {
        return B(c) && D(b) || A(c) ? a(c)(b) : b === c;
      });
    };
  }function u(a, b) {
    return b = b || 0, b >= a.length ? a : E(a[b]) ? u(a.slice(0, b).concat(a[b], a.slice(b + 1)), b) : u(a, b + 1);
  }function v(a) {
    return function (b, c) {
      function e(a, b) {
        return !z(b) && a.some(function (a) {
          return I(a, b);
        });
      }if (b = D(b) ? d(b) : b, !E(b)) return b;var f = [],
          g = a(c);return z(c) ? b.filter(function (a, b, c) {
        return c.indexOf(a) === b;
      }) : b.filter(function (a) {
        var b = g(a);return !e(f, b) && (f.push(b), !0);
      });
    };
  }function w(a, b, c) {
    return b ? a + c + w(a, --b, c) : a;
  }function x() {
    return function (a) {
      return B(a) ? a.split(" ").map(function (a) {
        return a.charAt(0).toUpperCase() + a.substring(1);
      }).join(" ") : a;
    };
  }var y = b.isDefined,
      z = b.isUndefined,
      A = b.isFunction,
      B = b.isString,
      C = b.isNumber,
      D = b.isObject,
      E = b.isArray,
      F = b.forEach,
      G = b.extend,
      H = b.copy,
      I = b.equals;String.prototype.contains || (String.prototype.contains = function () {
    return String.prototype.indexOf.apply(this, arguments) !== -1;
  }), b.module("a8m.angular", []).filter("isUndefined", function () {
    return function (a) {
      return b.isUndefined(a);
    };
  }).filter("isDefined", function () {
    return function (a) {
      return b.isDefined(a);
    };
  }).filter("isFunction", function () {
    return function (a) {
      return b.isFunction(a);
    };
  }).filter("isString", function () {
    return function (a) {
      return b.isString(a);
    };
  }).filter("isNumber", function () {
    return function (a) {
      return b.isNumber(a);
    };
  }).filter("isArray", function () {
    return function (a) {
      return b.isArray(a);
    };
  }).filter("isObject", function () {
    return function (a) {
      return b.isObject(a);
    };
  }).filter("isEqual", function () {
    return function (a, c) {
      return b.equals(a, c);
    };
  }), b.module("a8m.conditions", []).filter({ isGreaterThan: l, ">": l, isGreaterThanOrEqualTo: m, ">=": m, isLessThan: n, "<": n, isLessThanOrEqualTo: o, "<=": o, isEqualTo: p, "==": p, isNotEqualTo: q, "!=": q, isIdenticalTo: r, "===": r, isNotIdenticalTo: s, "!==": s }), b.module("a8m.is-null", []).filter("isNull", function () {
    return function (a) {
      return e(a);
    };
  }), b.module("a8m.after-where", []).filter("afterWhere", function () {
    return function (a, b) {
      if (a = D(a) ? d(a) : a, !E(a) || z(b)) return a;var c = a.map(function (a) {
        return f(b, a);
      }).indexOf(!0);return a.slice(c === -1 ? 0 : c);
    };
  }), b.module("a8m.after", []).filter("after", function () {
    return function (a, b) {
      return a = D(a) ? d(a) : a, E(a) ? a.slice(b) : a;
    };
  }), b.module("a8m.before-where", []).filter("beforeWhere", function () {
    return function (a, b) {
      if (a = D(a) ? d(a) : a, !E(a) || z(b)) return a;var c = a.map(function (a) {
        return f(b, a);
      }).indexOf(!0);return a.slice(0, c === -1 ? a.length : ++c);
    };
  }), b.module("a8m.before", []).filter("before", function () {
    return function (a, b) {
      return a = D(a) ? d(a) : a, E(a) ? a.slice(0, b ? --b : b) : a;
    };
  }), b.module("a8m.chunk-by", ["a8m.filter-watcher"]).filter("chunkBy", ["filterWatcher", function (a) {
    return function (b, c, d) {
      function e(a, b) {
        for (var c = []; a--;) {
          c[a] = b;
        }return c;
      }function f(a, b, c) {
        return E(a) ? a.map(function (a, d, f) {
          return d *= b, a = f.slice(d, d + b), !z(c) && a.length < b ? a.concat(e(b - a.length, c)) : a;
        }).slice(0, Math.ceil(a.length / b)) : a;
      }return a.isMemoized("chunkBy", arguments) || a.memoize("chunkBy", arguments, this, f(b, c, d));
    };
  }]), b.module("a8m.concat", []).filter("concat", [function () {
    return function (a, b) {
      if (z(b)) return a;if (E(a)) return D(b) ? a.concat(d(b)) : a.concat(b);if (D(a)) {
        var c = d(a);return D(b) ? c.concat(d(b)) : c.concat(b);
      }return a;
    };
  }]), b.module("a8m.contains", []).filter({ contains: ["$parse", t], some: ["$parse", t] }), b.module("a8m.count-by", []).filter("countBy", ["$parse", function (a) {
    return function (b, c) {
      var e,
          f = {},
          g = a(c);return b = D(b) ? d(b) : b, !E(b) || z(c) ? b : (b.forEach(function (a) {
        e = g(a), f[e] || (f[e] = 0), f[e]++;
      }), f);
    };
  }]), b.module("a8m.defaults", []).filter("defaults", ["$parse", function (a) {
    return function (b, c) {
      if (b = D(b) ? d(b) : b, !E(b) || !D(c)) return b;var e = j(c);return b.forEach(function (b) {
        e.forEach(function (d) {
          var e = a(d),
              f = e.assign;z(e(b)) && f(b, e(c));
        });
      }), b;
    };
  }]), b.module("a8m.every", []).filter("every", ["$parse", function (a) {
    return function (b, c) {
      return b = D(b) ? d(b) : b, !(E(b) && !z(c)) || b.every(function (b) {
        return D(b) || A(c) ? a(c)(b) : b === c;
      });
    };
  }]), b.module("a8m.filter-by", []).filter("filterBy", ["$parse", function (a) {
    return function (b, e, f, g) {
      var h;return f = B(f) || C(f) ? String(f).toLowerCase() : c, b = D(b) ? d(b) : b, !E(b) || z(f) ? b : b.filter(function (b) {
        return e.some(function (c) {
          if (~c.indexOf("+")) {
            var d = c.replace(/\s+/g, "").split("+");h = d.map(function (c) {
              return a(c)(b);
            }).join(" ");
          } else h = a(c)(b);return !(!B(h) && !C(h)) && (h = String(h).toLowerCase(), g ? h === f : h.contains(f));
        });
      });
    };
  }]), b.module("a8m.first", []).filter("first", ["$parse", function (a) {
    return function (b) {
      var e, f, g;return b = D(b) ? d(b) : b, E(b) ? (g = Array.prototype.slice.call(arguments, 1), e = C(g[0]) ? g[0] : 1, f = C(g[0]) ? C(g[1]) ? c : g[1] : g[0], g.length ? h(b, e, f ? a(f) : f) : b[0]) : b;
    };
  }]), b.module("a8m.flatten", []).filter("flatten", function () {
    return function (a, b) {
      return b = b || !1, a = D(a) ? d(a) : a, E(a) ? b ? [].concat.apply([], a) : u(a, 0) : a;
    };
  }), b.module("a8m.fuzzy-by", []).filter("fuzzyBy", ["$parse", function (a) {
    return function (b, c, e, f) {
      var h,
          i,
          j = f || !1;return b = D(b) ? d(b) : b, !E(b) || z(c) || z(e) ? b : (i = a(c), b.filter(function (a) {
        return h = i(a), !!B(h) && (h = j ? h : h.toLowerCase(), e = j ? e : e.toLowerCase(), g(h, e) !== !1);
      }));
    };
  }]), b.module("a8m.fuzzy", []).filter("fuzzy", function () {
    return function (a, b, c) {
      function e(a, b) {
        var c,
            d,
            e = Object.keys(a);return 0 < e.filter(function (e) {
          return c = a[e], !!d || !!B(c) && (c = f ? c : c.toLowerCase(), d = g(c, b) !== !1);
        }).length;
      }var f = c || !1;return a = D(a) ? d(a) : a, !E(a) || z(b) ? a : (b = f ? b : b.toLowerCase(), a.filter(function (a) {
        return B(a) ? (a = f ? a : a.toLowerCase(), g(a, b) !== !1) : !!D(a) && e(a, b);
      }));
    };
  }), b.module("a8m.group-by", ["a8m.filter-watcher"]).filter("groupBy", ["$parse", "filterWatcher", function (a, b) {
    return function (c, d) {
      function e(a, b) {
        var c,
            d = {};return F(a, function (a) {
          c = b(a), d[c] || (d[c] = []), d[c].push(a);
        }), d;
      }return !D(c) || z(d) ? c : b.isMemoized("groupBy", arguments) || b.memoize("groupBy", arguments, this, e(c, a(d)));
    };
  }]), b.module("a8m.is-empty", []).filter("isEmpty", function () {
    return function (a) {
      return D(a) ? !d(a).length : !a.length;
    };
  }), b.module("a8m.join", []).filter("join", function () {
    return function (a, b) {
      return z(a) || !E(a) ? a : (z(b) && (b = " "), a.join(b));
    };
  }), b.module("a8m.last", []).filter("last", ["$parse", function (a) {
    return function (b) {
      var e,
          f,
          g,
          i = H(b);return i = D(i) ? d(i) : i, E(i) ? (g = Array.prototype.slice.call(arguments, 1), e = C(g[0]) ? g[0] : 1, f = C(g[0]) ? C(g[1]) ? c : g[1] : g[0], g.length ? h(i.reverse(), e, f ? a(f) : f).reverse() : i[i.length - 1]) : i;
    };
  }]), b.module("a8m.map", []).filter("map", ["$parse", function (a) {
    return function (b, c) {
      return b = D(b) ? d(b) : b, !E(b) || z(c) ? b : b.map(function (b) {
        return a(c)(b);
      });
    };
  }]), b.module("a8m.omit", []).filter("omit", ["$parse", function (a) {
    return function (b, c) {
      return b = D(b) ? d(b) : b, !E(b) || z(c) ? b : b.filter(function (b) {
        return !a(c)(b);
      });
    };
  }]), b.module("a8m.pick", []).filter("pick", ["$parse", function (a) {
    return function (b, c) {
      return b = D(b) ? d(b) : b, !E(b) || z(c) ? b : b.filter(function (b) {
        return a(c)(b);
      });
    };
  }]), b.module("a8m.range", []).filter("range", function () {
    return function (a, b, c, d, e) {
      c = c || 0, d = d || 1;for (var f = 0; f < parseInt(b); f++) {
        var g = c + f * d;a.push(A(e) ? e(g) : g);
      }return a;
    };
  }), b.module("a8m.remove-with", []).filter("removeWith", function () {
    return function (a, b) {
      return z(b) ? a : (a = D(a) ? d(a) : a, a.filter(function (a) {
        return !f(b, a);
      }));
    };
  }), b.module("a8m.remove", []).filter("remove", function () {
    return function (a) {
      a = D(a) ? d(a) : a;var b = Array.prototype.slice.call(arguments, 1);return E(a) ? a.filter(function (a) {
        return !b.some(function (b) {
          return I(b, a);
        });
      }) : a;
    };
  }), b.module("a8m.reverse", []).filter("reverse", [function () {
    return function (a) {
      return a = D(a) ? d(a) : a, B(a) ? a.split("").reverse().join("") : E(a) ? a.slice().reverse() : a;
    };
  }]), b.module("a8m.search-field", []).filter("searchField", ["$parse", function (a) {
    return function (b) {
      var c, e;b = D(b) ? d(b) : b;var f = Array.prototype.slice.call(arguments, 1);return E(b) && f.length ? b.map(function (b) {
        return e = f.map(function (d) {
          return (c = a(d))(b);
        }).join(" "), G(b, { searchField: e });
      }) : b;
    };
  }]), b.module("a8m.to-array", []).filter("toArray", function () {
    return function (a, b) {
      return D(a) ? b ? Object.keys(a).map(function (b) {
        return G(a[b], { $key: b });
      }) : d(a) : a;
    };
  }), b.module("a8m.unique", []).filter({ unique: ["$parse", v], uniq: ["$parse", v] }), b.module("a8m.where", []).filter("where", function () {
    return function (a, b) {
      return z(b) ? a : (a = D(a) ? d(a) : a, a.filter(function (a) {
        return f(b, a);
      }));
    };
  }), b.module("a8m.xor", []).filter("xor", ["$parse", function (a) {
    return function (b, c, e) {
      function f(b, c) {
        var d = a(e);return c.some(function (a) {
          return e ? I(d(a), d(b)) : I(a, b);
        });
      }return e = e || !1, b = D(b) ? d(b) : b, c = D(c) ? d(c) : c, E(b) && E(c) ? b.concat(c).filter(function (a) {
        return !(f(a, b) && f(a, c));
      }) : b;
    };
  }]), b.module("a8m.math.abs", []).filter("abs", function () {
    return function (a) {
      return Math.abs(a);
    };
  }), b.module("a8m.math.byteFmt", []).filter("byteFmt", function () {
    var a = [{ str: "B", val: 1024 }];return ["KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"].forEach(function (b, c) {
      a.push({ str: b, val: 1024 * a[c].val });
    }), function (b, c) {
      if (C(c) && isFinite(c) && c % 1 === 0 && c >= 0 && C(b) && isFinite(b)) {
        for (var d = 0; d < a.length - 1 && b >= a[d].val;) {
          d++;
        }return b /= d > 0 ? a[d - 1].val : 1, i(b, c) + " " + a[d].str;
      }return "NaN";
    };
  }), b.module("a8m.math.degrees", []).filter("degrees", function () {
    return function (a, b) {
      if (C(b) && isFinite(b) && b % 1 === 0 && b >= 0 && C(a) && isFinite(a)) {
        var c = 180 * a / Math.PI;return Math.round(c * Math.pow(10, b)) / Math.pow(10, b);
      }return "NaN";
    };
  }), b.module("a8m.math.kbFmt", []).filter("kbFmt", function () {
    var a = [{ str: "KB", val: 1024 }];return ["MB", "GB", "TB", "PB", "EB", "ZB", "YB"].forEach(function (b, c) {
      a.push({ str: b, val: 1024 * a[c].val });
    }), function (b, c) {
      if (C(c) && isFinite(c) && c % 1 === 0 && c >= 0 && C(b) && isFinite(b)) {
        for (var d = 0; d < a.length - 1 && b >= a[d].val;) {
          d++;
        }return b /= d > 0 ? a[d - 1].val : 1, i(b, c) + " " + a[d].str;
      }return "NaN";
    };
  }), b.module("a8m.math.max", []).filter("max", ["$parse", function (a) {
    function b(b, c) {
      var d = b.map(function (b) {
        return a(c)(b);
      });return d.indexOf(Math.max.apply(Math, d));
    }return function (a, c) {
      return E(a) ? z(c) ? Math.max.apply(Math, a) : a[b(a, c)] : a;
    };
  }]), b.module("a8m.math.min", []).filter("min", ["$parse", function (a) {
    function b(b, c) {
      var d = b.map(function (b) {
        return a(c)(b);
      });return d.indexOf(Math.min.apply(Math, d));
    }return function (a, c) {
      return E(a) ? z(c) ? Math.min.apply(Math, a) : a[b(a, c)] : a;
    };
  }]), b.module("a8m.math.percent", []).filter("percent", function () {
    return function (a, b, c) {
      var d = B(a) ? Number(a) : a;return b = b || 100, c = c || !1, !C(d) || isNaN(d) ? a : c ? Math.round(d / b * 100) : d / b * 100;
    };
  }), b.module("a8m.math.radians", []).filter("radians", function () {
    return function (a, b) {
      if (C(b) && isFinite(b) && b % 1 === 0 && b >= 0 && C(a) && isFinite(a)) {
        var c = 3.14159265359 * a / 180;return Math.round(c * Math.pow(10, b)) / Math.pow(10, b);
      }return "NaN";
    };
  }), b.module("a8m.math.radix", []).filter("radix", function () {
    return function (a, b) {
      var c = /^[2-9]$|^[1-2]\d$|^3[0-6]$/;return C(a) && c.test(b) ? a.toString(b).toUpperCase() : a;
    };
  }), b.module("a8m.math.shortFmt", []).filter("shortFmt", function () {
    return function (a, b) {
      return C(b) && isFinite(b) && b % 1 === 0 && b >= 0 && C(a) && isFinite(a) ? a < 1e3 ? "" + a : a < 1e6 ? i(a / 1e3, b) + " K" : a < 1e9 ? i(a / 1e6, b) + " M" : i(a / 1e9, b) + " B" : "NaN";
    };
  }), b.module("a8m.math.sum", []).filter("sum", function () {
    return function (a, b) {
      return E(a) ? a.reduce(function (a, b) {
        return a + b;
      }, b || 0) : a;
    };
  }), b.module("a8m.ends-with", []).filter("endsWith", function () {
    return function (a, b, c) {
      var d,
          e = c || !1;return !B(a) || z(b) ? a : (a = e ? a : a.toLowerCase(), d = a.length - b.length, a.indexOf(e ? b : b.toLowerCase(), d) !== -1);
    };
  }), b.module("a8m.latinize", []).filter("latinize", [function () {
    function a(a) {
      return a.replace(/[^\u0000-\u007E]/g, function (a) {
        return c[a] || a;
      });
    }for (var b = [{ base: "A", letters: "AⒶＡÀÁÂẦẤẪẨÃĀĂẰẮẴẲȦǠÄǞẢÅǺǍȀȂẠẬẶḀĄȺⱯ" }, { base: "AA", letters: "Ꜳ" }, { base: "AE", letters: "ÆǼǢ" }, { base: "AO", letters: "Ꜵ" }, { base: "AU", letters: "Ꜷ" }, { base: "AV", letters: "ꜸꜺ" }, { base: "AY", letters: "Ꜽ" }, { base: "B", letters: "BⒷＢḂḄḆɃƂƁ" }, { base: "C", letters: "CⒸＣĆĈĊČÇḈƇȻꜾ" }, { base: "D", letters: "DⒹＤḊĎḌḐḒḎĐƋƊƉꝹ" }, { base: "DZ", letters: "ǱǄ" }, { base: "Dz", letters: "ǲǅ" }, { base: "E", letters: "EⒺＥÈÉÊỀẾỄỂẼĒḔḖĔĖËẺĚȄȆẸỆȨḜĘḘḚƐƎ" }, { base: "F", letters: "FⒻＦḞƑꝻ" }, { base: "G", letters: "GⒼＧǴĜḠĞĠǦĢǤƓꞠꝽꝾ" }, { base: "H", letters: "HⒽＨĤḢḦȞḤḨḪĦⱧⱵꞍ" }, { base: "I", letters: "IⒾＩÌÍÎĨĪĬİÏḮỈǏȈȊỊĮḬƗ" }, { base: "J", letters: "JⒿＪĴɈ" }, { base: "K", letters: "KⓀＫḰǨḲĶḴƘⱩꝀꝂꝄꞢ" }, { base: "L", letters: "LⓁＬĿĹĽḶḸĻḼḺŁȽⱢⱠꝈꝆꞀ" }, { base: "LJ", letters: "Ǉ" }, { base: "Lj", letters: "ǈ" }, { base: "M", letters: "MⓂＭḾṀṂⱮƜ" }, { base: "N", letters: "NⓃＮǸŃÑṄŇṆŅṊṈȠƝꞐꞤ" }, { base: "NJ", letters: "Ǌ" }, { base: "Nj", letters: "ǋ" }, { base: "O", letters: "OⓄＯÒÓÔỒỐỖỔÕṌȬṎŌṐṒŎȮȰÖȪỎŐǑȌȎƠỜỚỠỞỢỌỘǪǬØǾƆƟꝊꝌ" }, { base: "OI", letters: "Ƣ" }, { base: "OO", letters: "Ꝏ" }, { base: "OU", letters: "Ȣ" }, { base: "OE", letters: "Œ" }, { base: "oe", letters: "œ" }, { base: "P", letters: "PⓅＰṔṖƤⱣꝐꝒꝔ" }, { base: "Q", letters: "QⓆＱꝖꝘɊ" }, { base: "R", letters: "RⓇＲŔṘŘȐȒṚṜŖṞɌⱤꝚꞦꞂ" }, { base: "S", letters: "SⓈＳẞŚṤŜṠŠṦṢṨȘŞⱾꞨꞄ" }, { base: "T", letters: "TⓉＴṪŤṬȚŢṰṮŦƬƮȾꞆ" }, { base: "TZ", letters: "Ꜩ" }, { base: "U", letters: "UⓊＵÙÚÛŨṸŪṺŬÜǛǗǕǙỦŮŰǓȔȖƯỪỨỮỬỰỤṲŲṶṴɄ" }, { base: "V", letters: "VⓋＶṼṾƲꝞɅ" }, { base: "VY", letters: "Ꝡ" }, { base: "W", letters: "WⓌＷẀẂŴẆẄẈⱲ" }, { base: "X", letters: "XⓍＸẊẌ" }, { base: "Y", letters: "YⓎＹỲÝŶỸȲẎŸỶỴƳɎỾ" }, { base: "Z", letters: "ZⓏＺŹẐŻŽẒẔƵȤⱿⱫꝢ" }, { base: "a", letters: "aⓐａẚàáâầấẫẩãāăằắẵẳȧǡäǟảåǻǎȁȃạậặḁąⱥɐ" }, { base: "aa", letters: "ꜳ" }, { base: "ae", letters: "æǽǣ" }, { base: "ao", letters: "ꜵ" }, { base: "au", letters: "ꜷ" }, { base: "av", letters: "ꜹꜻ" }, { base: "ay", letters: "ꜽ" }, { base: "b", letters: "bⓑｂḃḅḇƀƃɓ" }, { base: "c", letters: "cⓒｃćĉċčçḉƈȼꜿↄ" }, { base: "d", letters: "dⓓｄḋďḍḑḓḏđƌɖɗꝺ" }, { base: "dz", letters: "ǳǆ" }, { base: "e", letters: "eⓔｅèéêềếễểẽēḕḗĕėëẻěȅȇẹệȩḝęḙḛɇɛǝ" }, { base: "f", letters: "fⓕｆḟƒꝼ" }, { base: "g", letters: "gⓖｇǵĝḡğġǧģǥɠꞡᵹꝿ" }, { base: "h", letters: "hⓗｈĥḣḧȟḥḩḫẖħⱨⱶɥ" }, { base: "hv", letters: "ƕ" }, { base: "i", letters: "iⓘｉìíîĩīĭïḯỉǐȉȋịįḭɨı" }, { base: "j", letters: "jⓙｊĵǰɉ" }, { base: "k", letters: "kⓚｋḱǩḳķḵƙⱪꝁꝃꝅꞣ" }, { base: "l", letters: "lⓛｌŀĺľḷḹļḽḻſłƚɫⱡꝉꞁꝇ" }, { base: "lj", letters: "ǉ" }, { base: "m", letters: "mⓜｍḿṁṃɱɯ" }, { base: "n", letters: "nⓝｎǹńñṅňṇņṋṉƞɲŉꞑꞥ" }, { base: "nj", letters: "ǌ" }, { base: "o", letters: "oⓞｏòóôồốỗổõṍȭṏōṑṓŏȯȱöȫỏőǒȍȏơờớỡởợọộǫǭøǿɔꝋꝍɵ" }, { base: "oi", letters: "ƣ" }, { base: "ou", letters: "ȣ" }, { base: "oo", letters: "ꝏ" }, { base: "p", letters: "pⓟｐṕṗƥᵽꝑꝓꝕ" }, { base: "q", letters: "qⓠｑɋꝗꝙ" }, { base: "r", letters: "rⓡｒŕṙřȑȓṛṝŗṟɍɽꝛꞧꞃ" }, { base: "s", letters: "sⓢｓßśṥŝṡšṧṣṩșşȿꞩꞅẛ" }, { base: "t", letters: "tⓣｔṫẗťṭțţṱṯŧƭʈⱦꞇ" }, { base: "tz", letters: "ꜩ" }, { base: "u", letters: "uⓤｕùúûũṹūṻŭüǜǘǖǚủůűǔȕȗưừứữửựụṳųṷṵʉ" }, { base: "v", letters: "vⓥｖṽṿʋꝟʌ" }, { base: "vy", letters: "ꝡ" }, { base: "w", letters: "wⓦｗẁẃŵẇẅẘẉⱳ" }, { base: "x", letters: "xⓧｘẋẍ" }, { base: "y", letters: "yⓨｙỳýŷỹȳẏÿỷẙỵƴɏỿ" }, { base: "z", letters: "zⓩｚźẑżžẓẕƶȥɀⱬꝣ" }], c = {}, d = 0; d < b.length; d++) {
      for (var e = b[d].letters.split(""), f = 0; f < e.length; f++) {
        c[e[f]] = b[d].base;
      }
    }return function (b) {
      return B(b) ? a(b) : b;
    };
  }]), b.module("a8m.ltrim", []).filter("ltrim", function () {
    return function (a, b) {
      var c = b || "\\s";return B(a) ? a.replace(new RegExp("^" + c + "+"), "") : a;
    };
  }), b.module("a8m.match", []).filter("match", function () {
    return function (a, b, c) {
      var d = new RegExp(b, c);return B(a) ? a.match(d) : null;
    };
  }), b.module("a8m.phoneUS", []).filter("phoneUS", function () {
    return function (a) {
      return a += "", "(" + a.slice(0, 3) + ") " + a.slice(3, 6) + "-" + a.slice(6);
    };
  }), b.module("a8m.repeat", []).filter("repeat", [function () {
    return function (a, b, c) {
      var d = ~~b;return B(a) && d ? w(a, --b, c || "") : a;
    };
  }]), b.module("a8m.rtrim", []).filter("rtrim", function () {
    return function (a, b) {
      var c = b || "\\s";return B(a) ? a.replace(new RegExp(c + "+$"), "") : a;
    };
  }), b.module("a8m.slugify", []).filter("slugify", [function () {
    return function (a, b) {
      var c = z(b) ? "-" : b;return B(a) ? a.toLowerCase().replace(/\s+/g, c) : a;
    };
  }]), b.module("a8m.split", []).filter("split", function () {
    function a(a) {
      return a.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    }return function (b, c, d) {
      var f, g, h, i;return z(b) || !B(b) ? null : (z(c) && (c = ""), isNaN(d) && (d = 0), f = new RegExp(a(c), "g"), g = b.match(f), e(g) || d >= g.length ? [b] : 0 === d ? b.split(c) : (h = b.split(c), i = h.splice(0, d + 1), h.unshift(i.join(c)), h));
    };
  }), b.module("a8m.starts-with", []).filter("startsWith", function () {
    return function (a, b, c) {
      var d = c || !1;return !B(a) || z(b) ? a : (a = d ? a : a.toLowerCase(), !a.indexOf(d ? b : b.toLowerCase()));
    };
  }), b.module("a8m.stringular", []).filter("stringular", function () {
    return function (a) {
      var b = Array.prototype.slice.call(arguments, 1);return a.replace(/{(\d+)}/g, function (a, c) {
        return z(b[c]) ? a : b[c];
      });
    };
  }), b.module("a8m.strip-tags", []).filter("stripTags", function () {
    return function (a) {
      return B(a) ? a.replace(/<\S[^><]*>/g, "") : a;
    };
  }), b.module("a8m.test", []).filter("test", function () {
    return function (a, b, c) {
      var d = new RegExp(b, c);return B(a) ? d.test(a) : a;
    };
  }), b.module("a8m.trim", []).filter("trim", function () {
    return function (a, b) {
      var c = b || "\\s";return B(a) ? a.replace(new RegExp("^" + c + "+|" + c + "+$", "g"), "") : a;
    };
  }), b.module("a8m.truncate", []).filter("truncate", function () {
    return function (a, b, c, d) {
      return b = z(b) ? a.length : b, d = d || !1, c = c || "", !B(a) || a.length <= b ? a : a.substring(0, d ? a.indexOf(" ", b) === -1 ? a.length : a.indexOf(" ", b) : b) + c;
    };
  }), b.module("a8m.ucfirst", []).filter({ ucfirst: x, titleize: x }), b.module("a8m.uri-component-encode", []).filter("uriComponentEncode", ["$window", function (a) {
    return function (b) {
      return B(b) ? a.encodeURIComponent(b) : b;
    };
  }]), b.module("a8m.uri-encode", []).filter("uriEncode", ["$window", function (a) {
    return function (b) {
      return B(b) ? a.encodeURI(b) : b;
    };
  }]), b.module("a8m.wrap", []).filter("wrap", function () {
    return function (a, b, c) {
      return B(a) && y(b) ? [b, a, c || b].join("") : a;
    };
  }), b.module("a8m.filter-watcher", []).provider("filterWatcher", function () {
    this.$get = ["$window", "$rootScope", function (a, b) {
      function c(b, c) {
        function d() {
          var b = [];return function (c, d) {
            if (D(d) && !e(d)) {
              if (~b.indexOf(d)) return "[Circular]";b.push(d);
            }return a == d ? "$WINDOW" : a.document == d ? "$DOCUMENT" : k(d) ? "$SCOPE" : d;
          };
        }return [b, JSON.stringify(c, d())].join("#").replace(/"/g, "");
      }function d(a) {
        var b = a.targetScope.$id;F(l[b], function (a) {
          delete j[a];
        }), delete l[b];
      }function f() {
        m(function () {
          b.$$phase || (j = {});
        }, 2e3);
      }function g(a, b) {
        var c = a.$id;return z(l[c]) && (a.$on("$destroy", d), l[c] = []), l[c].push(b);
      }function h(a, b) {
        var d = c(a, b);return j[d];
      }function i(a, b, d, e) {
        var h = c(a, b);return j[h] = e, k(d) ? g(d, h) : f(), e;
      }var j = {},
          l = {},
          m = a.setTimeout;return { isMemoized: h, memoize: i };
    }];
  }), b.module("angular.filter", ["a8m.ucfirst", "a8m.uri-encode", "a8m.uri-component-encode", "a8m.slugify", "a8m.latinize", "a8m.strip-tags", "a8m.stringular", "a8m.truncate", "a8m.starts-with", "a8m.ends-with", "a8m.wrap", "a8m.trim", "a8m.ltrim", "a8m.rtrim", "a8m.repeat", "a8m.test", "a8m.match", "a8m.split", "a8m.phoneUS", "a8m.to-array", "a8m.concat", "a8m.contains", "a8m.unique", "a8m.is-empty", "a8m.after", "a8m.after-where", "a8m.before", "a8m.before-where", "a8m.defaults", "a8m.where", "a8m.reverse", "a8m.remove", "a8m.remove-with", "a8m.group-by", "a8m.count-by", "a8m.chunk-by", "a8m.search-field", "a8m.fuzzy-by", "a8m.fuzzy", "a8m.omit", "a8m.pick", "a8m.every", "a8m.filter-by", "a8m.xor", "a8m.map", "a8m.first", "a8m.last", "a8m.flatten", "a8m.join", "a8m.range", "a8m.math.max", "a8m.math.min", "a8m.math.abs", "a8m.math.percent", "a8m.math.radix", "a8m.math.sum", "a8m.math.degrees", "a8m.math.radians", "a8m.math.byteFmt", "a8m.math.kbFmt", "a8m.math.shortFmt", "a8m.angular", "a8m.conditions", "a8m.is-null", "a8m.filter-watcher"]);
}(window, window.angular);

/***/ }),

/***/ 52:
/***/ (function(module, exports) {

var app = angular.module('myApp', ['angular.filter', 'ngRoute'], function ($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
});

app.directive('dateTimePicker', function ($rootScope) {
    return {
        require: '?ngModel',
        restrict: 'AE',
        scope: {
            pick12HourFormat: '@'
        },
        link: function link(scope, elem, attrs) {
            elem.datetimepicker({
                format: "YYYY-MM-DD hh:mm"
            });

            elem.on('blur', function () {
                elem.change();
            });
        }
    };
});

app.config(function ($routeProvider, $locationProvider) {
    // console.log($routeProvider)
    $locationProvider.hashPrefix('');
    $routeProvider.when("/:tableName", {
        controller: "myCtrl"
    });

    //   $locationProvider.html5Mode(true);
});

/***/ }),

/***/ 53:
/***/ (function(module, exports) {


app.factory('API', ['$http', '$q', function ($http, $q) {
    var callAPI = {},
        baseHttpUrl = "./api";

    callAPI.getUtables = function () {
        return $http({
            method: 'GET',
            url: baseHttpUrl + '/getUTable'
        });
    };

    callAPI.selectedTable = function (tableName, selectedEntries) {
        return $http({
            method: 'POST',
            url: baseHttpUrl + '/getSelectedTable?tableName=' + tableName,
            dataType: "json",
            data: {
                getfilters: true,
                p: 0,
                c: selectedEntries
            },
            headers: {
                'Content-Type': 'application/json'
            }
        });
    };

    callAPI.changePage = function (tableName, selectedPage, selectedEntries, query, tableObj, filterData) {
        return $http({
            method: 'POST',
            url: baseHttpUrl + '/getSelectedTable?tableName=' + tableName,
            dataType: "json",
            data: {
                p: selectedPage,
                c: selectedEntries,
                q: JSON.stringify(query),
                fields: JSON.stringify(tableObj),
                filterData: JSON.stringify(filterData)
            },
            headers: {
                'Content-Type': 'application/json'
            }
        });
    };

    callAPI.updateRow = function (params) {
        return $http({
            method: 'GET',
            url: baseHttpUrl + '/updateTableRow?' + params
        });
    };

    callAPI.addRow = function (params) {
        return $http({
            method: 'GET',
            url: baseHttpUrl + '/addTableRow?' + params
        });
    };

    callAPI.deleteRow = function (params) {
        return $http({
            method: 'GET',
            url: baseHttpUrl + '/deleteTableRow?tableName=' + params.tableName + '&id=' + params.id
        });
    };

    return callAPI;
}]);

/***/ }),

/***/ 54:
/***/ (function(module, exports) {

app.controller('myCtrl', ['$scope', 'API', '$location', '$routeParams', '$route', '$timeout', function ($scope, API, $location, $routeParams, $route, $timeout) {
    var editableFields = { 'st': 'site_id', 'tracker': 'rqst_date' };
    var filterData = [];
    var tower_types = { 'Monopole': 'mp.png', 'Self Support': 'sst.png', 'Guyed': 'gt.png' };
    var setAllNullObj = function setAllNullObj(obj) {
        Object.keys(obj).forEach(function (k) {
            obj[k] = null;
        });
    };
    $scope.showFilterTabs = [];
    $scope.uTables = [];
    $scope.uTableSettings = [];
    $scope.uTableSettingsName = "tb_settings_display";
    $scope.uTableSettingsId = 0;
    $scope.settingsData = [];
    $scope.settingsDDLs = [];
    $scope.settingsPage = 0;
    $scope.selectedTableName = "";
    $scope.selectedTableRows = 0;
    $scope.selectedTableId = 0;
    $scope.sortType = "";
    $scope.sortSettingsType = "";
    $scope.addObj = {};
    $scope.filterObj = {};
    $scope.filterData = [];
    $scope.filterFields = [];
    $scope.filterMaxHeight = 0;
    $scope.tableDDLs = [];
    $scope.urlRoute = $route;
    $scope.showModal = $scope.showColumnsMenu = $scope.showSearchType = $scope.filterMenuHide = $scope.loadingfromserver = $scope.showAddRow = false;
    $scope.sumArr = [];
    $scope.visibleColumns = {};
    $scope.showEntries = [10, 20, 50, 100];
    $scope.selectedEntries = 10;
    $scope.selectedPage = 0;
    $scope.paginateBtns = [];
    $scope.markerBounds = { top: 0, left: 0, right: 0, bottom: 0 };
    $scope.markers = [];
    $scope.searchKeyword = "";
    $scope.searchSettingsKeyword = "";

    $scope.initMap = function () {
        var avg_lat = (Number($scope.markerBounds.top) + Number($scope.markerBounds.bottom)) / 2;
        var avg_lng = (Number($scope.markerBounds.left) + Number($scope.markerBounds.right)) / 2;
        var optionsMap = {
            zoom: 6,
            center: { lat: avg_lat, lng: avg_lng }
        };

        $scope.mapapp = new google.maps.Map(document.getElementById('map-google'), optionsMap);

        $scope.markers = [];
        var iconbasepath = "/assets/images/tables/",
            icon_path;
        for (var i = 0; i < $scope.selectedTableData.length; i++) {
            if ($scope.selectedTableData[i].lat_dec && $scope.selectedTableData[i].long_dec) {
                if ($scope.selectedTableData[i].twr_type && tower_types[$scope.selectedTableData[i].twr_type]) {
                    icon_path = iconbasepath + tower_types[$scope.selectedTableData[i].twr_type];
                } else {
                    icon_path = iconbasepath + "cell_id.png";
                }
                $scope.markers[i] = new google.maps.Marker({
                    position: { lat: Number($scope.selectedTableData[i].lat_dec), lng: Number($scope.selectedTableData[i].long_dec) },
                    map: $scope.mapapp,
                    icon: icon_path
                });
            }
        }
    };

    $scope.initDetailsMap = function () {
        var avg_lat = (Number($scope.markerBounds.top) + Number($scope.markerBounds.bottom)) / 2;
        var avg_lng = (Number($scope.markerBounds.left) + Number($scope.markerBounds.right)) / 2;
        var optionsMap = {
            zoom: 6,
            center: { lat: avg_lat, lng: avg_lng }
        };

        $scope.mapapp = new google.maps.Map(document.getElementById('map-details'), optionsMap);

        var icon_path = "/assets/images/tables/";
        if ($scope.editData.twr_type && tower_types[$scope.editData.twr_type]) {
            icon_path += tower_types[$scope.editData.twr_type];
        } else {
            icon_path += "cell_id.png";
        }
        $scope.detailsMarker = new google.maps.Marker({
            position: { lat: Number($scope.editData.lat_dec), lng: Number($scope.editData.long_dec) },
            map: $scope.mapapp,
            icon: icon_path
        });
    };

    $scope.toggleColumns = function () {
        $scope.showColumnsMenu = !$scope.showColumnsMenu;
    };

    $scope.toggleSearchType = function () {
        $scope.showSearchType = !$scope.showSearchType;
    };

    $scope.selectTable = function (tableName) {
        $scope.loadingfromserver = true;
        $scope.selectedPage = 0;
        $scope.searchKeyword = "";
        $location.path("/" + tableName);
        $scope.selectedTableName = tableName;
        for (var i = 0; i < $scope.uTables.length; i++) {
            if ($scope.uTables[i].db_tb == tableName) {
                $scope.selectedTableId = $scope.uTables[i].id;
            }
        }
        API.selectedTable(tableName, $scope.selectedEntries).then(function (response) {
            if (response.status == 200 && response.data.key.length > 0) {
                $scope.selectedTableData = [];
                $scope.sumArr = [];
                $scope.settingsData = [];
                $scope.selectedTableData = response.data.data;
                $scope.selectedTableRows = response.data.rows;
                $scope.filterData = response.data.filters;
                $scope.tableDDLs = response.data.ddls;
                angular.copy($scope.selectedTableData[0], $scope.addObj);
                setAllNullObj($scope.addObj);
                for (var l = 0; l < $scope.uTableSettings.length; l++) {
                    if ($scope.uTableSettings[l].tb_id == $scope.selectedTableId) {
                        $scope.settingsData.push($scope.uTableSettings[l]);
                    }
                }
                console.log("response", response.data);
                var maxPage = Math.ceil($scope.selectedTableRows / $scope.selectedEntries);

                $scope.paginateBtns = [];
                var idx = 1;
                var maxStep = Math.min(5, maxPage);
                while (idx <= maxStep) {
                    $scope.paginateBtns.push(idx);
                    idx++;
                }
                if (idx < maxPage) {
                    $scope.paginateBtns.push('...');
                    $scope.paginateBtns.push(maxPage);
                }

                for (var l = 0; l < $scope.uTableSettings.length; l++) {
                    if ($scope.uTableSettings[l].tb_id == $scope.selectedTableId && $scope.uTableSettings[l].sum == 'Yes') {
                        $scope.sumArr.push({ "key": $scope.uTableSettings[l].field, "total": 0 });
                    }
                }

                for (var k = 0; k < $scope.selectedTableData.length; k++) {
                    if ($scope.selectedTableData[k].lat_dec) {
                        if ($scope.markerBounds.top == 0 || $scope.markerBounds.top < $scope.selectedTableData[k].lat_dec) {
                            $scope.markerBounds.top = $scope.selectedTableData[k].lat_dec;
                        }
                        if ($scope.markerBounds.bottom == 0 || $scope.markerBounds.bottom > $scope.selectedTableData[k].lat_dec) {
                            $scope.markerBounds.bottom = $scope.selectedTableData[k].lat_dec;
                        }
                    }
                    if ($scope.selectedTableData[k].long_dec) {
                        if ($scope.markerBounds.left == 0 || $scope.markerBounds.left < $scope.selectedTableData[k].long_dec) {
                            $scope.markerBounds.left = $scope.selectedTableData[k].long_dec;
                        }
                        if ($scope.markerBounds.right == 0 || $scope.markerBounds.right > $scope.selectedTableData[k].long_dec) {
                            $scope.markerBounds.right = $scope.selectedTableData[k].long_dec;
                        }
                    }
                    $scope.selectedTableData[k].isFilter = true;
                    for (var m = 0; m < $scope.sumArr.length; m++) {
                        if ($scope.selectedTableData[k][$scope.sumArr[m].key] && !isNaN($scope.selectedTableData[k][$scope.sumArr[m].key])) {
                            $scope.sumArr[m].total += Number($scope.selectedTableData[k][$scope.sumArr[m].key]);
                        }
                    }
                }

                $scope.filterMaxHeight = $("#acd-filter-menu").height() - $scope.filterData.length * 40;

                var allCols = response.data.key;
                var template = "<ul class='list' id='ul-cols-list'>";
                $.each(allCols, function (i, col) {
                    if ($scope.checkWeb(col)) {
                        $scope.visibleColumns[col] = true;
                        template += '<li><input id="' + col + 'visibility" class="checkcols" data-name="' + col + '" type="checkbox" value="' + col + '" checked >  <label class="labels" for="' + col + 'visibility"> ' + $scope.getColumnName(col) + ' </label></li>';
                    }
                });
                template += "</ul>";
                $('#block-cols-list').html("");
                $('#block-cols-list').append(template);
                $('.checkcols').on('click', function (e) {
                    var colName = $(e.currentTarget).data('name');
                    $scope.visibleColumns[colName] = !$scope.visibleColumns[colName];
                    $scope.$apply();
                });
            } else {
                if (response.data.msg) {
                    alert(response.data.msg);
                } else {
                    alert("Please Try again Later " + response.statusText);
                }
            }
            $scope.loadingfromserver = false;
        });
    };

    API.getUtables().then(function (response) {
        if (response.status == 200) {
            $scope.uTables = response.data.utables;
            $scope.uTableSettings = response.data.utablesettings;
            $scope.settingsDDLs = response.data.ddls;

            for (var l = 0; l < $scope.uTables.length; l++) {
                if ($scope.uTables[l].db_tb == $scope.uTableSettingsName) {
                    $scope.uTableSettingsId = $scope.uTables[l].id;
                }
            }

            if ($location.path()) {
                $scope.selectTable($location.path().substr(1));
            }

            $(".table_body_viewport").mCustomScrollbar({
                scrollbarPosition: "outside",
                theme: "3d",
                scrollInertia: 300,
                axis: "y"
            });
        } else {
            alert("Please Try again Later " + response.statusText);
        }
    });

    $scope.checkWeb = function (params) {
        if (_.find) {
            var lodObj = _.find($scope.uTableSettings, { 'tb_id': $scope.selectedTableId, 'field': params.trim(), 'web': 'Yes' });
            return lodObj ? 1 : 0;
        } else {
            return 0;
        }
    };

    $scope.checkSettingsWeb = function (params) {
        if (_.find) {
            var lodObj = _.find($scope.uTableSettings, { 'tb_id': $scope.uTableSettingsId, 'field': params.trim(), 'web': 'Yes' });
            return lodObj ? 1 : 0;
        } else {
            return 0;
        }
    };

    $scope.checkVisible = function (params) {
        return $scope.visibleColumns[params];
    };

    $scope.getColumnName = function (params) {
        if (_.find) {
            var lodObj = _.find($scope.uTableSettings, { 'tb_id': $scope.selectedTableId, 'field': params.trim() });
            return lodObj.name;
        } else {
            return 0;
        }
    };

    $scope.getSettingsName = function (params) {
        if (_.find) {
            var lodObj = _.find($scope.uTableSettings, { 'tb_id': $scope.uTableSettingsId, 'field': params.trim() });
            return lodObj.name;
        } else {
            return 0;
        }
    };

    $scope.getColumnInputType = function (params) {
        if (_.find) {
            var lodObj = _.find($scope.uTableSettings, { 'tb_id': $scope.selectedTableId, 'field': params.trim() });
            return lodObj.input_type;
        } else {
            return 0;
        }
    };

    $scope.getSettingsInputType = function (params) {
        if (_.find) {
            var lodObj = _.find($scope.uTableSettings, { 'tb_id': $scope.uTableSettingsId, 'field': params.trim() });
            return lodObj.input_type;
        } else {
            return 0;
        }
    };

    $scope.getColumnValue = function (params) {
        if (_.find) {
            var lodObj = _.find($scope.uTableSettings, { 'tb_id': $scope.selectedTableId, 'field': params.trim() });
            return lodObj.value;
        } else {
            return 0;
        }
    };

    $scope.sort = function (name) {
        $scope.sortType = name;
    };

    $scope.sortSettings = function (name) {
        $scope.sortSettingsType = name;
    };

    $scope.filterTable = function (filterObj, value, status) {
        var allStatus = status;
        if (allStatus) {
            filterObj.val.forEach(function (item) {
                if (!item.checked) {
                    allStatus = false;
                }
            });
        }
        filterObj.checkAll = allStatus;

        //get filtered data
        $scope.changePage(1);
    };

    $scope.filterCheckAll = function (filterObj) {
        filterObj.val.forEach(function (item) {
            item.checked = filterObj.checkAll;
        });

        //get filtered data
        $scope.changePage(1);
    };

    $scope.editSelectedData = function (item, index) {
        $scope.editItemIndex = index;
        $scope.editData = item;
        $scope.showModal = true;
    };

    $scope.isEditable = function (fieldName, tableName) {
        if (fieldName != "id") {
            return true;
        }
        return false;
    };

    $scope.updateRow = function (tableObj, hidden) {
        var selectedTableObj = {};
        if (!tableObj.id) {
            if (!hidden) {
                alert("There is no 'ID' for update");
            }
            return;
        }
        angular.copy(tableObj, selectedTableObj);
        selectedTableObj.tableName = $scope.selectedTableName;
        delete selectedTableObj["$$hashKey"];
        delete selectedTableObj["isFilter"];
        var strParams = "";
        for (var key in selectedTableObj) {
            strParams += key + '=' + selectedTableObj[key] + '&';
        }
        API.updateRow(strParams).then(function (response) {
            console.log("response", response);
            if (!hidden) {
                if (response.data.hasOwnProperty("error") && response.data.error) {
                    alert(response.data.msg);
                } else {
                    alert(response.data.msg);
                }
            }
        });
    };

    $scope.updateSettingsRow = function (tableObj) {
        var selectedTableObj = {};
        if (!tableObj.id) {
            return;
        }
        angular.copy(tableObj, selectedTableObj);
        selectedTableObj.tableName = $scope.uTableSettingsName;
        delete selectedTableObj["$$hashKey"];
        delete selectedTableObj["isFilter"];
        var strParams = "";
        for (var key in selectedTableObj) {
            strParams += key + '=' + selectedTableObj[key] + '&';
        }
        API.updateRow(strParams).then(function (response) {
            console.log("response", response);
        });
    };

    $scope.addRow = function (tableObj) {
        var selectedTableObj = {};
        angular.copy(tableObj, selectedTableObj);
        selectedTableObj.tableName = $scope.selectedTableName;
        delete selectedTableObj["$$hashKey"];
        delete selectedTableObj["isFilter"];
        var strParams = "";
        for (var key in selectedTableObj) {
            strParams += key + '=' + selectedTableObj[key] + '&';
        }
        API.addRow(strParams).then(function (response) {
            console.log("response", response);
            if (response.data.hasOwnProperty("error") && response.data.error) {
                alert(response.data.msg);
            } else {
                alert(response.data.msg);
                return response.data.last_id;
            }
        });
    };

    $scope.closeModal = function () {
        $scope.showModal = false;
    };

    $scope.checkIfVisible = function (param) {
        for (var l = 0; l < $scope.uTableSettings.length; l++) {
            if ($scope.uTableSettings[l].tb_id == $scope.selectedTableId && $scope.uTableSettings[l].field == param && param != 'id') {
                return true;
            }
        }
        return false;
    };

    $scope.deleteRow = function (params) {
        API.deleteRow({ id: params.id, tableName: $scope.selectedTableName }).then(function (response) {
            if (response.data.hasOwnProperty("error") && response.data.error) {
                alert(response.data.msg);
            } else {
                $scope.selectedTableData.splice($scope.editItemIndex, 1);
                alert(response.data.msg);
                $scope.showModal = false;
            }
        });
    };

    $scope.ifSum = function (field) {
        for (var i = 0; i < $scope.sumArr.length; i++) {
            if ($scope.sumArr[i].key.toLowerCase() == field.toLowerCase()) {
                return true;
            }
        }
        return false;
    };

    $scope.getSum = function (field) {
        for (var i = 0; i < $scope.sumArr.length; i++) {
            if ($scope.sumArr[i].key.toLowerCase() == field.toLowerCase()) {
                return $scope.sumArr[i].total;
            }
        }
        return false;
    };

    $scope.changeEntries = function (val) {
        $scope.selectedEntries = val;
        $scope.changePage(1);
        $scope.changeSettingsPage(1);
    };

    $scope.changePage = function (page) {
        $scope.loadingfromserver = true;

        var TableKeysObj = {};
        var query = {};
        angular.copy($scope.selectedTableData[0], TableKeysObj);
        TableKeysObj.tableName = $scope.selectedTableName;
        delete TableKeysObj["$$hashKey"];
        delete TableKeysObj["isFilter"];
        delete TableKeysObj["tableName"];

        page = Math.ceil(page);
        $scope.selectedPage = page - 1;

        if ($scope.searchKeyword) {
            query.searchKeyword = $scope.searchKeyword;
        }

        if ($scope.selectedTableName == 'st') {
            if ($('#frm-search-address').is(':visible')) {
                query.opt = 'address';
                query.street = $("#frm-address").val();
                query.city = $("#frm-city").val();
                query.state = $("#frm-state").val();
                query.county = $("#frm-county").val();
            } else if ($('#frm-search-latlng').is(':visible')) {
                query.opt = 'lat';
                query.lat_dec = $("#frm-dec-lat").val();
                query.long_dec = $("#frm-dec-lng").val();
                query.distance = $("#frm-dec-radius").val();
            }
        }

        API.changePage($scope.selectedTableName, page - 1, $scope.selectedEntries, query, TableKeysObj, $scope.filterData).then(function (response) {
            if (response.status == 200 && response.data.key) {
                $scope.sumArr = [];
                $scope.selectedTableData = response.data.data;
                $scope.selectedTableRows = response.data.rows;
                angular.copy($scope.selectedTableData[0], $scope.addObj);
                setAllNullObj($scope.addObj);
                var maxPage = Math.ceil($scope.selectedTableRows / $scope.selectedEntries);

                $scope.paginateBtns = [];
                if (page < 5) {
                    var idx = 1;
                    var maxStep = Math.min(5, maxPage);
                    while (idx <= maxStep) {
                        $scope.paginateBtns.push(idx);
                        idx++;
                    }
                    if (idx < maxPage) {
                        $scope.paginateBtns.push('...');
                        $scope.paginateBtns.push(maxPage);
                    }
                } else {
                    if (page > maxPage - 5) {
                        if (maxPage > 5) {
                            $scope.paginateBtns.push(1);
                            $scope.paginateBtns.push('...');
                        }
                        var idx = maxPage - 5;
                        while (idx <= maxPage) {
                            $scope.paginateBtns.push(idx);
                            idx++;
                        }
                    } else {
                        $scope.paginateBtns.push(1);
                        $scope.paginateBtns.push('...');
                        $scope.paginateBtns.push(page - 1);
                        $scope.paginateBtns.push(page);
                        $scope.paginateBtns.push(page + 1);
                        $scope.paginateBtns.push('....');
                        $scope.paginateBtns.push(maxPage);
                    }
                }

                for (var l = 0; l < $scope.uTableSettings.length; l++) {
                    if ($scope.uTableSettings[l].tb_id == $scope.selectedTableId && $scope.uTableSettings[l].sum == 'Yes') {
                        $scope.sumArr.push({ "key": $scope.uTableSettings[l].field, "total": 0 });
                    }
                }

                for (var k = 0; k < $scope.selectedTableData.length; k++) {
                    if ($scope.selectedTableData[k].lat_dec) {
                        if ($scope.markerBounds.top == 0 || $scope.markerBounds.top < $scope.selectedTableData[k].lat_dec) {
                            $scope.markerBounds.top = $scope.selectedTableData[k].lat_dec;
                        }
                        if ($scope.markerBounds.bottom == 0 || $scope.markerBounds.bottom > $scope.selectedTableData[k].lat_dec) {
                            $scope.markerBounds.bottom = $scope.selectedTableData[k].lat_dec;
                        }
                    }
                    if ($scope.selectedTableData[k].long_dec) {
                        if ($scope.markerBounds.left == 0 || $scope.markerBounds.left < $scope.selectedTableData[k].long_dec) {
                            $scope.markerBounds.left = $scope.selectedTableData[k].long_dec;
                        }
                        if ($scope.markerBounds.right == 0 || $scope.markerBounds.right > $scope.selectedTableData[k].long_dec) {
                            $scope.markerBounds.right = $scope.selectedTableData[k].long_dec;
                        }
                    }
                    $scope.selectedTableData[k].isFilter = true;
                    for (var m = 0; m < $scope.sumArr.length; m++) {
                        if ($scope.selectedTableData[k][$scope.sumArr[m].key] && !isNaN($scope.selectedTableData[k][$scope.sumArr[m].key])) {
                            $scope.sumArr[m].total += Number($scope.selectedTableData[k][$scope.sumArr[m].key]);
                        }
                    }
                }
            } else {
                $scope.selectedTableData = response.data.data;
                $scope.selectedTableRows = 0;
                if (response.data.msg) {
                    alert(response.data.msg);
                } else {
                    alert("Please Try again Later " + response.statusText);
                }
            }
            $scope.loadingfromserver = false;
        });
    };

    $scope.changeSettingsPage = function (page) {
        page = Math.ceil(page);
        $scope.settingsPage = page - 1;
    };

    $scope.showMap = function () {
        $("#li_list_view").removeClass("active");
        $("#li_settings_view").removeClass("active");
        $("#li_map_view").addClass("active");
        $("#list_view").hide();
        $("#settings_view").hide();
        $("#map_view").show();
        $scope.initMap();
    };

    $scope.showList = function () {
        $("#li_list_view").addClass("active");
        $("#li_map_view").removeClass("active");
        $("#li_settings_view").removeClass("active");
        $("#list_view").show();
        $("#map_view").hide();
        $("#settings_view").hide();
    };

    $scope.showSettings = function () {
        $("#li_settings_view").addClass("active");
        $("#li_list_view").removeClass("active");
        $("#li_map_view").removeClass("active");
        $("#settings_view").show();
        $("#list_view").hide();
        $("#map_view").hide();
    };

    $scope.detailsShowMap = function () {
        $("#details_li_list_view").removeClass("active");
        $("#details_li_map_view").addClass("active");
        $("#details_lview").hide();
        $("#details_gmap").show();
        $scope.initDetailsMap();
    };

    $scope.detailsShowList = function () {
        $("#details_li_list_view").addClass("active");
        $("#details_li_map_view").removeClass("active");
        $("#details_lview").show();
        $("#details_gmap").hide();
    };

    $scope.showLatSearch = function () {
        $("#search_type_address").removeClass("selected");
        $("#search_type_lat").addClass("selected");
        $("#frm-search-address").hide();
        $("#frm-search-latlng").show();
        $scope.showSearchType = false;
    };

    $scope.showAddressSearch = function () {
        $("#search_type_address").addClass("selected");
        $("#search_type_lat").removeClass("selected");
        $("#frm-search-address").show();
        $("#frm-search-latlng").hide();
        $scope.showSearchType = false;
    };

    $scope.showHideMenu = function () {
        $scope.filterMenuHide = !$scope.filterMenuHide;
        var right = $scope.filterMenuHide ? "26px" : "286px";
        $(".table_body_viewport > .mCSB_scrollTools").css("right", right);
    };

    $scope.openLoadingModal = function () {
        $scope.loadingmodal = $.modal({
            contentAlign: 'center',
            width: 240,
            classes: 'modalposition',
            title: false,
            content: '<span class="loader working"></span> <span id="modal-status">Contacting server.. :)</span>',
            buttons: {},
            scrolling: false,
            actions: false
        });
        $scope.loadingmodal.setModalPosition(10, 10);
    };

    $scope.addData = function () {
        var emptyDataObject = {};
        for (var l = 0; l < $scope.uTableSettings.length; l++) {
            if ($scope.uTableSettings[l].tb_id == $scope.selectedTableId) {
                emptyDataObject[$scope.uTableSettings[l].field] = "";
            }
        }
        $scope.editItemIndex = -1;
        $scope.editData = emptyDataObject;
        $scope.showModal = true;
    };

    $scope.showInlineEdit = function (inp_id, key) {
        if (key == "id") {
            return;
        }

        var inlInput = $("#" + inp_id)[0];
        if (inlInput) {
            $(inlInput).show().focus();
        } else {
            alert("Not editable!");
        }
    };

    $scope.inlineUpdate = function (tableObj, key, inp_id) {
        var inp = $("#" + inp_id);
        $(inp).hide();
    };

    $scope.showTabToggle = function (idx) {
        var tmpShowTab = !$scope.showFilterTabs[idx];
        $scope.showFilterTabs = [];
        $scope.showFilterTabs[idx] = tmpShowTab;
    };

    $scope.downloaderGo = function (method) {
        var TableKeysObj = {};
        var query = {};
        angular.copy($scope.selectedTableData[0], TableKeysObj);
        TableKeysObj.tableName = $scope.selectedTableName;
        delete TableKeysObj["$$hashKey"];
        delete TableKeysObj["isFilter"];
        delete TableKeysObj["tableName"];

        if ($scope.searchKeyword) {
            query.searchKeyword = $scope.searchKeyword;
        }

        if ($scope.selectedTableName == 'st') {
            if ($('#frm-search-address').is(':visible')) {
                query.opt = 'address';
                query.street = $("#frm-address").val();
                query.city = $("#frm-city").val();
                query.state = $("#frm-state").val();
                query.county = $("#frm-county").val();
            } else if ($('#frm-search-latlng').is(':visible')) {
                query.opt = 'lat';
                query.lat_dec = $("#frm-dec-lat").val();
                query.long_dec = $("#frm-dec-lng").val();
                query.distance = $("#frm-dec-radius").val();
            }
        }

        $('#downloader_tableName').val($scope.selectedTableName);
        $('#downloader_method').val(method);
        $('#downloader_query').val(JSON.stringify(query));
        $('#downloader_fields').val(JSON.stringify(TableKeysObj));
        $('#downloader_filters').val(JSON.stringify($scope.filterData));
        $('#downloader_visibleColumns').val(JSON.stringify($scope.visibleColumns));
        $('#downloader_form').submit();
    };

    $scope.openPrintDialog = function () {
        $scope.loadingfromserver = true;

        var TableKeysObj = {};
        var query = {};
        angular.copy($scope.selectedTableData[0], TableKeysObj);
        TableKeysObj.tableName = $scope.selectedTableName;
        delete TableKeysObj["$$hashKey"];
        delete TableKeysObj["isFilter"];
        delete TableKeysObj["tableName"];

        if ($scope.searchKeyword) {
            query.searchKeyword = $scope.searchKeyword;
        }

        if ($scope.selectedTableName == 'st') {
            if ($('#frm-search-address').is(':visible')) {
                query.opt = 'address';
                query.street = $("#frm-address").val();
                query.city = $("#frm-city").val();
                query.state = $("#frm-state").val();
                query.county = $("#frm-county").val();
            } else if ($('#frm-search-latlng').is(':visible')) {
                query.opt = 'lat';
                query.lat_dec = $("#frm-dec-lat").val();
                query.long_dec = $("#frm-dec-lng").val();
                query.distance = $("#frm-dec-radius").val();
            }
        }

        API.changePage($scope.selectedTableName, 0, 0, query, TableKeysObj, $scope.filterData).then(function (response) {
            if (response.status == 200 && response.data.key.length > 0) {
                var selectedTableData = response.data.data;
                console.log(selectedTableData);

                var html = "<table style='border-collapse: collapse;' width=\"100%\" page-break-inside: auto;>";
                var titles = Object.keys(selectedTableData[0]);
                delete titles["$$hashKey"];
                delete titles["isFilter"];

                html += "<thead><tr>";
                for (var m = 0; m < titles.length; m++) {
                    if ($scope.checkVisible(titles[m])) {
                        html += "<th style='border: solid 1px #000;padding: 3px 5px;background-color: #AAA;'>" + $scope.getColumnName(titles[m]) + "</th>";
                    }
                }
                html += "</tr></thead>";

                html += "<tbody>";
                for (var i = 0; i < selectedTableData.length; i++) {
                    html += "<tr>";
                    var row = selectedTableData[i];
                    delete titles["$$hashKey"];
                    delete titles["isFilter"];
                    var row_keys = Object.keys(row);
                    for (var j = 0; j < row_keys.length; j++) {
                        if ($scope.checkVisible(row_keys[j])) {
                            html += "<td style='border: solid 1px #000;padding: 3px 5px;'>" + (row[row_keys[j]] !== null ? row[row_keys[j]] : "") + "</td>";
                        }
                    }
                    html += "</tr>";
                }
                html += "</tbody>";
                html += "</table>";

                $("#div-print").html(html);

                $scope.loadingfromserver = false;
                window.print();
            } else {
                $scope.selectedTableData = response.data.data;
                $scope.selectedTableRows = 0;
                if (response.data.msg) {
                    alert(response.data.msg);
                } else {
                    alert("Please Try again Later " + response.statusText);
                }
                $scope.loadingfromserver = false;
            }
        });
    };

    $scope.addRowInline = function (addObj) {
        $scope.showAddRow = false;

        var selectedTableObj = {};
        angular.copy($scope.addObj, selectedTableObj);
        selectedTableObj.tableName = $scope.selectedTableName;
        delete selectedTableObj["$$hashKey"];
        delete selectedTableObj["isFilter"];
        var strParams = "";
        for (var key in selectedTableObj) {
            strParams += key + '=' + selectedTableObj[key] + '&';
        }
        API.addRow(strParams).then(function (response) {
            if (response.data.hasOwnProperty("error") && response.data.error) {
                alert(response.data.msg);
            } else {
                $scope.addObj.id = response.data.last_id;
                $scope.selectedTableData.push($scope.addObj);

                angular.copy($scope.selectedTableData[0], $scope.addObj);
                setAllNullObj($scope.addObj);

                alert(response.data.msg);
            }
        });
    };

    $scope.frmSearchAddresIsVisible = function () {
        return $('#frm-search-address').is(':visible');
    };
}]);

/***/ })

/******/ });