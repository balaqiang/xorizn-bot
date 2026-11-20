// Fitur owner/delpremall — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/delpremall", {
  "name": "delpremall",
  "command": [
    "delpremall",
    "delpremiumall",
    "removepremall"
  ],
  "category": "owner",
  "desc": "Menghapus semua member grup dari premium",
  "usage": ".delprem all",
  "owner": true,
  "group": true,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
