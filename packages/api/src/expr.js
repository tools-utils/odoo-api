const OPS = {
  like: 'like',
  ilike: 'ilike',
  lt: '<',
  lte: '<=',
  gt: '>',
  gte: '>=',
  eq: '=',
  neq: '!=',
  in: 'in',
  and: '&',
  or: '|'
}

const pair = (expr) => {
  if (typeof expr === 'object') {
    let keys = Object.keys(expr)
    let lhs = keys[0]
    let rhs = expr[lhs]
    return { lhs, rhs }
  }
  return { lhs: '', rhs: expr }
}

const atom = (expr) => {
  let { lhs: property, rhs } = pair(expr)
  let rhsVal = pair(rhs)
  let op = OPS[rhsVal.lhs] || '='

  if ('in' === op) {
    return [property, op, rhsVal.rhs]
  }
  if (typeof rhsVal.rhs === 'object')
    return [op, property, ...resolve(rhsVal.rhs)]
  return [property, op, rhsVal.rhs]
}

const and = (expr) => {
  let { rhs } = pair(expr)
  let retval = [OPS['and']]
  for (let item of rhs) {
    retval = [...retval, resolve(item)]
  }
  return retval
}

const or = (expr) => {
  let { rhs } = pair(expr)
  let retval = [OPS['or']]
  for (let item of rhs) {
    retval = [...retval, resolve(item)]
  }
  return retval
}

const isAtom = expr => {
  let keys = Object.keys(expr)
  return keys.length === 1
}

const nomalize = expr => {
  let json = expr
  let keys = Object.keys(json)
  if (keys.length > 1) {
    json = { and: keys.map(v => {
      let retval = {}
      retval[v] = json[v]
      return retval
    })}
  }
  return json
}

const resolve = expr => {
  let json = nomalize(expr)
  let { lhs, rhs } = pair(json)
  if ('and' === lhs) {
    return and(json)
  } else if ('or' === lhs) {
    return or(json)
  }
  return atom(json)
}

export default {
  isAtom, pair, atom, and, or, resolve
}

