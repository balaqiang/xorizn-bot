// Fitur info/totalfitur2 — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("info/totalfitur2", {
  "name": "totalfitur2",
  "command": [
    "totalfitur2",
    "totalfeature2",
    "totalcmd2",
    "countplugin2",
    "distribusi2"
  ],
  "category": "info",
  "desc": "Lihat total fitur/command bot secara otomatis",
  "usage": ".totalfitur2",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 10,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
