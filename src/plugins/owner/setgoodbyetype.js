// Fitur owner/setgoodbyetype — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/setgoodbyetype", {
  "name": "setgoodbyetype",
  "command": [
    "setgoodbyetype",
    "goodbyetype",
    "goodbyevariant",
    "goodbyestyle"
  ],
  "category": "owner",
  "desc": "Mengatur variant tampilan goodbye message",
  "usage": ".setgoodbyetype",
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
