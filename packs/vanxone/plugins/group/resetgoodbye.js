// Fitur group/resetgoodbye — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("group/resetgoodbye", {
  "name": "resetgoodbye",
  "command": [
    "resetgoodbye",
    "delgoodbye",
    "cleargoodbye"
  ],
  "category": "group",
  "desc": "Reset goodbye message ke default",
  "usage": ".resetgoodbye",
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
