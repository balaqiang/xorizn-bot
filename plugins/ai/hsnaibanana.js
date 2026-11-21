// Fitur ai/hsnaibanana — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("ai/hsnaibanana", {
  "name": "hsnaibanana",
  "command": [
    "hsnaibanana"
  ],
  "category": "ai",
  "desc": "Edit gambar dengan AI menggunakan prompt (nano-banana)",
  "usage": ".hsnaibanana <prompt>",
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
