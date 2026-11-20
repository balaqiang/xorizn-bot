// Fitur stalker/ytvidstalk — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("stalker/ytvidstalk", {
  "name": "ytvidstalk",
  "command": [
    "ytvidstalk",
    "videostalk",
    "stalkvideo",
    "ytvstalk"
  ],
  "category": "stalker",
  "desc": "Stalk info detail video YouTube (tanpa download)",
  "usage": ".ytvidstalk <url/id video>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 10,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
