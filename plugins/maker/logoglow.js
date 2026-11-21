// Fitur maker/logoglow — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("maker/logoglow", {
  "name": "logo-glow",
  "command": [
    "logo-glow",
    "logoglow",
    "neonlogo",
    "glowlogo"
  ],
  "category": "maker",
  "desc": "Buat logo dengan efek neon glow",
  "usage": "",
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
