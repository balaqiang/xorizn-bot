// Fitur owner/templateplugin — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/templateplugin", {
  "name": "templateplugin",
  "command": [
    "templateplugin",
    "tplplugin",
    "plugin-template"
  ],
  "category": "owner",
  "desc": "Generate plugin template (Owner Only)",
  "usage": ".templateplugin",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 0,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
