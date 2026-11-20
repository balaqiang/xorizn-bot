// Fitur premium/age-detection — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("premium/age-detection", {
  "name": "age-detection",
  "command": [
    "age-detection",
    "detectage",
    "age-detect"
  ],
  "category": "Premium",
  "desc": "Deteksi perkiraan usia dari foto",
  "usage": ".age-detection (reply gambar)",
  "owner": false,
  "group": false,
  "private": false,
  "premium": true,
  "cooldown": 30,
  "energi": 3,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
