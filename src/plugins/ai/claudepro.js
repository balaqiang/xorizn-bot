// Fitur ai/claudepro — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("ai/claudepro", {
  "name": "claudepro",
  "command": [
    "claudepro",
    "cldpro",
    "aipro"
  ],
  "category": "ai",
  "desc": "AI Chat + Vision (Claude-Pro)",
  "usage": ".claudepro <text> (reply gambar opsional)",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
