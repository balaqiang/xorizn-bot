// Fitur owner/onlypc — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/onlypc", {
  "name": "onlypc",
  "command": [
    "onlypc",
    "onlyprivate",
    "privateonly"
  ],
  "category": "owner",
  "desc": "Toggle mode bot hanya di private chat",
  "usage": ".onlypc on/off",
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
