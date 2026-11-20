// Fitur group/unmutegc — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("group/unmutegc", {
  "name": "unmutegc",
  "command": [
    "unmutegc",
    "unmutegrup",
    "unmutebot",
    "unblockbot",
    "unlockbot"
  ],
  "category": "group",
  "desc": "Buka blokir command bot untuk member di grup",
  "usage": ".unmutegc",
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
