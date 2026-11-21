// Fitur premium/ytsummarize — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("premium/ytsummarize", {
  "name": "ytsummarize",
  "command": [
    "ytsummarize",
    "ytsummary",
    "summarizeyt",
    "ringkasyt"
  ],
  "category": "Premium",
  "desc": "Ringkasan video YouTube dengan AI",
  "usage": ".ytsummarize <url>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": true,
  "cooldown": 60,
  "energi": 3,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
