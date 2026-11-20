// Fitur owner/map — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/map", {
  "name": "map",
  "command": [
    "map",
    "filemap",
    "treemap",
    "struktur"
  ],
  "category": "owner",
  "desc": "Tampilkan & kelola struktur folder bot",
  "usage": ".map <mode>",
  "owner": true,
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
