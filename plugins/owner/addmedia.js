// Fitur owner/addmedia — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/addmedia", {
  "name": "addmedia",
  "command": [
    "addmedia",
    "tambahmedia",
    "uploadmedia",
    "addasset"
  ],
  "category": "owner",
  "desc": "Tambah/ganti aset (URL) di config.assets lewat reply/kirim media atau link",
  "usage": ".addmedia <grup> <nama-aset> [url]",
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
