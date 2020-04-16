import assert from 'assert'
import Odoo from '../src/index'
import settings from './settings'
import handleError from './handle-error'

describe('Test authentication', () => {
  it('Should return valid uid', async () => {
    const odoo = new Odoo({ baseURL: settings.baseURL })
    try {
      const resp = await odoo.auth(settings)

      assert.equal(resp.status, 200)
      assert.equal(resp.statusText, 'OK')

      assert.ok(resp.data)
      assert.ok(resp.data.result)
      assert.ok(resp.data.result.uid)
    } catch (error) {
      handleError(error)
    }
  })
})