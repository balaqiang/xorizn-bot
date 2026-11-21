// Fitur ai/zenithbanana2 — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("ai/zenithbanana2", {
  "name": "zenithbanana2",
  "command": [
    "zenithbanana2"
  ],
  "category": "ai",
  "desc": "Buat gambar dengan AI menggunakan prompt",
  "usage": ".zenithbanana2 <prompt>",
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
