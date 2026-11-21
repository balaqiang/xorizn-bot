// Fitur owner/stopbcpc — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/stopbcpc", {
  "name": "stopbcpc",
  "command": [
    "stopbcpc",
    "stopbroadcastpc"
  ],
  "category": "owner",
  "desc": "Hentikan broadcast private yang sedang berjalan",
  "usage": ".stopbcpc",
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
