// Fitur owner/star — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/star", {
  "name": "star",
  "command": [
    "star",
    "bintang"
  ],
  "category": "owner",
  "desc": "Beri/hapus bintang pada pesan",
  "usage": ".star (reply pesan) atau .star hapus (reply pesan)",
  "owner": true,
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
