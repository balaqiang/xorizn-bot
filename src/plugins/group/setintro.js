// Fitur group/setintro — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("group/setintro", {
  "name": "setintro",
  "command": [
    "setperkenalan",
    "introset"
  ],
  "category": "group",
  "desc": "Set pesan intro grup (admin only)",
  "usage": ".setintro <pesan>",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "admin": true,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
