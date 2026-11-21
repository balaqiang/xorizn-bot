// Fitur user/levelup — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("user/levelup", {
  "name": "levelup",
  "command": [
    "levelup",
    "lvlup",
    "levelnotif"
  ],
  "category": "profil",
  "desc": "Toggle notifikasi level up",
  "usage": ".levelup <on/off>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
