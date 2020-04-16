"use strict";

var _odoo = _interopRequireDefault(require("@tools-utils/odoo"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const port = 9000;

_odoo.default.api.listen(port);

console.log('Starting Odoo REST API...', port);