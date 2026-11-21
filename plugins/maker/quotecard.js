// Fitur maker/quotecard — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("maker/quotecard", {
  "name": "quotecard",
  "command": [
    "quotecard",
    "qcard",
    "cardquote",
    "makerquote"
  ],
  "category": "maker",
  "desc": "Generate quote card dengan background gradient dan tipografi elegan",
  "usage": ".quotecard teks|author",
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
