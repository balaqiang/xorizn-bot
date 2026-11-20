// Fitur religi/istighfar — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("religi/istighfar", {
  "name": "istighfar",
  "command": [
    "istighfar",
    "sayyidulistighfar",
    "sayyidul"
  ],
  "category": "islam",
  "desc": "Sayyidul Istighfar (Doa Istighfar Terbaik) lengkap Arab, Latin, Arti, dan Keutamaan",
  "usage": ".istighfar",
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
