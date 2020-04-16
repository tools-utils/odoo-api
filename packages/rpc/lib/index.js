"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

class Odoo {
  constructor(options) {
    const {
      baseURL
    } = options;
    this.httpClient = _axios.default.create({
      baseURL
    });
  }

  getHeaders(options) {
    let headers = {};

    if (options) {
      headers['Cookie'] = options.cookie || '';
      headers['X-Openerp-Session-Id'] = options.sessionId || '';
    }

    return headers;
  }

  getOption(options, key, defval) {
    let context = {};
    if (options) context = options[key] || defval;
    return context;
  }

  post({
    method,
    params
  }, options) {
    var _this = this;

    return _asyncToGenerator(function* () {
      const body = {
        jsonrpc: '2.0',
        method: 'call',
        params
      };

      const headers = _this.getHeaders(options);

      return yield _this.httpClient.post(method, body, {
        headers
      });
    })();
  }

  callkw({
    model,
    method,
    args,
    kwargs = {}
  }, options) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      const context = _this2.getOption(options, 'context', {});

      const cookie = _this2.getOption(options, 'cookie', '');

      const sessionId = _this2.getOption(options, 'sessionId', '');

      const params = {
        model,
        method,
        args,
        kwargs: {
          context,
          ...kwargs
        }
      };
      return yield _this2.post({
        method: '/web/dataset/call_kw',
        params
      }, {
        cookie,
        sessionId
      });
    })();
  }

  auth({
    db,
    login,
    password
  }) {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      const method = `/web/session/authenticate`;
      const params = {
        db,
        login,
        password,
        context: {}
      }; //username, user_context, uid, company_id, session_id, partner_id

      return yield _this3.post({
        method,
        params
      });
    })();
  }

  read({
    model,
    ids
  }, options) {
    var _this4 = this;

    return _asyncToGenerator(function* () {
      const method = 'read';
      const args = [ids];
      return yield _this4.callkw({
        model,
        method,
        args,
        kwargs: {}
      }, options);
    })();
  }

  readGroup({
    model,
    domain,
    fields,
    groupby,
    kwargs = {}
  }, options) {
    var _this5 = this;

    return _asyncToGenerator(function* () {
      const method = 'read_group';
      const args = [domain, fields, groupby];
      return yield _this5.callkw({
        model,
        method,
        args,
        kwargs
      }, options);
    })();
  }

  search({
    model,
    domain,
    kwargs = {}
  }, options) {
    var _this6 = this;

    return _asyncToGenerator(function* () {
      const method = 'search';
      const args = [domain];
      return yield _this6.callkw({
        model,
        method,
        args,
        kwargs
      }, options);
    })();
  }

  searchRead({
    model,
    domain,
    fields,
    kwargs = {}
  }, options) {
    var _this7 = this;

    return _asyncToGenerator(function* () {
      const method = 'search_read';
      kwargs = {
        domain,
        fields,
        ...kwargs
      };
      return yield _this7.callkw({
        model,
        method,
        args: [],
        kwargs
      }, options);
    })();
  }

  create({
    model,
    data
  }, options) {
    var _this8 = this;

    return _asyncToGenerator(function* () {
      const method = 'create';
      return yield _this8.callkw({
        model,
        method,
        args: [data]
      }, options);
    })();
  }

  delete({
    model,
    ids
  }, options) {
    var _this9 = this;

    return _asyncToGenerator(function* () {
      const method = 'unlink';
      const args = [ids];
      return yield _this9.callkw({
        model,
        method,
        args
      }, options);
    })();
  }

  update({
    model,
    id,
    data
  }, options) {
    var _this10 = this;

    return _asyncToGenerator(function* () {
      const method = 'write';
      const args = [[id], data];
      return yield _this10.callkw({
        model,
        method,
        args
      }, options);
    })();
  }

  fieldsGet({
    model,
    fields = [],
    attributes = {}
  }, options) {
    var _this11 = this;

    return _asyncToGenerator(function* () {
      const method = 'fields_get';
      const args = [fields];
      const kwargs = attributes;
      return _this11.callkw({
        model,
        method,
        args,
        kwargs
      }, options);
    })();
  }

  count({
    model,
    domain = [],
    kwargs = {}
  }, options) {
    var _this12 = this;

    return _asyncToGenerator(function* () {
      const method = 'search_count';
      const args = [domain];
      return yield _this12.callkw({
        model,
        method,
        args,
        kwargs
      }, options);
    })();
  }

}

var _default = Odoo;
exports.default = _default;