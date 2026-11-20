// Fitur random/cecanjepang — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("random/cecanjepang", {
  "name": "cecanjepang",
  "command": [
    "cecanjepang",
    "cewekjepang",
    "cewekjpn"
  ],
  "category": "asupan",
  "desc": "Random gambar cewek cantik Jepang",
  "usage": ".cecanjepang",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
