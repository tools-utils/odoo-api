import odoo from '@tools-utils/odoo'

const port = process.env.PORT
odoo.api.listen(port)

console.log('Starting Odoo REST API...', port)