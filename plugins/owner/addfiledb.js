// Fitur owner/addfiledb — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/addfiledb", {
  "name": "addfiledb",
  "command": [
    "addfiledb",
    "dbadd",
    "tambahdb"
  ],
  "category": "owner",
  "desc": "Tambah file JSON baru ke database",
  "usage": ".addfiledb [namafile] [folder]",
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
