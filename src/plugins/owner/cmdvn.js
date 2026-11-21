// Fitur owner/cmdvn — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/cmdvn", {
  "name": "cmdvn",
  "command": [
    "cmdvn",
    "voicecommand",
    "vncmd"
  ],
  "category": "owner",
  "desc": "Aktifkan command via voice note",
  "usage": ".cmdvn <on/off>",
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
