// Fitur search/google — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("search/google", {
  "name": "google",
  "command": [
    "google",
    "gsearch",
    "googlenews"
  ],
  "category": "search",
  "desc": "Cari berita di Google News",
  "usage": ".google <query>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
