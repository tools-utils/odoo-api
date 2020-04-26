import assert from 'assert'
import request from 'supertest'
import app from './start-server'
import settings from './settings'

let token = null

describe('Partner tests', () => {
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

  it('List all partners in company', (done) => {
    let filter = {
      company_id: 1
    }
    let fields = ['name', 'display_name', 'company_id']
    let pagination= { 'page': 1 , 'perPage': 5 }
    let query = { filter: JSON.stringify(filter), fields, pagination: JSON.stringify(pagination) }
    request(app).get(`/res.partner/`)
    .set('Authorization', token)
    .query(query)
    .expect(200)
    .end(function(err, res) {
      if (err) throw done(err)
      assert.ok(res.body)
      assert.ok(res.body.result, 'Result not found')
      if (res.body.result.length == 0) {
        console.log(`res.partner not found`)
      } else{
        console.log(`res.partner found... `, res.body.result)
      }
      done()
    })
  })

  it('Check if partner exists', (done) => {
    let filter = {
      ref: 1
    }
    let fields = ['name', 'display_name', 'company_id']
    let pagination= { 'page': 1 , 'perPage': 1 }
    let query = { filter: JSON.stringify(filter), fields, pagination: JSON.stringify(pagination) }
    request(app).get(`/res.partner/`)
    .set('Authorization', token)
    .query(query)
    .expect(200)
    .end(function(err, res) {
      if (err) throw done(err)
      assert.ok(res.body)
      assert.ok(res.body.result, 'Result not found')
      assert.ok(res.body.result.length == 1, 'Wrong expected value')
      done()
    })
  })

  it('List verndor based on name', (done) => {
    let filter = {
      name: { ilike: '%Farina%' },
      supplier: true
    }
    let fields = ['name', 'display_name', 'company_id', 'supplier']
    let pagination= { 'page': 1 , 'perPage': 5 }
    let query = { filter: JSON.stringify(filter), fields, pagination: JSON.stringify(pagination) }
    request(app).get(`/res.partner/`)
    .set('Authorization', token)
    .query(query)
    .expect(200)
    .end(function(err, res) {
      if (err) throw done(err)
      assert.ok(res.body)
      assert.ok(res.body.result, 'Result not found')
      console.log(res.body.result)
      done()
    })
  })
  
  it('Import vendors from json', (done) => {
  })
})