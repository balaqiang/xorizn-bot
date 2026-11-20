// Fitur ai/vemzobanana2 — kode inti di engine/orbit
module.exports = require('../../lib/engine/orbit').plugin("ai/vemzobanana2", {
  "name": "vemzobanana2",
  "command": [
    "vemzobanana2"
  ],
  "category": "ai",
  "desc": "Buat gambar dengan AI menggunakan prompt",
  "usage": ".vemzobanana2 <prompt>",
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
