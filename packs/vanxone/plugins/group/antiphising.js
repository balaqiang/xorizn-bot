// Fitur group/antiphising — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("group/antiphising", {
  "name": "antiphising",
  "command": [
    "antiphising",
    "antiphishing",
    "antiscamlink",
    "nophising"
  ],
  "category": "group",
  "desc": "Deteksi konten phising di grup",
  "usage": ".antiphising <on/off/metode> [kick/remove]",
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
