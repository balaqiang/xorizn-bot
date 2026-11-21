// Fitur tools/gepeng — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("tools/gepeng", {
  "name": "gepeng",
  "command": [
    "gepeng",
    "geoghast",
    "peng"
  ],
  "category": "tools",
  "desc": "Bot otomatis menggepengkan gambar (compress height)",
  "usage": ".gepeng",
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
