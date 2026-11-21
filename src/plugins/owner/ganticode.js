// Fitur owner/ganticode — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/ganticode", {
  "name": "ganticode",
  "command": [
    "ganticode",
    "replaceplugin",
    "updateplugin",
    "gantiplugin",
    "gc"
  ],
  "category": "owner",
  "desc": "Ganti code plugin yang sudah ada",
  "usage": ".ganticode [namafile] [folder]",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
