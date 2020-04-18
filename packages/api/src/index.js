import micro from 'micro'
import { router, get, post, put, del } from 'microrouter'
import Odoo from '@tools-utils/odoo-rpc'

const baseURL = process.env.ODOO_HOST || 'http://0.0.0.0:8069'
const odoo = new Odoo({ baseURL })

const getToken = (req) => {
  const token = req.headers['Authorization'] || req.headers['authorization']
  if (!token) throw new Error('Missing access token')
  return token
}

const getSessionId = (req) => {
  return getToken(req)
}

const getOptions = (req) => {
  const { query } = req
  const token = getToken(req)
  const sessionId = getSessionId(req)
  const { lang, tz, uid } = query || {}
  const context = { lang, tz, uid }
  return { cookie: token, context, sessionId }
}

const auth = async (req, res) => {
  const body = await micro.json(req)
  const { db, login, password } = body  
  const resp = await odoo.auth({ db, login, password })

  micro.send(res, resp.status, resp.data)
}

// ?id=1&id=2
const findByIds = async (req, res) => {
  const { params, query } = req
  const { model } = params
  const { id } = query
  // makes sure ids are numbers
  const ids = id.map(v => Number(v))

  const resp = await odoo.read({ model, ids }, getOptions(req))
  micro.send(res, resp.status, resp.data)
}

const search = async (req, res) => {
  const { params, query } = req
  const domain = query.domain ? JSON.parse(query.domain) : []
  const limit = query.limit ? Number(query.limit) : 200
  const order = query.order || 'id asc'

  const { model } = params
  const kwargs = {
    limit,
    order
  }
  const resp = await odoo.search({ model, domain, kwargs }, getOptions(req))
  micro.send(res, resp.status, resp.data)
}

const searchRead = async (req, res) => {
  const { params, query } = req
  const domain = query.domain ? JSON.parse(query.domain) : []
  const fields = query.fields ? JSON.parse(query.fields) : []
  const limit = query.limit ? Number(query.limit) : 200
  const order = query.order || 'id asc'

  const { model } = params
  const kwargs = {
    limit,
    order
  }
  const resp = await odoo.searchRead({ model, domain, fields, kwargs }, getOptions(req))
  micro.send(res, resp.status, resp.data)
}

const getOne = async (req, res) => {
  const { params } = req
  const { model, id } = params
  const resp = await odoo.read({ model, ids: [Number(id)] }, getOptions(req))
  micro.send(res, resp.status, resp.data)
}

// ?domain=title&order=id asc0&limit=24
const getMany = async (req, res) => {
  const { query } = req
  if (query.id) {
    return await findByIds(req, res)
  }
  if (query.fields) {
    return await searchRead(req, res)
  }
  return await search(req, res)
}

const create = async (req, res) => {
  const { params } = req
  const { model } = params

  const body = await micro.json(req)
  const resp = await odoo.create({ model, data: body }, getOptions(req))
  micro.send(res, resp.status, resp.data)
}

const update = async (req, res) => {
  const { params } = req
  const { model, id } = params
  const body = await micro.json(req)
  const resp = await odoo.update({ model, id: Number(id), data: body }, getOptions(req))

  micro.send(res, resp.status, resp.data)
}

const remove = async (req, res) => {
  const { params } = req
  const { model, id } = params

  const resp = await odoo.del({ model, id: Number(id) }, getOptions(req))
  micro.send(res, resp.status, resp.data)
}

const notfound = (req, res) => micro.send(res, 200, new Date())

const APIs = [
  post('/auth', auth),
  get('/:model/:id', getOne),
  get('/:model/', getMany),
  post('/:model', create),
  put('/:model/:id', update),
  del('/:model/:id', remove),
  get('/*', notfound)    
]

const server = micro(router(...APIs))
export default server