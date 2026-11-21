// Fitur ai/summarize — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("ai/summarize", {
  "name": "summarize",
  "command": [
    "summarize",
    "sum",
    "tldr",
    "rangkum"
  ],
  "category": "ai",
  "desc": "Rangkum artikel dari URL, teks panjang, atau reply pesan",
  "usage": ".summarize <url/teks> atau reply pesan panjang",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 15,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
