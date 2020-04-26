import expr from '../src/expr'

/*
like : [('name', 'like', 'John%')]        -> filter={ name: { like: 'John%' } }
ilike : [('name', 'ilike', 'John%')]      -> filter={ name: { ilike: 'John%' } }
= : [('product_id', '=', 122)]            -> filter={ product_id: 122 }
in : [('state', 'in', ('draft', 'done'))] -> filter={ state: { in: ['draft', 'done' ] } }
*/
describe('Filter test', () => {
  it('["|", [ "ref", "=", "33117579"], [ "id", "=", 1]]', () => {
    let json = { or: [{ ref: 33117579}, { id: 1 }] }
    let retval = expr.resolve(json)
    console.log(retval)
  })

  it ("name: { like: 'John%' }", () => {
    let json = { name: { like: 'John%' } }
    let retval = expr.resolve(json)
    console.log(retval)
  })
  it ("{ state: { in: ['draft', 'done' ] } }", () => {
    let json = { state: { in: ['draft', 'done'] } }
    let retval = expr.resolve(json)
    console.log(retval)
  })

  it("{company_id: 1, state: { neq: 'done' }}", () => {
    let json = { company_id: 1, state: { neq: 'done' } }
    let retval = expr.resolve(json)
    console.log(retval)
  })

  it ('( (A & B) | C ) | (D & E)', (done) => {
    // [ '|', '|', '&', (A), (B), (C), '&', (D), (E) ] 
    // ["|","|","&",">","price",150,"!=","state","draft","=","company_id",100,"&","=","partner_id",null,"<","price",200]    
    let A = { price: { gt: 150.0 } }
    let B = { state: { neq: 'draft' }}
    let C = { company_id: { eq: 100 }}

    let D = { partner_id: 200 }
    let E = { price: { lt: 200.00 } }
    let json = { or: [ { or: [{ and: [A, B] }, C] }, { and: [D, E] } ] }

    let retval = expr.resolve(json)
    console.log(JSON.stringify(retval))
    done()
  })
})


