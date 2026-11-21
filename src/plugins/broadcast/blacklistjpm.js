// Fitur jpm/blacklistjpm — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("jpm/blacklistjpm", {
  "name": "blacklistjpm",
  "command": [
    "blacklistjpm",
    "bljpm",
    "jpmbl",
    "jpmblacklist",
    "listblacklistjpm"
  ],
  "category": "broadcast",
  "desc": "Blacklist grup dari JPM dengan interactive buttons",
  "usage": ".blacklistjpm",
  "owner": true,
  "group": false,
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
