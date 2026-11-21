// Fitur group/slowmode — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("group/slowmode", {
  "name": "slowmode",
  "command": [
    "slowmode",
    "slow",
    "setslowmode"
  ],
  "category": "group",
  "desc": "Slowmode grup — batasi kecepatan pesan member",
  "usage": ".slowmode <on/off/onlycommand> [detik]",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "admin": true,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
