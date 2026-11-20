// Fitur search/ttsearch — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("search/ttsearch", {
  "name": "ttsearch",
  "command": [
    "searchtiktok"
  ],
  "category": "search",
  "desc": "Cari video TikTok",
  "usage": ".ttsearch <query>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 15,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
