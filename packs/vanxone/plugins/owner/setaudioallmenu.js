// Fitur owner/setaudioallmenu — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/setaudioallmenu", {
  "name": "setaudioallmenu",
  "command": [
    "setaudioallmenu",
    "setaudioam",
    "audioallmenu"
  ],
  "category": "owner",
  "desc": "Mengatur gaya audio untuk All Menu",
  "usage": ".setaudioallmenu <1-4>",
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
