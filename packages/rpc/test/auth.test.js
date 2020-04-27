import assert from 'assert'
import Odoo from '../src/index'
import settings from './settings'
import handleError from './handle-error'
import getSessionId from './get-session-id'

describe('Test authentication', () => {
  it('Should return valid uid & session_id', async () => {
    const odoo = new Odoo({ baseURL: settings.baseURL })
    try {
      const resp = await odoo.auth(settings)
      let sessionId = getSessionId(resp)
    
      assert.equal(resp.status, 200)
      assert.equal(resp.statusText, 'OK')

      assert.ok(resp.data)
      assert.ok(resp.data.result)
      assert.ok(resp.data.result.uid)

      assert.ok(sessionId, 'seesion_id not available')
    } catch (error) {
      handleError(error)
    }
  })
})