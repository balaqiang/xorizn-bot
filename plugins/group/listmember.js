// Fitur group/listmember — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("group/listmember", {
  "name": "listmember",
  "command": [
    "listmember",
    "memberlist",
    "daftarmember",
    "listanggota"
  ],
  "category": "group",
  "desc": "Menampilkan daftar anggota grup",
  "usage": ".listmember",
  "owner": false,
  "group": true,
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
