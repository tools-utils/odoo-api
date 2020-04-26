import assert from 'assert'
import Odoo from '../src/index'
import settings from './settings'
import handleError from './handle-error'

const odoo = new Odoo({ baseURL: settings.baseURL })
let cookie
let context
let sessionId
describe('Test get fields', () => {
  before(async () => {
    let resp = await odoo.auth(settings)
    assert.ok(resp.data.result.uid)
    assert.ok(resp.data.result.session_id)

    const context = resp.data.result.user_context

    const sessionId = resp.data.result.session_id
    cookie = `session_id=${sessionId}`
  })

  it('Should return fields', async () => {
    try {
      const model = 'res.partner'
      const fields = []
      const attributes = {}

      const resp = await odoo.fieldsGet({ model, fields, attributes }, { context, cookie, sessionId })

      assert.equal(resp.status, 200)
      assert.equal(resp.statusText, 'OK')

      assert.ok(resp.data)
      assert.ok(resp.data.result)

    } catch (error) {
      handleError(error)
    }
  })
})