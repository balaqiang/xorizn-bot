// Fitur tools/bitly — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("tools/bitly", {
  "name": "bitly",
  "command": [
    "bitly",
    "shortlink",
    "shorturl"
  ],
  "category": "tools",
  "desc": "Shorten URL dengan Bitly",
  "usage": ".bitly <url>",
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
