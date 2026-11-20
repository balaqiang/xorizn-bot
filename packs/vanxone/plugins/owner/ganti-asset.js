// Fitur owner/ganti-asset — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/ganti-asset", {
  "name": "ganti-asset",
  "command": [
    "ganti-asset",
    "gantiasset",
    "setasset"
  ],
  "category": "owner",
  "desc": "All-in-one tools untuk ganti asset secara interaktif",
  "usage": ".ganti-asset (reply media)",
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
