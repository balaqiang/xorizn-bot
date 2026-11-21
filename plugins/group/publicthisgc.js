// Fitur group/publicthisgc — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("group/publicthisgc", {
  "name": "publicthisgc",
  "command": [
    "publicthisgc",
    "publicgc",
    "publicgroup",
    "publicthisgroup"
  ],
  "category": "group",
  "desc": "Aktifkan mode public hanya di grup ini",
  "usage": ".publicthisgc",
  "owner": true,
  "group": true,
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
