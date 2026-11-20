// Fitur group/antijudol — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("group/antijudol", {
  "name": "antijudol",
  "command": [
    "antijudol",
    "antijudi",
    "nojudi",
    "antislot"
  ],
  "category": "group",
  "desc": "Deteksi konten judol di grup",
  "usage": ".antijudol <on/off/metode> [kick/remove]",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "admin": true,
  "botAdmin": true,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
