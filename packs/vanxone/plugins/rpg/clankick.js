// Fitur clan/clankick — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("clan/clankick", {
  "name": "clankick",
  "command": [
    "clankick",
    "kickclan"
  ],
  "category": "rpg",
  "desc": "Kick member dari clan (leader only)",
  "usage": ".clankick @user",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
