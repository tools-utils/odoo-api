"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _micro = _interopRequireDefault(require("micro"));

var _microrouter = require("microrouter");

var _odooRpc = _interopRequireDefault(require("@tools-utils/odoo-rpc"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

const baseURL = process.env.ODOO_HOST || 'http://0.0.0.0:8069';
const odoo = new _odooRpc.default({
  baseURL
});

const getToken = req => {
  const token = req.headers['Authorization'] || req.headers['authorization'];
  if (!token) throw new Error('Missing access token');
  return token;
};

const getSessionId = req => {
  return getToken(req);
};

const getOptions = req => {
  const {
    query
  } = req;
  const token = getToken(req);
  const sessionId = getSessionId(req);
  const {
    lang,
    tz,
    uid
  } = query || {};
  const context = {
    lang,
    tz,
    uid
  };
  return {
    cookie: token,
    context,
    sessionId
  };
};

const auth = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(function* (req, res) {
    const body = yield _micro.default.json(req);
    const {
      db,
      login,
      password
    } = body;
    const resp = yield odoo.auth({
      db,
      login,
      password
    });

    _micro.default.send(res, resp.status, resp.data);
  });

  return function auth(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}(); // ?id=1&id=2


const findByIds = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(function* (req, res) {
    const {
      params,
      query
    } = req;
    const {
      model
    } = params;
    const {
      id
    } = query; // makes sure ids are numbers

    const ids = id.map(v => Number(v));
    const resp = yield odoo.read({
      model,
      ids
    }, getOptions(req));

    _micro.default.send(res, resp.status, resp.data);
  });

  return function findByIds(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

const search = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator(function* (req, res) {
    const {
      params,
      query
    } = req;
    const domain = query.domain ? JSON.parse(query.domain) : [];
    const limit = query.limit ? Number(query.limit) : 200;
    const order = query.order || 'id asc';
    const {
      model
    } = params;
    const kwargs = {
      limit,
      order
    };
    const resp = yield odoo.search({
      model,
      domain,
      kwargs
    }, getOptions(req));

    _micro.default.send(res, resp.status, resp.data);
  });

  return function search(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

const searchRead = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator(function* (req, res) {
    const {
      params,
      query
    } = req;
    const domain = query.domain ? JSON.parse(query.domain) : [];
    const fields = query.fields ? JSON.parse(query.fields) : [];
    const limit = query.limit ? Number(query.limit) : 200;
    const order = query.order || 'id asc';
    const {
      model
    } = params;
    const kwargs = {
      limit,
      order
    };
    const resp = yield odoo.searchRead({
      model,
      domain,
      fields,
      kwargs
    }, getOptions(req));

    _micro.default.send(res, resp.status, resp.data);
  });

  return function searchRead(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();

const getOne = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator(function* (req, res) {
    const {
      params
    } = req;
    const {
      model,
      id
    } = params;
    const resp = yield odoo.read({
      model,
      ids: [Number(id)]
    }, getOptions(req));

    _micro.default.send(res, resp.status, resp.data);
  });

  return function getOne(_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}(); // ?domain=title&order=id asc0&limit=24


const getMany = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator(function* (req, res) {
    const {
      query
    } = req;

    if (query.id) {
      return yield findByIds(req, res);
    }

    if (query.fields) {
      return yield searchRead(req, res);
    }

    return yield search(req, res);
  });

  return function getMany(_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}();

const create = /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator(function* (req, res) {
    const {
      params
    } = req;
    const {
      model
    } = params;
    const body = yield _micro.default.json(req);
    const resp = yield odoo.create({
      model,
      data: body
    }, getOptions(req));

    _micro.default.send(res, resp.status, resp.data);
  });

  return function create(_x13, _x14) {
    return _ref7.apply(this, arguments);
  };
}();

const update = /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator(function* (req, res) {
    const {
      params
    } = req;
    const {
      model,
      id
    } = params;
    const body = yield _micro.default.json(req);
    const resp = yield odoo.update({
      model,
      id: Number(id),
      data: body
    }, getOptions(req));

    _micro.default.send(res, resp.status, resp.data);
  });

  return function update(_x15, _x16) {
    return _ref8.apply(this, arguments);
  };
}();

const remove = /*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator(function* (req, res) {
    const {
      params
    } = req;
    const {
      model,
      id
    } = params;
    const resp = yield odoo.del({
      model,
      id: Number(id)
    }, getOptions(req));

    _micro.default.send(res, resp.status, resp.data);
  });

  return function remove(_x17, _x18) {
    return _ref9.apply(this, arguments);
  };
}();

const APIs = [(0, _microrouter.post)('/auth', auth), (0, _microrouter.get)('/:model/:id', getOne), (0, _microrouter.get)('/:model/', getMany), (0, _microrouter.post)('/:model', create), (0, _microrouter.put)('/:model/:id', update), (0, _microrouter.del)('/:model/:id', remove)];
const server = (0, _micro.default)((0, _microrouter.router)(...APIs));
var _default = server;
exports.default = _default;