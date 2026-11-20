// Fitur group/welcome — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("group/welcome", {
  "name": "welcome",
  "command": [
    "wc"
  ],
  "category": "group",
  "desc": "Mengatur welcome message untuk grup",
  "usage": ".welcome <on/off>",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "admin": true,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
