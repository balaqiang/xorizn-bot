// Fitur owner/addpartner — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/addpartner", {
  "name": "addpartner",
  "command": [
    "addpartner",
    "delpartner",
    "listpartner"
  ],
  "category": "owner",
  "desc": "Kelola daftar partner bot",
  "usage": ".addpartner <nomor/@tag> [hari]\\n.delpartner <nomor/@tag>\\n.listpartner\\n.cekpartner <nomor/@tag>",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
