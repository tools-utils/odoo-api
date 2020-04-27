import assert from 'assert'
import Odoo from '../src/index'
import settings from './settings'
import handleError from './handle-error'

const odoo = new Odoo({ baseURL: settings.baseURL })
const model = 'res.partner'

const data = {
  name: "Muster Mann (Mocha Test)",
  city: "Berlin",
  street: "26 Lindner strasse",
  mobile: "+49 176 1234 56",
  email: "odoo.api@tools-utils.com",
  active: "true",
  company_type: "person",
  category_id: [[1, 20, { name: 'test', display_name: 'Mocha Test', color: 2 }]],
  ref: 9999
}

describe('Test create many2many method', () => {
  it('Should create a new category', async () => {
    try {
      let resp = await odoo.auth(settings)
      assert.ok(resp.data.result.uid)
      assert.ok(resp.data.result.session_id)
      const context = resp.data.result.user_context

      const sessionId = resp.data.result.session_id
      let cookie = `session_id=${sessionId}`

      const domain = [[ 'ref', '=', 9999 ]]
      const kwargs = {
        limit: 10,
        order: 'id asc'
      }

      const options = { context, cookie, sessionId }
      resp = await odoo.search({ model, domain, kwargs }, options)

      const listOfIds = resp.data.result
      console.log(listOfIds)

      if (!listOfIds || listOfIds.length == 0) {
        resp = await odoo.create({ model, data }, options)
        console.log(`New partner was created`, resp.data.result)
      } else {
        for (let id of listOfIds) {
          resp = await odoo.update({ model, id, data }, options)
          console.log(`A partner was updated`, id, resp.data.result)
        }
      }

      assert.equal(resp.status, 200)
      assert.equal(resp.statusText, 'OK')

      assert.ok(resp.data)
      assert.ok(resp.data.result)
    } catch (error) {
      handleError(error)
    }
  })
})