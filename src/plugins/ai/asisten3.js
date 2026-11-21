// Fitur ai/o-xorizn-ai — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("ai/xorizn-ai", {
  "name": "asisten3",
  "command": [
    "asisten3",
    "vxai3"
  ],
  "category": "ai",
  "desc": "Chat dengan xorizn-bot — Asisten bot cerdas",
  "usage": ".asisten3 <pertanyaan>",
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
