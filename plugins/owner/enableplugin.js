// Fitur owner/enableplugin — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/enableplugin", {
  "name": "enableplugin",
  "command": [
    "enableplugin",
    "eplugin",
    "pluginenable",
    "onplugin"
  ],
  "category": "owner",
  "desc": "Mengaktifkan kembali plugin yang dinonaktifkan",
  "usage": ".enableplugin <nama_plugin>",
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
