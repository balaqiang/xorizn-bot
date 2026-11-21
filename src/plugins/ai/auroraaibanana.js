// Fitur ai/auroraaibanana — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("ai/auroraaibanana", {
  "name": "auroraaibanana",
  "command": [
    "auroraaibanana"
  ],
  "category": "ai",
  "desc": "Edit gambar dengan AI menggunakan prompt (nano-banana)",
  "usage": ".auroraaibanana <prompt>",
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
