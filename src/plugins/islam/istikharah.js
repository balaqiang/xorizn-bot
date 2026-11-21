// Fitur religi/istikharah — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("religi/istikharah", {
  "name": "istikharah",
  "command": [
    "istikharah",
    "sholatistikharah",
    "istikhoroh",
    "istikharoh"
  ],
  "category": "islam",
  "desc": "Panduan Sholat Istikharah lengkap (tata cara, doa, waktu, dan keutamaan)",
  "usage": ".istikharah",
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
