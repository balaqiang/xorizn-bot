// Fitur owner/addfile — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/addfile", {
  "name": "addfile",
  "command": [
    "addfile",
    "newfile",
    "buatfile"
  ],
  "category": "owner",
  "desc": "Tambah file baru di server via path (gagal kalau file sudah ada)",
  "usage": ".addfile <path>",
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
