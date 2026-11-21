// Fitur owner/aktifaudiomenu — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/aktifaudiomenu", {
  "name": "aktifaudiomenu",
  "command": [
    "aktifaudiomenu",
    "audiomenu",
    "setaudiomenu",
    "toggleaudiomenu"
  ],
  "category": "owner",
  "desc": "Toggle audio saat menampilkan menu",
  "usage": ".aktifaudiomenu ya/gak",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
