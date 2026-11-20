// Fitur search/carisinyal — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("search/carisinyal", {
  "name": "spekhp",
  "command": [
    "spekhp",
    "spek",
    "spesifikasi"
  ],
  "category": "search",
  "desc": "Mencari spesifikasi lengkap smartphone dari Carisinyal.",
  "usage": ".spekhp <nama hp>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
