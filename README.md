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
# Create `sale.order`

```
# partner_id = 100, product_id_1 = 50, uom_id_1 = 2, product_id_2 = 51, uom_id_2 = 3
let saleOrderLine1 = {
  name: 'iPhone 7 Plus 128GB',
  price_unit: 103000,
  product_id: product_id_1,
  uom_id: uom_id_1,
  product_uom_qty: 1
}

let saleOrderLine2 = {
  name: 'Remote keyboard for iPad - Bluetooth',
  price_unit: 60,
  product_id: product_id_2,
  uom_id: uom_id_2,
  product_uom_qty: 1
}

let saleOrder = {
  partner_id,
  name: '[e-commerce] 20200419/SO100',
  client_order_ref: '20200419',
  create_date: '2020-04-19',
  date_order: '2020-04-19',
  order_line: [[0, 0, saleOrderLine1], [0, 0, saleOrderLine2]], // (0, _, values) syntax
  state: 'draft'
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
- Start `postgres`, `odoo` and `odoo REST API`

```
docker-compose up
```

```
curl -d '{"db": "odoo", "login": "a.user", "password": "secret" }' -H 'Content-Type: application/json'  http://localhost:9000/auth
```
