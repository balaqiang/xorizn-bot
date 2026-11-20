// Fitur info/benefitpartner — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("info/benefitpartner", {
  "name": "benefitpartner",
  "command": [
    "benefitpartner",
    "partnerbenefits",
    "keuntunganpartner"
  ],
  "category": "info",
  "desc": "Lihat keuntungan menjadi partner bot",
  "usage": ".benefitpartner",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
