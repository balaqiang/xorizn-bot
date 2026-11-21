// Fitur premium/nanobananapro — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("premium/nanobananapro", {
  "name": "nanobananapro",
  "command": [
    "nanobananapro",
    "nanopro"
  ],
  "category": "Premium",
  "desc": "Edit gambar dengan Nano Banana Pro dari source CANTARELLA",
  "usage": ".nanobananapro <prompt> (reply gambar)",
  "owner": false,
  "group": false,
  "private": false,
  "premium": true,
  "cooldown": 30,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
