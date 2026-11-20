// Fitur ai/mistralai — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("ai/mistralai", {
  "name": "mistral",
  "command": [
    "mistral",
    "mistralai",
    "chatmistral"
  ],
  "category": "ai",
  "desc": "AI Chat using Mistral AI",
  "usage": ".mistral <pesan>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
