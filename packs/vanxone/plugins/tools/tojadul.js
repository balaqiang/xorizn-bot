// Fitur tools/tojadul — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("tools/tojadul", {
  "name": "tojadul",
  "command": [
    "tojadul",
    "jadul",
    "burikjadul",
    "oldvhs"
  ],
  "category": "tools",
  "desc": "Ubah foto jadi burik/pecah ala rekaman jadul (downscale-upscale + blur ringan)",
  "usage": ".tojadul (reply gambar)",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 6,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
