// Fitur owner/ambilfolder — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("owner/ambilfolder", {
  "name": "ambilfolder",
  "command": [
    "ambilfolder",
    "ambifolde",
    "getfolder"
  ],
  "category": "owner",
  "desc": "Ambil folder dan kirim sebagai zip",
  "usage": ".ambilfolder path/folder",
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
