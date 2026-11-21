// Fitur owner/setinfoplugin — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/setinfoplugin", {
  "name": "setinfoplugin",
  "command": [
    "setinfoplugin",
    "infopluginvariant",
    "infopluginstyle",
    "sipv"
  ],
  "category": "owner",
  "desc": "Mengatur variant tampilan notif info plugin (add/del). Gunakan #test untuk preview ke test channel.",
  "usage": ".setinfoplugin <v1-v5> [#test] / .setinfoplugin #set <link/jid>",
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
