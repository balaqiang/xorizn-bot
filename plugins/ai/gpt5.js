// Fitur ai/gpt5 — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("ai/gpt5", {
  "name": "gpt5",
  "command": [
    "gpt5",
    "gpt5nano",
    "gpt41"
  ],
  "category": "ai",
  "desc": "Chat dengan GPT-4.1 Nano via OverChat",
  "usage": ".gpt5 <pertanyaan>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [
      "gpt5"
    ],
    "assets": []
  }
})
