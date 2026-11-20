// Fitur owner/notifch — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("owner/notifch", {
  "name": "notifch",
  "command": [
    "notifch",
    "mutech"
  ],
  "category": "owner",
  "desc": "Mengatur notifikasi channel WhatsApp yang diikuti bot",
  "usage": ".notifch <nomor>|on/off",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
