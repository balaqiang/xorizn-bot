// Fitur religi/sholawat — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("religi/sholawat", {
  "name": "sholawat",
  "command": [
    "sholawat",
    "shalawat",
    "selawat",
    "sholawatnabi"
  ],
  "category": "islam",
  "desc": "Kumpulan Sholawat Nabi lengkap dengan Arab, Latin, Arti, dan Keutamaan",
  "usage": ".sholawat <nama sholawat>",
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
