// Fitur user/level — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("user/level", {
  "name": "level",
  "command": [
    "level",
    "lvl",
    "ceklevel"
  ],
  "category": "profil",
  "desc": "Cek level user",
  "usage": ".level [@user]",
  "owner": false,
  "group": false,
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
