// Fitur ai/o-prabowo-ai — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("ai/prabowo-ai", {
  "name": "prabowo-ai",
  "command": [
    "prabowo-ai",
    "prabowoi",
    "prabowo",
    "pakprabowo"
  ],
  "category": "ai",
  "desc": "Chat dengan Pak Prabowo — Pria Sawit",
  "usage": ".prabowo-ai <pertanyaan>",
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
    "scrapers": [],
    "assets": []
  }
})
