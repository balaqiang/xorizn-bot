// Fitur fun/confess — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("fun/confess", {
  "name": "confess",
  "command": [
    "confess",
    "confession",
    "menfess",
    "anonim"
  ],
  "category": "fun",
  "desc": "Kirim pesan anonim ke seseorang",
  "usage": ".confess nomor|pesan",
  "owner": false,
  "group": false,
  "private": false,
  "premium": true,
  "admin": false,
  "botAdmin": false,
  "cooldown": 60,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
