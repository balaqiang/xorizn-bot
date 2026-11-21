// Fitur anime/konachan — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("anime/konachan", {
  "name": "konachan",
  "command": [
    "konachan",
    "konasearch",
    "kona",
    "konaimg"
  ],
  "category": "anime",
  "desc": "Cari gambar anime dari konachan",
  "usage": ".konachan <tags>",
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
