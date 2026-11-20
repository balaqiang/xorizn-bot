// Fitur search/pinvid — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("search/pinvid", {
  "name": "pinvid",
  "command": [
    "pinvid",
    "pinvideo",
    "pinterestv",
    "pinv"
  ],
  "category": "search",
  "desc": "Search video Pinterest (album)",
  "usage": ".pinvid <query>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 30,
  "energi": 2,
  "needs": {
    "apikeys": [
      "neoxr"
    ],
    "scrapers": [],
    "assets": []
  }
})
