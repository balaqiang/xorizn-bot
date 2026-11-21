// Fitur owner/ganti-xorizn-mp3 — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/ganti-xorizn-mp3", {
  "name": "ganti-xorizn.mp3",
  "command": [
    "ganti-xorizn.mp3",
    "gantixoriznaudio",
    "setxoriznaudio"
  ],
  "category": "owner",
  "desc": "Ganti audio xorizn.mp3",
  "usage": ".ganti-xorizn.mp3 (reply/kirim audio)",
  "owner": true,
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
