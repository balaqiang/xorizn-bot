// Fitur ai/chatgot — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("ai/chatgot", {
  "name": "chatgot",
  "command": [
    "chatgot",
    "cgot",
    "gotai"
  ],
  "category": "ai",
  "desc": "Chat AI via ChatGot (multi model)",
  "usage": ".chatgot [model] <pertanyaan>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
