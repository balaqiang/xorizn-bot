// Fitur owner/testplugin — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/testplugin", {
  "name": "testplugin",
  "command": [
    "testplugin",
    "dryrun",
    "simulateplugin"
  ],
  "category": "owner",
  "desc": "Simulasi eksekusi command tanpa efek samping (dry run) — buat ngetes plugin baru",
  "usage": ".testplugin <command> [args]",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 0,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
