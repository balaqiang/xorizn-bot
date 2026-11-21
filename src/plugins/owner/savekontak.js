// Fitur owner/savekontak — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/savekontak", {
  "name": "savekontak",
  "command": [
    "savekontak",
    "svkontak"
  ],
  "category": "owner",
  "desc": "Menyimpan kontak dari grup menjadi file VCF",
  "usage": ".savekontak <nama>",
  "owner": true,
  "group": false,
  "private": true,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
