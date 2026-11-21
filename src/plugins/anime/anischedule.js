// Fitur anime/anischedule — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("anime/anischedule", {
  "name": "anischedule",
  "command": [
    "anischedule",
    "animejadwal",
    "jadwalanime",
    "animeday"
  ],
  "category": "anime",
  "desc": "Menampilkan jadwal tayang anime musim ini (ambil dari API livechart)",
  "usage": ".anischedule [hari] [musim]",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "cooldown": 10,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
