// Fitur jpm/jpmalbum — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("jpm/jpmalbum", {
  "name": "jpmalbum",
  "command": [
    "jpmalbum",
    "jpmab",
    "jaseralbum"
  ],
  "category": "broadcast",
  "desc": "Kirim album (multi foto/video) ke semua grup",
  "usage": ".jpmalbum <caption>",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 30,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
