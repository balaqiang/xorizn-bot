// Fitur main/saluranbot — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("main/saluranbot", {
  "name": "saluran",
  "command": [
    "saluran",
    "channel",
    "ch",
    "joinch"
  ],
  "category": "info",
  "desc": "Join saluran resmi xorizn-bot 😈",
  "usage": ".saluran",
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
