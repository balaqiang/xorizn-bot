// Fitur fun/sulap — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("fun/sulap", {
  "name": "sulap",
  "command": [
    "sulap",
    "magic",
    "magictrick"
  ],
  "category": "fun",
  "desc": "Pertunjukan sulap - kick member secara dramatis",
  "usage": ".sulap",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "admin": true,
  "botAdmin": true,
  "cooldown": 60,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
