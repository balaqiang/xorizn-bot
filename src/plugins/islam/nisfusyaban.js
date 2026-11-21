// Fitur religi/nisfusyaban — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("religi/nisfusyaban", {
  "name": "nisfusyaban",
  "command": [
    "nisfusyaban",
    "nisfu",
    "malamnisfu",
    "syaban"
  ],
  "category": "islam",
  "desc": "Informasi lengkap tentang Malam Nisfu Syaban (doa, amalan, keutamaan)",
  "usage": ".nisfusyaban",
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
