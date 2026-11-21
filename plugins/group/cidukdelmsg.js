// Fitur group/cidukdelmsg — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("group/cidukdelmsg", {
  "name": "cidukdelmsg",
  "command": [
    "cidukdelmsg",
    "ciduk"
  ],
  "category": "group",
  "desc": "Ciduk user yang hapus pesan! Bot kirim stiker kalau ada pesan dihapus di grup.",
  "usage": ".cidukdelmsg <on/off/add/list>",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
