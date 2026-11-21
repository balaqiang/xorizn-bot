// Fitur ai/o-waguri-ai — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("ai/waguri-ai", {
  "name": "waguri-ai",
  "command": [
    "waguri-ai",
    "waguriai",
    "waguri"
  ],
  "category": "ai",
  "desc": "Chat dengan Waguri-san — Gadis pemalu yang lupa kacamata",
  "usage": ".waguri-ai <pertanyaan>",
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
