webpackHotUpdate_N_E("pages/index",{

/***/ "./components/Layout.js":
/*!******************************!*\
  !*** ./components/Layout.js ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(module) {/* harmony import */ var _babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/classCallCheck */ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/esm/createClass */ "./node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/esm/assertThisInitialized */ "./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js");
/* harmony import */ var _babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inherits */ "./node_modules/@babel/runtime/helpers/esm/inherits.js");
/* harmony import */ var _babel_runtime_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/esm/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js");
/* harmony import */ var _babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @babel/runtime/helpers/esm/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js");
/* harmony import */ var _babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @babel/runtime/helpers/esm/defineProperty */ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! next/head */ "./node_modules/next/dist/next-server/lib/head.js");
/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(next_head__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _Header__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./Header */ "./components/Header.js");
/* harmony import */ var _LoadingScreen__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./LoadingScreen */ "./components/LoadingScreen.js");







var __jsx = react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement;

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = Object(_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_5__["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = Object(_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_5__["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return Object(_babel_runtime_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_4__["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }






var Layout = /*#__PURE__*/function (_React$Component) {
  Object(_babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_3__["default"])(Layout, _React$Component);

  var _super = _createSuper(Layout);

  function Layout(props) {
    var _this;

    Object(_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_0__["default"])(this, Layout);

    _this = _super.call(this, props);

    Object(_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_6__["default"])(Object(_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_2__["default"])(_this), "updateState", function () {
      _this.setState({
        allMounted: true
      });
    });

    _this.state = {
      allMounted: false
    };

    try {
      ethereum.on('accountsChanged', function (_accounts) {
        location.reload();
        ethereum.on('chainChanged', function (chainId) {
          location.reload();
        });
      });
    } catch (_unused) {}

    return _this;
  }

  Object(_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_1__["default"])(Layout, [{
    key: "render",
    value: function render() {
      return __jsx("div", null, __jsx(next_head__WEBPACK_IMPORTED_MODULE_8___default.a, null, __jsx("link", {
        rel: "stylesheet",
        href: "//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css"
      }), __jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1.0"
      }), __jsx("title", null, "Crypto Byte"), __jsx("link", {
        rel: "shortcut icon",
        type: "image/ico",
        href: "/static/favicon.ico"
      }), __jsx("meta", {
        charSet: "UTF-8"
      }), __jsx("meta", {
        name: "description",
        content: "Official website of Crypto Byte."
      })), __jsx("style", null, "\nhtml, body {\n  background-color: #03080c;\n  scroll-behavior: smooth;\n}\n          "), !this.props.isHome ? __jsx("style", null, "\nhtml, body {\n  background: linear-gradient(to top, #111, #333);\n  background-attachment: fixed;\n}\n          ") : '', !this.state.allMounted && __jsx(_LoadingScreen__WEBPACK_IMPORTED_MODULE_10__["default"], null), __jsx(_Header__WEBPACK_IMPORTED_MODULE_9__["default"], {
        mounted: this.props.mounted,
        updateState: this.updateState
      }), this.state.allMounted && this.props.children);
    }
  }]);

  return Layout;
}(react__WEBPACK_IMPORTED_MODULE_7___default.a.Component);

/* harmony default export */ __webpack_exports__["default"] = (Layout);

;
    var _a, _b;
    // Legacy CSS implementations will `eval` browser code in a Node.js context
    // to extract CSS. For backwards compatibility, we need to check we're in a
    // browser context before continuing.
    if (typeof self !== 'undefined' &&
        // AMP / No-JS mode does not inject these helpers:
        '$RefreshHelpers$' in self) {
        var currentExports = module.__proto__.exports;
        var prevExports = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevExports) !== null && _b !== void 0 ? _b : null;
        // This cannot happen in MainTemplate because the exports mismatch between
        // templating and execution.
        self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.i);
        // A module can be accepted automatically based on its exports, e.g. when
        // it is a Refresh Boundary.
        if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {
            // Save the previous exports on update so we can compare the boundary
            // signatures.
            module.hot.dispose(function (data) {
                data.prevExports = currentExports;
            });
            // Unconditionally accept an update to this module, we'll check if it's
            // still a Refresh Boundary later.
            module.hot.accept();
            // This field is set when the previous version of this module was a
            // Refresh Boundary, letting us know we need to check for invalidation or
            // enqueue an update.
            if (prevExports !== null) {
                // A boundary can become ineligible if its exports are incompatible
                // with the previous exports.
                //
                // For example, if you add/remove/change exports, we'll want to
                // re-execute the importing modules, and force those components to
                // re-render. Similarly, if you convert a class component to a
                // function, we want to invalidate the boundary.
                if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevExports, currentExports)) {
                    module.hot.invalidate();
                }
                else {
                    self.$RefreshHelpers$.scheduleUpdate();
                }
            }
        }
        else {
            // Since we just executed the code for the module, it's possible that the
            // new exports made it ineligible for being a boundary.
            // We only care about the case when we were _previously_ a boundary,
            // because we already accepted this update (accidental side effect).
            var isNoLongerABoundary = prevExports !== null;
            if (isNoLongerABoundary) {
                module.hot.invalidate();
            }
        }
    }

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node_modules/webpack/buildin/harmony-module.js */ "./node_modules/webpack/buildin/harmony-module.js")(module)))

