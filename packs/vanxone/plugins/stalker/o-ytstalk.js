// Fitur stalker/o-ytstalk — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("stalker/ytstalk", {
  "name": "ytstalk",
  "command": [
    "ytstalk",
    "youtubestalk",
    "stalkyt"
  ],
  "category": "stalker",
  "desc": "Stalk channel YouTube",
  "usage": ".ytstalk <username>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 1,
  "needs": {
    "apikeys": [
      "firefly"
    ],
    "scrapers": [],
    "assets": []
  }
})
