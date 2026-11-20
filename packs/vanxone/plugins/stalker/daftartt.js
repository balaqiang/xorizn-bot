// Fitur stalker/daftartt — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("stalker/daftartt", {
  "name": "daftartiktok",
  "command": [
    "daftartiktok",
    "daftartt",
    "regtt"
  ],
  "category": "stalker",
  "desc": "Mendaftarkan username TikTok ke database user",
  "usage": ".daftartt <username>",
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
