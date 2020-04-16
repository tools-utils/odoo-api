import assert from 'assert'
import Odoo from '../src/index'
import settings from './settings'
import handleError from './handle-error'

const odoo = new Odoo({ baseURL: settings.baseURL })
const model = 'res.partner'
const data = {
  "ref": "odoo-test-partner",
  "name": "Muster Mann",
  "city": "Berlin",
  "street": "26 Lindner strasse",
  "mobile": "+49 176 1234 56",
  "email": "odoo.api@tools-utils.com",
  "active": "true",
  "customer": "true",
  "company_type": "person"
}

describe('Test create/update method', () => {
  it('Should return valid result', async () => {
    try {
      let resp = await odoo.auth(settings)
      assert.ok(resp.data.result.uid)
      assert.ok(resp.data.result.session_id)
      const context = resp.data.result.user_context

      const sessionId = resp.data.result.session_id
      let cookie = `session_id=${sessionId}`

      const domain = [[ 'name', '=', 'Muster Mann' ]]
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