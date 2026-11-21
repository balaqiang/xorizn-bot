// Fitur clan/clanwarhistory — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("clan/clanwarhistory", {
  "name": "clanwarhistory",
  "command": [
    "clanwarhistory",
    "warhistory",
    "historywar",
    "riwayatwar"
  ],
  "category": "rpg",
  "desc": "Lihat riwayat clan war",
  "usage": ".clanwarhistory",
  "owner": false,
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
