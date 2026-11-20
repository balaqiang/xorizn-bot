// Fitur owner/reactevent — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/reactevent", {
  "name": "reactevent",
  "command": [
    "reactevent",
    "revent"
  ],
  "category": "owner",
  "desc": "Atur auto react buat event grup (member masuk/keluar/ganti deskripsi)",
  "usage": ".reactevent <on|off|add|del|list> [emoji]",
  "owner": true,
  "group": true,
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
