// Fitur ai/rimurubanana — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("ai/rimurubanana", {
  "name": "rimurubanana",
  "command": [
    "rimurubanana"
  ],
  "category": "ai",
  "desc": "Edit gambar dengan AI menggunakan prompt",
  "usage": ".rimurubanana <prompt>",
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
