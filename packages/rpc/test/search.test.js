import assert from 'assert'
import Odoo from '../src/index'
import settings from './settings'
import handleError from './handle-error'
import getSessionId from './get-session-id'

const odoo = new Odoo({ baseURL: settings.baseURL })

describe('Test search method', () => {
  it('Should return valid result', async () => {
    try {
      let resp = await odoo.auth(settings)
      assert.ok(resp.data.result.uid)
      
      const sessionId = getSessionId(resp)
      assert.ok(sessionId)

      const context = resp.data.result.user_context

      let cookie = `session_id=${sessionId}`
      const domain = [ [ 'create_date', '>', '2019-01-01' ], [ 'create_date', '<', '2019-12-31' ] ]
      const kwargs = {
        limit: 10,
        order: 'id asc'
      }
      const model = 'res.partner'
      resp = await odoo.search({ model, domain, kwargs }, { context, cookie, sessionId })

      assert.equal(resp.status, 200)
      assert.equal(resp.statusText, 'OK')

      assert.ok(resp.data)
      assert.ok(resp.data.result)
    } catch (error) {
      handleError(error)
    }
  })
})