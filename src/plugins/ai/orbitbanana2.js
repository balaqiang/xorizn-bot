// Fitur ai/orbitbanana2 — kode inti di engine/orbit
module.exports = require('../../lib/engine/orbit').plugin("ai/orbitbanana2", {
  "name": "orbitbanana2",
  "command": [
    "orbitbanana2"
  ],
  "category": "ai",
  "desc": "Buat gambar dengan AI menggunakan prompt",
  "usage": ".orbitbanana2 <prompt>",
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
