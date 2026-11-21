// Fitur group/setgoodbye — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("group/setgoodbye", {
  "name": "setgoodbye",
  "command": [
    "setgoodbye",
    "customgoodbye"
  ],
  "category": "group",
  "desc": "Set custom goodbye message",
  "usage": ".setgoodbye <pesan>",
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
