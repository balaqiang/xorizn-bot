// Fitur owner/getfiledb — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/getfiledb", {
  "name": "getfiledb",
  "command": [
    "getfiledb",
    "dbget",
    "ambildb"
  ],
  "category": "owner",
  "desc": "Ambil file JSON dari database",
  "usage": ".getfiledb [namafile] [folder]",
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
