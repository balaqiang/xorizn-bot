// Fitur group/mulaiabsen — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("group/mulaiabsen", {
  "name": "mulaiabsen",
  "command": [
    "mulaiabsen",
    "startabsen",
    "bukaabsen",
    "openabsen"
  ],
  "category": "group",
  "desc": "Mulai sesi absen di grup (admin only)",
  "usage": ".mulaiabsen [keterangan]",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "admin": true,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
