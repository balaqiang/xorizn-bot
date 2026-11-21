// Fitur owner/setallmenu — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("owner/setallmenu", {
  "name": "setallmenu",
  "command": [
    "setallmenu",
    "allmenuvariant",
    "allmenustyle"
  ],
  "category": "owner",
  "desc": "Mengatur variant tampilan allmenu",
  "usage": ".setallmenu <v1-v9>",
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
