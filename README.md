# odoo-api
Odoo REST API

It provides a simple `REST API` for `odoo` server.

```
getOne  => GET    /:model/:id
getMany => GET    /:model/?id=100&id=200
getMany => GET    /:model/?domain=[["ref", "=", "33117579"]]&fields=["name", "category_id", "customer"])
create  => POST   /:model
update  => PUT    /:model/:id
delete  => DELETE /:model/:id
```

# Magic ORM syntax

- [ORM syntax](https://www.odoo.com/documentation/9.0/reference/orm.html)
- For `create` or `update` method you can apply the **magic** ORM syntax to manipulate the `relation objects`.
- **For Example** if you want to add/update a `category` (many2many) for a `res.partner`

```
{
  name: 'Muster Mann',
  ref: 100,
  category_id: [[0, 0, { name: 'test', display_name: 'Mocha Test', color: 1}]] // create a new category
}
```

```
# category_id = 20, color = 1
{
  name: 'Muster Mann',
  ref: 100,
  category_id: [[1, 20, { name: 'test', display_name: 'Mocha Test', color: 2}]] // update color to 2
}
```

```
# category_id = 8, an existing category
{
  name: 'Muster Mann',
  ref: 100,
  category_id: [[4, 8, 0]] // add category (8) to the current set of categories
}
```

```
# category_id = 8, an existing category
{
  name: 'Muster Mann',
  ref: 100,
  category_id: [[5, 0, 0]] // remove all categories
}
```

```
# category_id = 8, an existing category
{
  name: 'Muster Mann',
  ref: 100,
  category_id: [[6, 0, [8]]] // replace the current set of categories with 8
}
```

# Tests

Before running tests, you need to provide the `host` address of `odoo` server, an valid `login` and `password`. 
Make sure that this `login` has permission to make `rpc` calls.

```
# test/settings.js

const settings = {
  baseURL: '',
  db: '',
  login: '',
  password: ''
} 
```

- Start server

```
yarn build

export ODOO_HOST=http://0.0.0.0:8069
export PORT=9000

node lib/index.js 
```

```
curl -d '{"db": "odoo", "login": "a.user", "password": "secret" }' -H 'Content-Type: application/json'  http://localhost:9000/auth
```
