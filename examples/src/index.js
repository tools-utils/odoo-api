import odoo from '@tools-utils/odoo'

const port = 9000
odoo.api.listen(port)

console.log('Starting Odoo REST API...', port)