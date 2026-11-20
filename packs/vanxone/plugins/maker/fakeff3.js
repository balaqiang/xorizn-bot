// Fitur maker/fakeff3 — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("maker/fakeff3", {
  "name": "fakeff3",
  "command": [
    "fakeff3",
    "fffake3",
    "fakecardff3",
    "profileff3"
  ],
  "category": "maker",
  "desc": "Membuat kartu profil/lobby Free Fire palsu (v3)",
  "usage": ".fakeff3 username|lobby",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
