// Fitur maker/fakebook — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("maker/fakebook", {
  "name": "fakebook",
  "command": [
    "fakebook",
    "bookquote",
    "quotebuku",
    "fakebuku"
  ],
  "category": "maker",
  "desc": "Membuat gambar quote estetis gaya halaman buku",
  "usage": ".fakebook <teks>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
