// Fitur owner/ambilfile — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("owner/ambilfile", {
  "name": "ambilfile",
  "command": [
    "ambilfile",
    "getfile",
    "downloadfile"
  ],
  "category": "owner",
  "desc": "Ambil file dari project bot tanpa perlu .js",
  "usage": ".ambilfile <nama file>",
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
