import assert from 'assert'
import Odoo from '../src/index'
import settings from './settings'
import handleError from './handle-error'

const odoo = new Odoo({ baseURL: settings.baseURL })

describe('Test read method', () => {
  it('Should return valid uid', async () => {
    try {
      let resp = await odoo.auth(settings)
      assert.ok(resp.data.result.uid)
      assert.ok(resp.data.result.session_id)
      const context = resp.data.result.user_context

      const sessionId = resp.data.result.session_id
      let cookie = `session_id=${sessionId}`

      resp = await odoo.read({ model: 'res.partner', ids: [1, 2] }, { context, cookie, sessionId })

      assert.equal(resp.status, 200)
      assert.equal(resp.statusText, 'OK')

      assert.ok(resp.data)
      assert.equal(resp.data.result)
    } catch (error) {
      handleError(error)
    }
  })
})