// Fitur owner/setwelcometype — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/setwelcometype", {
  "name": "setwelcometype",
  "command": [
    "setwelcometype",
    "welcometype",
    "welcomevariant",
    "welcomestyle"
  ],
  "category": "owner",
  "desc": "Mengatur variant tampilan welcome message",
  "usage": ".setwelcometype",
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
