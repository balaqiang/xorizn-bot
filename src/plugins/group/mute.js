// Fitur group/mute — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("group/mute", {
  "name": "mute",
  "command": [
    "bisukan"
  ],
  "category": "group",
  "desc": "Bisukan seluruh grup (hanya admin yang bisa kirim pesan)",
  "usage": ".mute",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "admin": true,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
