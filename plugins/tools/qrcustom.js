// Fitur tools/qrcustom — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("tools/qrcustom", {
  "name": "qrcustom",
  "command": [
    "qrcustom"
  ],
  "category": "tools",
  "desc": "Generate QR code custom dengan logo",
  "usage": ".qrcustom <url>",
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
