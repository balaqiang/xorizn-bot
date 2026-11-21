// Fitur group/cekabsen — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("group/cekabsen", {
  "name": "cekabsen",
  "command": [
    "cekabsen",
    "listabsen",
    "daftarabsen",
    "lihathadir"
  ],
  "category": "group",
  "desc": "Lihat daftar peserta yang sudah absen",
  "usage": ".cekabsen",
  "owner": false,
  "group": true,
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
