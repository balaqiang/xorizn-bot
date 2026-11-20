// Fitur tools/o-wink — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("tools/wink", {
  "name": "wink",
  "command": [
    "wink",
    "winkenhance",
    "winkhd",
    "wenhance"
  ],
  "category": "tools",
  "desc": "Meningkatkan kualitas video menjadi Ultra HD dengan Wink AI",
  "usage": ".wink (reply video)",
  "owner": false,
  "group": false,
  "private": false,
  "premium": true,
  "admin": false,
  "botAdmin": false,
  "cooldown": 120,
  "energi": 3,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
