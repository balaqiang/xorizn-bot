// Fitur tools/kalkulatormbg — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("tools/kalkulatormbg", {
  "name": "kalkulatormbg",
  "command": [
    "kalkulatormbg",
    "kkmbg"
  ],
  "category": "tools",
  "desc": "Hitung durasi dan perbandingan dana Makan Bergizi Gratis (MBG)",
  "usage": ".kkmbg <jumlah_uang>",
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
