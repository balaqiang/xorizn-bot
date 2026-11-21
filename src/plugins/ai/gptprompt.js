// Fitur ai/gptprompt — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("ai/gptprompt", {
  "name": "gpts",
  "command": [
    "gpts",
    "aichat"
  ],
  "category": "ai",
  "desc": "Chat dengan AI menggunakan persona custom (Style Xorizn ✨)",
  "usage": ".gptprompt prompt | teks",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
