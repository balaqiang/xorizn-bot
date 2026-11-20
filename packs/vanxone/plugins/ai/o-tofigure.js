// Fitur ai/o-tofigure — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("ai/tofigure", {
  "name": "tofigure",
  "command": [
    "tofigure",
    "figure",
    "figurestyle"
  ],
  "category": "ai",
  "desc": "Ubah gambar ke style Figure/Action",
  "usage": ".tofigure (reply gambar)",
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
