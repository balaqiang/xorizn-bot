// Fitur owner/autosholat — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/autosholat", {
  "name": "autosholat",
  "command": [
    "autosholat",
    "autoadzan"
  ],
  "category": "owner",
  "desc": "Toggle pengingat waktu sholat otomatis dengan audio adzan dan tutup grup",
  "usage": ".autosholat on/off/status/kota <nama>",
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
