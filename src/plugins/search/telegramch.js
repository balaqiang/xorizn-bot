// Fitur search/telegramch — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("search/telegramch", {
  "name": "tgram",
  "command": [
    "tgram"
  ],
  "category": "search",
  "desc": "",
  "usage": "",
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
