// Fitur owner/setmenuaurora — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/setmenuaurora", {
  "name": "setmenuaurora",
  "command": [
    "setmenuaurora",
    "menuaurorastyle",
    "menuauroravariant"
  ],
  "category": "owner",
  "desc": "Mengatur variant tampilan menuaurora",
  "usage": ".setmenuaurora <v1-v5>",
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
