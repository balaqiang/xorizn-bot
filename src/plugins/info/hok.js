// Fitur info/hok — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("info/hok", {
  "name": "hok",
  "command": [
    "hok",
    "hokinfo",
    "honorofkings"
  ],
  "category": "info",
  "desc": "Informasi karakter Honor of Kings",
  "usage": ".hok <nama karakter>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 10,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
