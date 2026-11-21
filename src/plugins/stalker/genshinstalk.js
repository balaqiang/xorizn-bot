// Fitur stalker/genshinstalk — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("stalker/genshinstalk", {
  "name": "genshinstalk",
  "command": [
    "genshinstalk",
    "genshin",
    "stalkgenshin",
    "gi"
  ],
  "category": "stalker",
  "desc": "Melihat informasi akun Genshin Impact berdasarkan UID.",
  "usage": ".genshinstalk <uid>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
