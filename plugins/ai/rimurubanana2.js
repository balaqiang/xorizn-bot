// Fitur ai/rimurubanana2 — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("ai/rimurubanana2", {
  "name": "rimurubanana2",
  "command": [
    "rimurubanana2"
  ],
  "category": "ai",
  "desc": "Buat gambar dengan AI menggunakan prompt",
  "usage": ".rimurubanana2 <prompt>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 30,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
