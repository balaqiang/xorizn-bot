// Fitur jpm/autojpm — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("jpm/autojpm", {
  "name": "autojpm",
  "command": [
    "autojpm",
    "autojasher",
    "autojaserm",
    "autojasabroadcast"
  ],
  "category": "broadcast",
  "desc": "Jadwalkan JPM otomatis dengan interval dan media",
  "usage": ".autojpm on <interval> <pesan>",
  "owner": true,
  "group": false,
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
