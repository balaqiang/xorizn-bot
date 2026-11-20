// Fitur tools/plugintocase — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("tools/plugintocase", {
  "name": "plugintocase",
  "command": [
    "plugintocase",
    "plugin2case",
    "pluginconvert"
  ],
  "category": "tools",
  "desc": "Convert format plugin Baileys ke switch-case",
  "usage": ".plugintocase <reply kode plugin>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
