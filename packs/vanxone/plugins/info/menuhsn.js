// Fitur main/menuhsn — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("main/menuhsn", {
  "name": "menuhsn",
  "command": [
    "menuhsn",
    "mh",
    "category",
    "hsn"
  ],
  "category": "info",
  "desc": "Menampilkan commands dalam kategori tertentu",
  "usage": ".menuhsn <kategori>",
  "owner": false,
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
