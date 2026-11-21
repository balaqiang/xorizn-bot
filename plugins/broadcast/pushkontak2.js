// Fitur pushkontak/pushkontak2 — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("pushkontak/pushkontak2", {
  "name": "pushkontak2",
  "command": [
    "pushkontak2",
    "puskontak2",
    "push2"
  ],
  "category": "broadcast",
  "desc": "Push pesan dengan nama kontak ke semua member grup",
  "usage": ".pushkontak2 <pesan>|<namakontak>",
  "owner": true,
  "group": true,
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
