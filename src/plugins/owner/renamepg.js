// Fitur owner/renamepg — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/renamepg", {
  "name": "renamepg",
  "command": [
    "renamepg",
    "renamepl",
    "renameplugin",
    "renamapl"
  ],
  "category": "owner",
  "desc": "Ganti nama file plugin",
  "usage": ".renamepg <namalama.js> <namabaru.js>",
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
