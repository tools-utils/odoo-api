import assert from 'assert'
import request from 'supertest'
import app from './start-server'
import settings from './settings'


let token = null
let context = {}

const data = {
  ref: 'odoo-test-partner',
  name: 'Muster Mann',
  city: 'Berlin',
  street: '26 Lindner strasse',
  mobile: '+49 176 1234 56',
  email: 'odoo.api@tools-utils.com',
  active: 'true',
  customer: 'true',
  company_type: 'person',
  ref: 33117579
}

const create = (done) => {
  request(app).post('/res.partner')
  .send(data)
  .set('Authorization', token)
  .expect(200)
  .end(function(err, res) {
    if (err) throw done(err)
    assert.ok(res.body)
    assert.ok(res.body.result, 'Result not found')
    done()
  })
}

const update = (id, done) => {
  request(app).put(`/res.partner/${id}`).query(context)
  .send(data)
  .set('Authorization', token)
  .expect(200)
  .end(function(err, res) {
    if (err) throw done(err)
    assert.ok(res.body)
    assert.ok(res.body.result, 'Result not found')
    done()
  })
}

describe('APIs Test', () => {
  it('Should login OK', (done) => {
    request(app).post('/auth')
    .send(settings)
    .expect(200)
    .end(function(err, res) {
      if (err) throw done(err)
      assert.ok(res.body)
      assert.ok(res.body.result, 'Result not found')
      assert.ok(res.body.result.uid, 'uid not found')
      assert.ok(res.body.result.session_id, 'session_id not found')

      token = res.body.result.session_id
      done()
    })
  })

  it('Should return an partner', (done) => {
    request(app).get('/res.partner/1')
    .set('Authorization', token)
    .expect(200)
    .end((err, res) => {
      if (err) throw done(err)
      assert.ok(res.body)
      assert.ok(res.body.result, 'Result not found')
      assert.ok(res.body.result.length === 1, 'Single value')
      assert.ok(res.body.result[0].id, 'Invalid id')
      done()
    })
  })

  it('Should return many sale order lines', (done) => {
    request(app).get('/sale.order.line/?id=69279&id=69280')
    .set('Authorization', token)
    .expect(200)
    .end((err, res) => {
      if (err) throw done(err)
      assert.ok(res.body)
      assert.ok(res.body.result, 'Result not found')
      assert.ok(res.body.result.length > 1, 'Many values')
      done()
    })
  })

  it('search / create / update', (done) => {
    request(app).get('/res.partner/?domain=[[ "ref", "=", "33117579"]]&fields=["name", "category_id", "customer"]')
    .set('Authorization', token)
    .expect(200)
    .end(function(err, res) {
      if (err) throw done(err)
      assert.ok(res.body)
      assert.ok(res.body.result, 'Result not found')
      if (res.body.result.length == 0) {
        console.log(`Create a customer... `)
        create(done)
      } else{
        console.log(`Customer found... `, res.body.result)
        for (let item of res.body.result) {
          update(item.id, done)
        }
        done()
      }
    })
  })
})