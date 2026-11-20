// Fitur search/tiktokfoto — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("search/tiktokfoto", {
  "name": "tiktokfoto",
  "command": [
    "tiktokfoto",
    "ttfoto",
    "ttphotosearch",
    "searchtiktokfoto"
  ],
  "category": "search",
  "desc": "Cari foto TikTok dan kirim album gambar",
  "usage": ".tiktokfoto <query>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
