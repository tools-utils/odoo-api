import assert from 'assert'
import settings from './settings'

describe('Test settings', () => {
  it('Should have valid settings - baseURL, db, login, password', () => {
    assert.ok(settings)
    assert.ok(settings.baseURL)
    assert.ok(settings.db)
    assert.ok(settings.login)
    assert.ok(settings.password)
  })
})