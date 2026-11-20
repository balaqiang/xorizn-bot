// Fitur owner/sewabot — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/sewabot", {
  "name": "sewabot",
  "command": [
    "sewabot"
  ],
  "category": "owner",
  "desc": "Toggle dan kelola sistem sewa bot",
  "usage": ".sewabot <on/off/leave/status>",
  "owner": true,
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
