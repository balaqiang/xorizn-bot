// Fitur tools/o-qwa — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("tools/qwa", {
  "name": "qwa",
  "command": [
    "qwa",
    "quotewa",
    "fakeqwa"
  ],
  "category": "tools",
  "desc": "Membuat gambar quote WhatsApp",
  "usage": ".qwa [teks]",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
