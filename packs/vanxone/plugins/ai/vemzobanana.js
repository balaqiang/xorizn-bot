// Fitur ai/vemzobanana — kode inti di engine/orbit
module.exports = require('../../lib/engine/orbit').plugin("ai/vemzobanana", {
  "name": "vemzobanana",
  "command": [
    "vemzobanana"
  ],
  "category": "ai",
  "desc": "Edit gambar dengan AI menggunakan prompt",
  "usage": ".vemzobanana <prompt>",
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
