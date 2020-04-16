"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _odooRpc = _interopRequireDefault(require("@tools-utils/odoo-rpc"));

var _odooApi = _interopRequireDefault(require("@tools-utils/odoo-api"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  rpc: _odooRpc.default,
  api: _odooApi.default
};
exports.default = _default;