// Fitur ai/gpt4o — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("ai/gpt4o", {
  "name": "gpt4o",
  "command": [
    "gpt4o",
    "gpt4"
  ],
  "category": "ai",
  "desc": "Chat dengan GPT-4o",
  "usage": ".gpt4o <pertanyaan>",
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
