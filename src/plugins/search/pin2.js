// Fitur search/pin2 — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("search/pin2", {
  "name": "pin2",
  "command": [
    "pin2",
    "pinterest2"
  ],
  "category": "search",
  "desc": "Cari satu gambar acak di Pinterest dengan tombol next",
  "usage": ".pin2 <query>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
