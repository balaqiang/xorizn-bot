// Fitur owner/setownertype — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/setownertype", {
  "name": "setownertype",
  "command": [
    "setownertype",
    "ownertype",
    "ownervariant",
    "ownerstyle"
  ],
  "category": "owner",
  "desc": "Mengatur variant tampilan owner message",
  "usage": ".setownertype",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
