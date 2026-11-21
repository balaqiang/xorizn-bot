// Fitur main/gbbot — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("main/gbbot", {
  "name": "gbbot",
  "command": [
    "gbbot",
    "botgb",
    "officialgb",
    "grupbot",
    "gcbot",
    "setgbbot"
  ],
  "category": "info",
  "desc": "Menampilkan dan mengatur link Grup Official Bot",
  "usage": ".gbbot / .setgbbot <link>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
