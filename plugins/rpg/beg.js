// Fitur rpg/beg — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("rpg/beg", {
  "name": "beg",
  "command": [
    "beg",
    "ngemis",
    "minta"
  ],
  "category": "rpg",
  "desc": "Mengemis untuk mendapatkan uang receh",
  "usage": ".beg",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 60,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
