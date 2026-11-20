// Fitur ai/o-qwen3 — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("ai/qwen3", {
  "name": "qwen3",
  "command": [
    "qwen3",
    "qwen",
    "qw3"
  ],
  "category": "ai",
  "desc": "Chat dengan Qwen3 80B via OverChat",
  "usage": ".qwen3 <pertanyaan>",
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
