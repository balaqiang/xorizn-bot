// Fitur info/gag — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("info/gag", {
  "name": "gag",
  "command": [
    "gag",
    "growagarden",
    "gaginfo"
  ],
  "category": "info",
  "desc": "Menampilkan informasi stok Grow a Garden",
  "usage": ".gag",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
