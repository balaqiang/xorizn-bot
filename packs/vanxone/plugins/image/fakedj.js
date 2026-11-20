// Fitur canvas/fakedj — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("canvas/fakedj", {
  "name": "fakedj",
  "command": [
    "fakedj",
    "djfake"
  ],
  "category": "image",
  "desc": "Membuat gambar fake DJ dari teks",
  "usage": ".fakedj <teks>",
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
