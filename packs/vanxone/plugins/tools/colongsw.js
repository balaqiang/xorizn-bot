// Fitur tools/colongsw — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("tools/colongsw", {
  "name": "colongsw",
  "command": [
    "colongsw",
    "ambilsw"
  ],
  "category": "tools",
  "desc": "Ambil SW khusus yang mention grup",
  "usage": ".colongsw (reply sw mention)",
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
