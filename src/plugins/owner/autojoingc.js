// Fitur owner/autojoingc — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/autojoingc", {
  "name": "autojoingc",
  "command": [
    "autojoingc",
    "autojoin",
    "autojoingroup"
  ],
  "category": "owner",
  "desc": "Auto join grup dari link yang terdeteksi di chat",
  "usage": ".autojoingc on/off",
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
