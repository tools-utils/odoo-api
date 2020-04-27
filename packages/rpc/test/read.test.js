import assert from 'assert'
import Odoo from '../src/index'
import settings from './settings'
import handleError from './handle-error'
import getSessionId from './get-session-id'

const odoo = new Odoo({ baseURL: settings.baseURL })

describe('Test read method', () => {
  it('Should return valid uid', async () => {
    try {
      let resp = await odoo.auth(settings)
      assert.ok(resp.data.result.uid)
      const context = resp.data.result.user_context

      const sessionId = getSessionId(resp)
      assert.ok(sessionId)
      let cookie = `session_id=${sessionId}`

      resp = await odoo.read({ model: 'res.partner', ids: [1, 2] }, { context, cookie, sessionId })

      assert.equal(resp.status, 200)
      assert.equal(resp.statusText, 'OK')

      assert.ok(resp.data)
      assert.ok(resp.data.result)
    } catch (error) {
      handleError(error)
    }
  })
})