// Fitur owner/setgreettype — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/setgreettype", {
  "name": "setgreettype",
  "command": [
    "setgreettype",
    "greettype",
    "greetvariant",
    "greetstyle",
    "setgreet"
  ],
  "category": "owner",
  "desc": "Mengatur variant tampilan autogreet (pagi/malam) ke Channel",
  "usage": ".setgreettype <v1-v7>",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
