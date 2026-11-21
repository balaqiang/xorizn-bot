// Fitur nsfw/nsfw — kode inti di engine/orbit
module.exports = require('../../lib/engine/orbit').plugin("nsfw/nsfw", {
  "name": "oppai",
  "command": [
    "oppai",
    "oppaianimee"
  ],
  "category": "nsfw",
  "desc": "Koleksi gambar NSFW anime dari berbagai kategori (Hanya untuk 18+)",
  "usage": ".nsfw atau .<kategori>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 8,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
