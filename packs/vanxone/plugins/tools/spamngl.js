// Fitur tools/spamngl — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("tools/spamngl", {
  "name": "spamngl",
  "command": [
    "spamngl"
  ],
  "category": "tools",
  "desc": "Send NGL Spam",
  "usage": ".spamngl <url> | <text> | <jumlah>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
