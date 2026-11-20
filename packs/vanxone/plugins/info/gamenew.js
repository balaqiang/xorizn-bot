// Fitur main/gamenew — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("main/gamenew", {
  "name": "gamenew",
  "command": [
    "gamenew",
    "newgame",
    "youhugame"
  ],
  "category": "info",
  "desc": "Menu game Youhu untuk Ourin",
  "usage": ".gamenew",
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
