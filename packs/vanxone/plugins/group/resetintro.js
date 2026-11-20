// Fitur group/resetintro — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("group/resetintro", {
  "name": "resetintro",
  "command": [
    "resetintro",
    "introdel",
    "deleteintro"
  ],
  "category": "group",
  "desc": "Reset intro grup ke default (admin only)",
  "usage": ".resetintro",
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
