// Fitur clan/clanraport — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("clan/clanraport", {
  "name": "clanreport",
  "command": [
    "clanreport",
    "reportclan",
    "laporanclan",
    "aktivitasclan"
  ],
  "category": "rpg",
  "desc": "Lihat laporan aktivitas clan",
  "usage": ".clanreport",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 10,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
