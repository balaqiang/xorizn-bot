// Fitur owner/colongpp — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/colongpp", {
  "name": "colongpp",
  "command": [
    "colongpp",
    "stealpp",
    "malingpp",
    "ambilpp"
  ],
  "category": "owner",
  "desc": "Ambil & pakai foto profil target sebagai PP bot",
  "usage": ".colongpp (reply pesan target)",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
