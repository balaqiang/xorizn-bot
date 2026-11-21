// Fitur ai/jokowi-ai — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("ai/jokowi-ai", {
  "name": "jokowi-ai",
  "command": [
    "jokowi-ai",
    "jokowiai",
    "jokowi",
    "pakjokowi"
  ],
  "category": "ai",
  "desc": "Chat dengan Pak Jokowi — Pria Solo",
  "usage": ".jokowi-ai <pertanyaan>",
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
      "unlimitedai"
    ],
    "assets": []
  }
})
