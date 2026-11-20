// Fitur main/benefitowner — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("main/benefitowner", {
  "name": "benefitowner",
  "command": [
    "benefitowner",
    "ownerbenefits",
    "ownerfitur"
  ],
  "category": "info",
  "desc": "Lihat penjelasan dan daftar fitur khusus Owner",
  "usage": ".benefitowner",
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
