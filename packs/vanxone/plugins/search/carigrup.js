// Fitur search/carigrup — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("search/carigrup", {
  "name": "carigrup",
  "command": [
    "searchgrup",
    "findgrup",
    "grupwa"
  ],
  "category": "search",
  "desc": "Cari grup WhatsApp berdasarkan keyword",
  "usage": ".carigrup <keyword>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
