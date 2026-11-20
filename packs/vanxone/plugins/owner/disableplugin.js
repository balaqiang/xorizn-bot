// Fitur owner/disableplugin — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/disableplugin", {
  "name": "disableplugin",
  "command": [
    "disableplugin",
    "dplugin",
    "plugindisable",
    "offplugin"
  ],
  "category": "owner",
  "desc": "Menonaktifkan plugin tertentu",
  "usage": ".disableplugin <nama_plugin>",
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
