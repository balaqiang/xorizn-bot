// Fitur owner/addlimitall — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/addlimitall", {
  "name": "addenergiall",
  "command": [
    "addenergiall",
    "addenergianall",
    "bonusenergiall"
  ],
  "category": "owner",
  "desc": "Menambahkan limit/energi ke semua member grup",
  "usage": ".addenergiall <jumlah>",
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
