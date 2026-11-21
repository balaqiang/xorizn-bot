// Fitur group/resetlinkgc — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("group/resetlinkgc", {
  "name": "resetlinkgc",
  "command": [
    "resetlinkgc",
    "revokelink",
    "newlink"
  ],
  "category": "group",
  "desc": "Reset link invite grup",
  "usage": ".resetlinkgc",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "admin": true,
  "botAdmin": true,
  "cooldown": 60,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
