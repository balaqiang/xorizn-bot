// Fitur user/listdaftar — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("user/listdaftar", {
  "name": "listdaftar",
  "command": [
    "listdaftar",
    "listuser",
    "registeredusers",
    "daftarlist"
  ],
  "category": "profil",
  "desc": "Lihat daftar user yang sudah terdaftar dengan filter dan pagination",
  "usage": ".listdaftar [page <nomor>] [search <nama>] [sort terbaru]",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
