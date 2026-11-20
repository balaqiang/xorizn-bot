// Fitur owner/plugindiff — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/plugindiff", {
  "name": "plugindiff",
  "command": [
    "plugindiff",
    "diffplugin",
    "pdiff",
    "plugincompare",
    "cekdiff"
  ],
  "category": "owner",
  "desc": "Compare perbedaan antar versi plugin dari backup — lihat baris apa yang berubah",
  "usage": ".plugindiff <nama> [versi1] [versi2]",
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
