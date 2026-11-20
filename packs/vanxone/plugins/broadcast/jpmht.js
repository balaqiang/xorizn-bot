// Fitur jpm/jpmht — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("jpm/jpmht", {
  "name": "jpmht",
  "command": [
    "jpmht",
    "jpmhidetag"
  ],
  "category": "broadcast",
  "desc": "Kirim pesan ke semua grup dengan hidetag",
  "usage": ".jpmht <pesan>",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 30,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
