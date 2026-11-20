// Fitur owner/carinamaplugin — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/carinamaplugin", {
  "name": "carinamaplugin",
  "command": [
    "carinamaplugin",
    "cnp",
    "namafile"
  ],
  "category": "owner",
  "desc": "Cari nama file .js plugin berdasarkan nama command atau alias",
  "usage": ".cnp <command/alias>",
  "owner": true,
  "group": false,
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
