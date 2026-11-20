// Fitur ai/vemzo-ai — kode inti di engine/orbit
module.exports = require('../../lib/engine/orbit').plugin("ai/vemzo-ai", {
  "name": "asisten2",
  "command": [
    "asisten2",
    "vxai2"
  ],
  "category": "ai",
  "desc": "Chat dengan vanXone — Asisten bot cerdas",
  "usage": ".asisten2 <pertanyaan>",
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
