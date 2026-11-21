// Fitur ai/o-tofigurev2 — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("ai/tofigurev2", {
  "name": "tofigurev2",
  "command": [
    "tofigurev2",
    "figurev2",
    "figure2"
  ],
  "category": "ai",
  "desc": "Ubah gambar ke style Figure v2",
  "usage": ".tofigurev2 (reply gambar)",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 30,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
