// Fitur cek/cekcreative — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("cek/cekcreative", {
  "name": "cekcreative",
  "command": [
    "cekcreative",
    "creative",
    "kreatif"
  ],
  "category": "cek",
  "desc": "Cek tingkat kreativitas kamu",
  "usage": ".cekcreative <nama>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
