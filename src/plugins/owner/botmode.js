// Fitur owner/botmode — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/botmode", {
  "name": "botmode",
  "command": [
    "botmode",
    "setmode"
  ],
  "category": "owner",
  "desc": "Mengatur mode bot (md/cpanel/store/pushkontak/all)",
  "usage": ".botmode <mode>",
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
