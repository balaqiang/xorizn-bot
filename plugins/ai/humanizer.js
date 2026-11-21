// Fitur ai/humanizer — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("ai/humanizer", {
  "name": "humanize",
  "command": [
    "humanize",
    "humanizer",
    "aihumanize",
    "zerogpt"
  ],
  "category": "ai",
  "desc": "Ubah teks AI-generated jadi lebih natural (Humanized)",
  "usage": ".humanize <teks> (atau reply teks)",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
