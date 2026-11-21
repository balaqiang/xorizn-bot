// Fitur ai/zenith-ai — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("ai/zenith-ai", {
  "name": "zenith-ai",
  "command": [
    "zenith-ai",
    "zenithai",
    "zenith"
  ],
  "category": "ai",
  "desc": "Chat dengan xorizn-bot — Asisten bot cerdas",
  "usage": ".zenith-ai <pertanyaan>",
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
