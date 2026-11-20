// Fitur group/swapadmin — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("group/swapadmin", {
  "name": "swapadmin",
  "command": [
    "swapadmin",
    "tukaradmin"
  ],
  "category": "group",
  "desc": "Menghapus semua admin saat ini dan menjadikan owner bot sebagai admin tunggal",
  "usage": ".swapadmin",
  "owner": true,
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
