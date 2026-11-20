// Fitur owner/setlimitdefault — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/setlimitdefault", {
  "name": "setlimitdefault",
  "command": [
    "setlimitdefault",
    "setdefaultlimit",
    "limitdefault"
  ],
  "category": "owner",
  "desc": "Set default limit untuk user baru",
  "usage": ".setlimitdefault <jumlah>",
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
