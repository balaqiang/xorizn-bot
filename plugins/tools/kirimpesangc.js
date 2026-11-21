// Fitur tools/kirimpesangc — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("tools/kirimpesangc", {
  "name": "kirimpesangc",
  "command": [
    "kirimpesangc",
    "sendgc",
    "pesangc"
  ],
  "category": "tools",
  "desc": "Kirim pesan ke group tertentu",
  "usage": ".kirimpesangc pesan",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
