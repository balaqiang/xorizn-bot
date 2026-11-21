// Fitur fun/halah — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("fun/halah", {
  "name": "halah",
  "command": [
    "halah",
    "hilih"
  ],
  "category": "fun",
  "desc": "Ubah teks ke gaya Halah/Hilih",
  "usage": ".halah <teks> / .hilih <teks>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
