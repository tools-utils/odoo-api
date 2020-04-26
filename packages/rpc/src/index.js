import axios from 'axios'

class Odoo {
  constructor(options) {
    const { baseURL } = options
    this.httpClient = axios.create({ baseURL })
  }

  getHeaders(options) {
    let headers = {}
    if (options) {
      headers['Cookie'] = options.cookie || ''
      headers['X-Openerp-Session-Id'] = options.sessionId || ''
    }
    return headers
  }

  getOption(options, key, defval) {
    let context = {}
    if (options) context = options[key] || defval
    return context
  }

  async post({ method, params }, options) {
    const body = { jsonrpc: '2.0', method: 'call', params }
    const headers = this.getHeaders(options)

    return await this.httpClient.post(method, body, { headers })
  }

  async callkw({ model, method, args, kwargs = {} }, options) {
    const context = this.getOption(options, 'context', {})
    const cookie = this.getOption(options, 'cookie', '')
    const sessionId = this.getOption(options, 'sessionId', '')

    const params = { model, method, args, kwargs: { context, ...kwargs } }

    return await this.post({ method: '/web/dataset/call_kw', params }, { cookie, sessionId })
  }

  async auth({ db, login, password }) {
    const method = `/web/session/authenticate`
    const params = { db, login, password, context: {} }
    //username, user_context, uid, company_id, session_id, partner_id
    return await this.post({ method, params })
  }

  async read({ model, ids }, options) {
    const method = 'read'
    const args = [ids]
    return await this.callkw({ model, method, args, kwargs: {} }, options)
  }

  async readGroup({ model, domain, fields, groupby, kwargs = {} }, options) {
    const method = 'read_group'
    const args = [domain, fields, groupby]
    return await this.callkw({ model, method, args, kwargs }, options)
  }

  async search({ model, domain, kwargs = {} }, options) {
    const method = 'search'
    const args = [domain]
    return await this.callkw({ model, method, args, kwargs }, options)
  }

  async searchRead({ model, domain, fields, kwargs = {} }, options) {
    const method = 'search_read'
    kwargs = { domain, fields, ...kwargs }
    return await this.callkw({ model, method, args: [] , kwargs }, options)
  }

  async create({ model, data }, options) {
    const method = 'create'
    return await this.callkw({ model, method, args: [data] }, options)
  }

  async delete({ model, ids }, options) {
    const method = 'unlink'
    const args = [ids]
    return await this.callkw({ model, method, args }, options)
  }

  async update({ model, id, data }, options) {
    const method = 'write'
    const args = [[id], data]
    return await this.callkw({ model, method, args }, options)
  }

  async fieldsGet({ model, fields = [], attributes = {} }, options) {
    const method = 'fields_get'
    const args = [fields]
    const kwargs = attributes
    return this.callkw({ model, method, args, kwargs }, options)
  }

  async count({model, domain = [], kwargs = {} }, options) {
    const method = 'search_count'
    const args = [domain]
    return await this.callkw({ model, method, args, kwargs }, options)
  }

  async infos({}) {
    
  }
}

export default Odoo