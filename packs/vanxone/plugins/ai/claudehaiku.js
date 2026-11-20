// Fitur ai/claudehaiku — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("ai/claudehaiku", {
  "name": "claudehaiku",
  "command": [
    "claudehaiku",
    "claude",
    "haiku",
    "chiku"
  ],
  "category": "ai",
  "desc": "Chat dengan Claude Haiku 4.5 via OverChat",
  "usage": ".claudehaiku <pertanyaan>",
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
      "claudehaiku"
    ],
    "assets": []
  }
})
