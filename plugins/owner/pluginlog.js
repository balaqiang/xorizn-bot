// Fitur owner/pluginlog — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/pluginlog", {
  "name": "pluginlog",
  "command": [
    "pluginlog",
    "plog",
    "logerr",
    "errplugin",
    "pluginerr",
    "cekerrplugin"
  ],
  "category": "owner",
  "desc": "Filter error log per nama plugin/command, lihat stacktrace lengkap, dan analisis pola error",
  "usage": ".pluginlog <nama> | .pluginlog <nama> full | .pluginlog <nama> clear",
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
