// Fitur store/store-payment — kode inti di engine/lumen
module.exports = require('../../lib/engine/lumen').plugin("store/store-payment", {"command": ["addpay", "listpay"], "category": "store", "owner": true, "group": true, "admin": false, "botAdmin": false, "desc": "Fitur addpay"})
