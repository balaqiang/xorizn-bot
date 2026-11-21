// Fitur ai/luffy_ai — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("ai/luffy_ai", {
  "name": "luffyai",
  "command": [
    "luffyai",
    "luffy",
    "monkeydluffy",
    "mugiwara"
  ],
  "category": "ai",
  "desc": "Chat dengan Monkey D. Luffy — Calon Raja Bajak Laut dari Topi Jerami! 🏴‍☠️",
  "usage": ".luffyai <pertanyaan>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 10,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
