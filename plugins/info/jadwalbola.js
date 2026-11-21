// Fitur info/jadwalbola — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("info/jadwalbola", {
  "name": "jadwalbola",
  "command": [
    "jadwalbola",
    "bola",
    "football",
    "soccer",
    "jadwalsepakbola"
  ],
  "category": "info",
  "desc": "Lihat jadwal pertandingan sepak bola",
  "usage": ".jadwalbola [liga]",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 0,
  "needs": {
    "apikeys": [
      "neoxr"
    ],
    "scrapers": [],
    "assets": []
  }
})
