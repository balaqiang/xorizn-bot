// Fitur sticker/qc — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("sticker/qc", {
  "name": "qc",
  "command": [
    "qcstc",
    "stcqc",
    "qcstic",
    "qcstick",
    "quotesticker"
  ],
  "category": "sticker",
  "desc": "Membuat sticker quote chat dengan warna custom",
  "usage": ".qc <warna> <text>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
