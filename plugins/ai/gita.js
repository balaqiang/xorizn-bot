// Fitur ai/gita — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("ai/gita", {
  "name": "gita",
  "command": [
    "gita",
    "gitagpt",
    "bhagavadgita"
  ],
  "category": "ai",
  "desc": "Chat dengan Gita GPT (Bhagavad Gita AI)",
  "usage": ".gita <pertanyaan>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
