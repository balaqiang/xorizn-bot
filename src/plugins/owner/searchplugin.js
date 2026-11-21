// Fitur owner/searchplugin — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/searchplugin", {
  "name": "searchplugin",
  "command": [
    "searchplugin",
    "splugin",
    "findplugin",
    "infoplugin"
  ],
  "category": "owner",
  "desc": "Cari dan tampilkan info plugin",
  "usage": ".splugin <nama>",
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
