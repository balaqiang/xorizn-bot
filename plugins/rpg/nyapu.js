// Fitur rpg/nyapu — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("rpg/nyapu", {
  "name": "nyapu",
  "command": [
    "nyapu",
    "cleaning",
    "bersih"
  ],
  "category": "rpg",
  "desc": "Nyapu jalan, siapa tau nemu barang jatuh!",
  "usage": ".nyapu",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 120,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
