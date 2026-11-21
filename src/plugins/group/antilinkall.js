// Fitur group/antilinkall — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("group/antilinkall", {
  "name": "antilinkall",
  "command": [
    "antilinkall",
    "alall",
    "antialllink"
  ],
  "category": "group",
  "desc": "Anti semua jenis link (deteksi domain extension)",
  "usage": ".antilinkall <on/off/metode> [kick/remove]",
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
