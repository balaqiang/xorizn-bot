// Fitur owner/delfiledb — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/delfiledb", {
  "name": "delfiledb",
  "command": [
    "delfiledb",
    "dbdel",
    "hapusdb"
  ],
  "category": "owner",
  "desc": "Hapus file JSON dari database",
  "usage": ".delfiledb [namafile] [folder]",
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
