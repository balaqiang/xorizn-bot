// Fitur ai/rimuru-ai — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("ai/rimuru-ai", {
  "name": "rimuru-ai",
  "command": [
    "rimuru-ai",
    "rimuruai",
    "rimuru"
  ],
  "category": "ai",
  "desc": "Chat dengan vanXone — Asisten bot cerdas",
  "usage": ".rimuru-ai <pertanyaan>",
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
