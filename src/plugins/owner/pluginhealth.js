// Fitur owner/pluginhealth — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/pluginhealth", {
  "name": "pluginhealth",
  "command": [
    "pluginhealth",
    "ph",
    "scanplugin",
    "pluginscan",
    "phscan",
    "cekplugin"
  ],
  "category": "owner",
  "desc": "Scan semua plugin file — detect error, missing export, syntax issue (Owner Only)",
  "usage": ".pluginhealth [all|fail|ok|full|cat <kategori>|check <nama>]",
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