/***/ })

})
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9fTl9FLy4vY29tcG9uZW50cy9MYXlvdXQuanMiXSwibmFtZXMiOlsiTGF5b3V0IiwicHJvcHMiLCJzZXRTdGF0ZSIsImFsbE1vdW50ZWQiLCJzdGF0ZSIsImV0aGVyZXVtIiwib24iLCJfYWNjb3VudHMiLCJsb2NhdGlvbiIsInJlbG9hZCIsImNoYWluSWQiLCJpc0hvbWUiLCJtb3VudGVkIiwidXBkYXRlU3RhdGUiLCJjaGlsZHJlbiIsIlJlYWN0IiwiQ29tcG9uZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7O0lBRU1BLE07Ozs7O0FBQ0osa0JBQVlDLEtBQVosRUFBbUI7QUFBQTs7QUFBQTs7QUFDakIsOEJBQU1BLEtBQU47O0FBRGlCLHNOQWFMLFlBQU07QUFDbEIsWUFBS0MsUUFBTCxDQUFjO0FBQUVDLGtCQUFVLEVBQUU7QUFBZCxPQUFkO0FBQ0QsS0Fma0I7O0FBRWpCLFVBQUtDLEtBQUwsR0FBYTtBQUFFRCxnQkFBVSxFQUFFO0FBQWQsS0FBYjs7QUFDQSxRQUFJO0FBQ0ZFLGNBQVEsQ0FBQ0MsRUFBVCxDQUFZLGlCQUFaLEVBQStCLFVBQUNDLFNBQUQsRUFBZTtBQUM1Q0MsZ0JBQVEsQ0FBQ0MsTUFBVDtBQUNBSixnQkFBUSxDQUFDQyxFQUFULENBQVksY0FBWixFQUE0QixVQUFDSSxPQUFELEVBQWE7QUFDdkNGLGtCQUFRLENBQUNDLE1BQVQ7QUFDRCxTQUZEO0FBR0QsT0FMRDtBQU1ELEtBUEQsQ0FPRSxnQkFBTSxDQUFFOztBQVZPO0FBV2xCOzs7OzZCQU1RO0FBQ1AsYUFDRSxtQkFDRSxNQUFDLGdEQUFELFFBQ0U7QUFDRSxXQUFHLEVBQUMsWUFETjtBQUVFLFlBQUksRUFBQztBQUZQLFFBREYsRUFLRTtBQUNFLFlBQUksRUFBQyxVQURQO0FBRUUsZUFBTyxFQUFDO0FBRlYsUUFMRixFQVNFLG1DQVRGLEVBVUU7QUFDRSxXQUFHLEVBQUMsZUFETjtBQUVFLFlBQUksRUFBQyxXQUZQO0FBR0UsWUFBSSxFQUFDO0FBSFAsUUFWRixFQWVFO0FBQU0sZUFBTyxFQUFDO0FBQWQsUUFmRixFQWdCRTtBQUFNLFlBQUksRUFBQyxhQUFYO0FBQXlCLGVBQU8sRUFBQztBQUFqQyxRQWhCRixDQURGLEVBbUJFLCtHQW5CRixFQTRCRyxDQUFDLEtBQUtSLEtBQUwsQ0FBV1UsTUFBWixHQUNDLDBJQURELEdBVUMsRUF0Q0osRUF5Q0csQ0FBQyxLQUFLUCxLQUFMLENBQVdELFVBQVosSUFBMEIsTUFBQyx1REFBRCxPQXpDN0IsRUEwQ0UsTUFBQywrQ0FBRDtBQUFRLGVBQU8sRUFBRSxLQUFLRixLQUFMLENBQVdXLE9BQTVCO0FBQXFDLG1CQUFXLEVBQUUsS0FBS0M7QUFBdkQsUUExQ0YsRUE0Q0csS0FBS1QsS0FBTCxDQUFXRCxVQUFYLElBQXlCLEtBQUtGLEtBQUwsQ0FBV2EsUUE1Q3ZDLENBREY7QUFnREQ7Ozs7RUFuRWtCQyw0Q0FBSyxDQUFDQyxTOztBQXNFWmhCLHFFQUFmIiwiZmlsZSI6InN0YXRpYy93ZWJwYWNrL3BhZ2VzL2luZGV4LmZiZGU1OGM4NTFhNDEwMDBmOTczLmhvdC11cGRhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgSGVhZCBmcm9tICduZXh0L2hlYWQnO1xyXG5pbXBvcnQgSGVhZGVyIGZyb20gJy4vSGVhZGVyJztcclxuaW1wb3J0IExvYWRpbmdTY3JlZW4gZnJvbSAnLi9Mb2FkaW5nU2NyZWVuJztcclxuXHJcbmNsYXNzIExheW91dCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgIHN1cGVyKHByb3BzKTtcclxuICAgIHRoaXMuc3RhdGUgPSB7IGFsbE1vdW50ZWQ6IGZhbHNlIH07XHJcbiAgICB0cnkge1xyXG4gICAgICBldGhlcmV1bS5vbignYWNjb3VudHNDaGFuZ2VkJywgKF9hY2NvdW50cykgPT4ge1xyXG4gICAgICAgIGxvY2F0aW9uLnJlbG9hZCgpO1xyXG4gICAgICAgIGV0aGVyZXVtLm9uKCdjaGFpbkNoYW5nZWQnLCAoY2hhaW5JZCkgPT4ge1xyXG4gICAgICAgICAgbG9jYXRpb24ucmVsb2FkKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaCB7fVxyXG4gIH1cclxuXHJcbiAgdXBkYXRlU3RhdGUgPSAoKSA9PiB7XHJcbiAgICB0aGlzLnNldFN0YXRlKHsgYWxsTW91bnRlZDogdHJ1ZSB9KTtcclxuICB9O1xyXG5cclxuICByZW5kZXIoKSB7XHJcbiAgICByZXR1cm4gKFxyXG4gICAgICA8ZGl2PlxyXG4gICAgICAgIDxIZWFkPlxyXG4gICAgICAgICAgPGxpbmtcclxuICAgICAgICAgICAgcmVsPVwic3R5bGVzaGVldFwiXHJcbiAgICAgICAgICAgIGhyZWY9XCIvL2Nkbi5qc2RlbGl2ci5uZXQvbnBtL3NlbWFudGljLXVpQDIuNC4yL2Rpc3Qvc2VtYW50aWMubWluLmNzc1wiXHJcbiAgICAgICAgICAvPlxyXG4gICAgICAgICAgPG1ldGFcclxuICAgICAgICAgICAgbmFtZT1cInZpZXdwb3J0XCJcclxuICAgICAgICAgICAgY29udGVudD1cIndpZHRoPWRldmljZS13aWR0aCwgaW5pdGlhbC1zY2FsZT0xLjBcIlxyXG4gICAgICAgICAgLz5cclxuICAgICAgICAgIDx0aXRsZT5DcnlwdG8gQnl0ZTwvdGl0bGU+XHJcbiAgICAgICAgICA8bGlua1xyXG4gICAgICAgICAgICByZWw9XCJzaG9ydGN1dCBpY29uXCJcclxuICAgICAgICAgICAgdHlwZT1cImltYWdlL2ljb1wiXHJcbiAgICAgICAgICAgIGhyZWY9XCIvc3RhdGljL2Zhdmljb24uaWNvXCJcclxuICAgICAgICAgIC8+XHJcbiAgICAgICAgICA8bWV0YSBjaGFyU2V0PVwiVVRGLThcIiAvPlxyXG4gICAgICAgICAgPG1ldGEgbmFtZT1cImRlc2NyaXB0aW9uXCIgY29udGVudD1cIk9mZmljaWFsIHdlYnNpdGUgb2YgQ3J5cHRvIEJ5dGUuXCIgLz5cclxuICAgICAgICA8L0hlYWQ+XHJcbiAgICAgICAgPHN0eWxlPlxyXG4gICAgICAgICAge2BcclxuaHRtbCwgYm9keSB7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogIzAzMDgwYztcclxuICBzY3JvbGwtYmVoYXZpb3I6IHNtb290aDtcclxufVxyXG4gICAgICAgICAgYH1cclxuICAgICAgICA8L3N0eWxlPlxyXG5cclxuICAgICAgICB7IXRoaXMucHJvcHMuaXNIb21lID8gKFxyXG4gICAgICAgICAgPHN0eWxlPlxyXG4gICAgICAgICAgICB7YFxyXG5odG1sLCBib2R5IHtcclxuICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQodG8gdG9wLCAjMTExLCAjMzMzKTtcclxuICBiYWNrZ3JvdW5kLWF0dGFjaG1lbnQ6IGZpeGVkO1xyXG59XHJcbiAgICAgICAgICBgfVxyXG4gICAgICAgICAgPC9zdHlsZT5cclxuICAgICAgICApIDogKFxyXG4gICAgICAgICAgJydcclxuICAgICAgICApfVxyXG5cclxuICAgICAgICB7IXRoaXMuc3RhdGUuYWxsTW91bnRlZCAmJiA8TG9hZGluZ1NjcmVlbiAvPn1cclxuICAgICAgICA8SGVhZGVyIG1vdW50ZWQ9e3RoaXMucHJvcHMubW91bnRlZH0gdXBkYXRlU3RhdGU9e3RoaXMudXBkYXRlU3RhdGV9IC8+XHJcblxyXG4gICAgICAgIHt0aGlzLnN0YXRlLmFsbE1vdW50ZWQgJiYgdGhpcy5wcm9wcy5jaGlsZHJlbn1cclxuICAgICAgPC9kaXY+XHJcbiAgICApO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgTGF5b3V0O1xyXG4iXSwic291cmNlUm9vdCI6IiJ9