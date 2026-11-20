// Fitur group/pinchat — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("group/pinchat", {
  "name": "pinchat",
  "command": [
    "pinchat",
    "pinmsg"
  ],
  "category": "group",
  "desc": "Pin pesan penting di grup",
  "usage": ".pinchat (reply pesan)",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "admin": true,
  "botAdmin": true,
  "cooldown": 10,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
