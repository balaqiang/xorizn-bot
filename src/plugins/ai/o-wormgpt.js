// Fitur ai/o-wormgpt — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("ai/wormgpt", {
  "name": "wormgpt",
  "command": [
    "wormgpt",
    "worm"
  ],
  "category": "ai",
  "desc": "Chat dengan WormGPT (uncensored AI)",
  "usage": ".wormgpt <pertanyaan>",
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
