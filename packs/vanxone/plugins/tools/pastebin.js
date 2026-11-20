// Fitur tools/pastebin — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("tools/pastebin", {
  "name": "pastebin",
  "command": [
    "paste",
    "pb"
  ],
  "category": "tools",
  "desc": "Upload teks ke Pastebin",
  "usage": ".pastebin <text>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
