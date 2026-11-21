// Fitur group/setwelcome — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("group/setwelcome", {
  "name": "setwelcome",
  "command": [
    "customwelcome"
  ],
  "category": "group",
  "desc": "Set custom welcome message",
  "usage": ".setwelcome <pesan>",
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
