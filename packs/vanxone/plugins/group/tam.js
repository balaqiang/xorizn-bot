// Fitur group/tam — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("group/tam", {
  "name": "tam",
  "command": [
    "tam",
    "topactive",
    "topmember"
  ],
  "category": "group",
  "desc": "Lihat top member paling aktif di grup",
  "usage": ".tam <jumlah>",
  "owner": false,
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
