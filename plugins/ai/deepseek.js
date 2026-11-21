// Fitur ai/deepseek — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("ai/deepseek", {
  "name": "deepseek",
  "command": [
    "deepseek",
    "ds",
    "dsv4",
    "deepthink"
  ],
  "category": "ai",
  "desc": "Chat dengan DeepSeek V4 (thinking/reasoning)",
  "usage": ".deepseek <pertanyaan>",
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
      "deepseek"
    ],
    "assets": []
  }
})
