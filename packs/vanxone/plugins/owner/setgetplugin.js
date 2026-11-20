// Fitur owner/setgetplugin — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/setgetplugin", {
  "name": "setgetplugin",
  "command": [
    "setgetplugin",
    "sgp",
    "getpluginvariant",
    "setgp"
  ],
  "category": "owner",
  "desc": "Mengatur variant tampilan getplugin",
  "usage": ".setgetplugin <v1-v3>",
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
