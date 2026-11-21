// Fitur owner/consolelog — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/consolelog", {
  "name": "consolelog",
  "command": [
    "consolelog",
    "clog",
    "ceklog",
    "logconsole",
    "clearconsolelog",
    "statsclog"
  ],
  "category": "owner",
  "desc": "Lihat, filter, dan kelola console.log dari file plugin",
  "usage": ".consolelog [recent|stats|clear|clearold <hari>|find <kata>]",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
