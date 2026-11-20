// Fitur search/playtiktok — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("search/playtiktok", {
  "name": "playtiktok",
  "command": [
    "playtiktok",
    "ttplay",
    "tiktokplay"
  ],
  "category": "search",
  "desc": "Cari dan kirim satu video TikTok terbaik",
  "usage": ".playtiktok <query>",
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
