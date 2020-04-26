import assert from 'assert'
import request from 'supertest'
import app from './start-server'
import settings from './settings'


let token = null

describe('Stock tests', () => {
  before((done) => {
    request(app).post('/auth')
    .send(settings)
    .expect(200)
    .end(function(err, res) {
      if (err) throw done(err)
      assert.ok(res.body)
      assert.ok(res.body.result, 'Result not found')
      assert.ok(res.body.result.uid, 'uid not found')
      assert.ok(res.body.result.session_id, 'session_id not found')

      // keeps token for further requests
      token = res.body.result.session_id
      done()
    })
  })

  it('List all warehouses', (done) => {
    let filter = {
      company_id: 1
    }
    let fields = ['name', 'display_name', 'company_id']
    let pagination= { 'page': 1 , 'perPage': 5 }
    let query = { filter: JSON.stringify(filter), fields, pagination: JSON.stringify(pagination) }
    request(app).get(`/stock.warehouse/`)
    .set('Authorization', token)
    .query(query)
    .expect(200)
    .end(function(err, res) {
      if (err) throw done(err)
      assert.ok(res.body)
      assert.ok(res.body.result, 'Result not found')
      if (res.body.result.length == 0) {
        console.log(`stock.warehouse not found`)
      } else{
        console.log(`stock.warehouse found... `, res.body.result)
      }
      done()
    })
  })

  it('List all locations', (done) => {
    let filter = {
      company_id: 1
    }
    let fields = ['name', 'display_name']
    let pagination= { 'page': 1 , 'perPage': 5 }
    let query = { filter: JSON.stringify(filter), fields, pagination: JSON.stringify(pagination) }
    request(app).get(`/stock.location/`)
    .set('Authorization', token)
    .query(query)
    .expect(200)
    .end(function(err, res) {
      if (err) throw done(err)
      assert.ok(res.body)
      assert.ok(res.body.result, 'Result not found')
      if (res.body.result.length == 0) {
        console.log(`stock.location not found`)
      } else{
        console.log(`stock.location found... `, res.body.result)
      }
      done()
    })
  })

  it('List all picking', (done) => {
    let filter = {
      company_id: 1,
      state: { in: ['draft'] }
    }
    let pagination= { 'page': 1 , 'perPage': 5 }
    let fields = ['name', 'display_name', 'state']
    let query = { filter: JSON.stringify(filter), fields, pagination: JSON.stringify(pagination) }
    request(app).get(`/stock.picking/`)
    .set('Authorization', token)
    .query(query)
    .expect(200)
    .end(function(err, res) {
      if (err) throw done(err)
      assert.ok(res.body)
      assert.ok(res.body.result, 'Result not found')
      if (res.body.result.length == 0) {
        console.log(`Stock picking not found`)
      } else{
        console.log(`Stock picking found... `, res.body.result)
      }
      done()
    })
  })
})