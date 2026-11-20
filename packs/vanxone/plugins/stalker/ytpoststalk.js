// Fitur stalker/ytpoststalk — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("stalker/ytpoststalk", {
  "name": "ytpoststalk",
  "command": [
    "ytpoststalk",
    "communitystalk",
    "stalkpost"
  ],
  "category": "stalker",
  "desc": "Stalk info detail Community Post YouTube (tanpa download)",
  "usage": ".ytpoststalk <url post>",
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
