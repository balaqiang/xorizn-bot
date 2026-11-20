// Fitur stalker/npmstalk — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("stalker/npmstalk", {
  "name": "npmstalk",
  "command": [
    "npmstalk",
    "stalknpm",
    "npms"
  ],
  "category": "stalker",
  "desc": "Stalk akun NPM (Node Package Manager)",
  "usage": ".npmstalk <username>",
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
