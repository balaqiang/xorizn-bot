// Fitur owner/listpluginv2 — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/listpluginv2", {
  "name": "listplugin",
  "command": [
    "listplugin",
    "listpl",
    "pluginlist2",
    "daftarplugin"
  ],
  "category": "owner",
  "desc": "Tampilkan semua plugin dalam folder tertentu secara detail",
  "usage": ".listplugin <folder>",
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
