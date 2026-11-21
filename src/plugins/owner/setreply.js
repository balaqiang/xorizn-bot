// Fitur owner/setreply — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/setreply", {
  "name": "setreply",
  "command": [
    "setreply",
    "replyvariant",
    "replystyle"
  ],
  "category": "owner",
  "desc": "Mengatur variant tampilan reply",
  "usage": ".setreply <v1-v11>",
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
