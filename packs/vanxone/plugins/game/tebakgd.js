// Fitur game/tebakgd — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("game/tebakgd", {
  "name": "tebakgd",
  "command": [
    "tebakgd",
    "tgd",
    "gdquiz",
    "guessgd"
  ],
  "category": "game",
  "desc": "Tebak istilah, level, dan karakter dari Geometry Dash",
  "usage": ".tebakgd [add/del/edit/total/cek] ...",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
