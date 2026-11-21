// Fitur ai/zenithbanana — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("ai/zenithbanana", {
  "name": "zenithbanana",
  "command": [
    "zenithbanana"
  ],
  "category": "ai",
  "desc": "Edit gambar dengan AI menggunakan prompt",
  "usage": ".zenithbanana <prompt>",
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
