// Fitur main/benefitpremium — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("main/benefitpremium", {
  "name": "benefitpremium",
  "command": [
    "benefitpremium",
    "premiumbenefits",
    "premiumfitur",
    "benefitprem"
  ],
  "category": "info",
  "desc": "Lihat penjelasan dan daftar fitur khusus Premium",
  "usage": ".benefitpremium",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 0,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
