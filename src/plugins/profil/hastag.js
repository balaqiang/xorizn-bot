// Fitur user/hastag — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("user/hastag", {
  "name": "hastag",
  "command": [
    "hastag",
    "sethastag",
    "formathastag"
  ],
  "category": "profil",
  "desc": "Menampilkan template hastag KGR dengan tombol copy otomatis",
  "usage": ".hastag",
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
