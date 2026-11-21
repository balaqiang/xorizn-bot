// Fitur ai/muslimai — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("ai/muslimai", {
  "name": "muslimai",
  "command": [
    "muslimai",
    "islamai",
    "quranai"
  ],
  "category": "ai",
  "desc": "AI untuk bertanya tentang Islam dan Al-Quran",
  "usage": ".muslimai <pertanyaan>",
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
