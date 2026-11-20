// Fitur group/botmodegc — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("group/botmodegc", {
  "name": "botmodegc",
  "command": [
    "botmodegc",
    "setmodegc",
    "modegc"
  ],
  "category": "group",
  "desc": "Atur mode bot untuk grup ini",
  "usage": ".botmode <md/cpanel/pushkontak/store/otp>",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
