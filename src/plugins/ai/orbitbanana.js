// Fitur ai/orbitbanana — kode inti di engine/orbit
module.exports = require('../../lib/engine/orbit').plugin("ai/orbitbanana", {
  "name": "orbitbanana",
  "command": [
    "orbitbanana"
  ],
  "category": "ai",
  "desc": "Edit gambar dengan AI menggunakan prompt",
  "usage": ".orbitbanana <prompt>",
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
