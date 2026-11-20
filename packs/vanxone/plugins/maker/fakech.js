// Fitur maker/fakech — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("maker/fakech", {
  "name": "fch",
  "command": [
    "fch",
    "chmaker"
  ],
  "category": "maker",
  "desc": "Membuat gambar profil Channel WhatsApp palsu dengan sentuhan Idol",
  "usage": ".fakech name|followers|desc|date (balas gambar)",
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
