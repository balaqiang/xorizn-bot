// Fitur primbon/potensipenyakit — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("primbon/potensipenyakit", {
  "name": "potensipenyakit",
  "command": [
    "potensipenyakit",
    "cekpenyakit",
    "penyakit"
  ],
  "category": "primbon",
  "desc": "Cek potensi penyakit berdasarkan tanggal lahir",
  "usage": ".potensipenyakit <tgl> <bln> <thn>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
