// Fitur group/delantilink — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("group/delantilink", {
  "name": "delantilink",
  "command": [
    "delantilink",
    "delalink",
    "delblocklink",
    "remantilink"
  ],
  "category": "group",
  "desc": "Menghapus link dari daftar antilink",
  "usage": ".delantilink <domain/pattern>",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "admin": true,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
