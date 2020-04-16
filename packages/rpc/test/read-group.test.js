import assert from 'assert'
import Odoo from '../src/index'
import settings from './settings'
import handleError from './handle-error'

const odoo = new Odoo({ baseURL: settings.baseURL })

describe('Test read group method', () => {
  it('Should return valid report', async () => {
    try {
      let resp = await odoo.auth(settings)
      assert.ok(resp.data.result.uid)
      assert.ok(resp.data.result.session_id)
      
      const context = resp.data.result.user_context
      const sessionId = resp.data.result.session_id
      let cookie = `session_id=${sessionId}`

      const domain = [["state","not in", 
        ["draft","cancel","sent"]],"|",
        ["date",">","2017-10-31 17:19:34"],
        ["date","<","2017-11-29 17:19:54"]]

      const fields = ["date", "team_id", "price_subtotal"]
      const groupby = [ "date:month", "team_id" ]
      const kwargs = {}
      const model = 'sale.report'

      resp = await odoo.readGroup({ model, domain, fields, groupby, kwargs }, { context, cookie, sessionId })

      assert.equal(resp.status, 200)
      assert.equal(resp.statusText, 'OK')

      assert.ok(resp.data)
      assert.ok(resp.data.result)

    } catch (error) {
      handleError(error)
    }
  })
})