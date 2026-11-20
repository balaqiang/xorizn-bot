// Fitur tools/tocodeqr — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("tools/tocodeqr", {
  "name": "tocodeqr",
  "command": [
    "tocodeqr",
    "qrurl",
    "linktoqr"
  ],
  "category": "tools",
  "desc": "Convert link menjadi QR Code",
  "usage": ".tocodeqr <link>",
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
