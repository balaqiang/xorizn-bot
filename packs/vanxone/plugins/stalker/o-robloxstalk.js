// Fitur stalker/o-robloxstalk — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("stalker/robloxstalk", {
  "name": "robloxstalk",
  "command": [
    "robloxstalk",
    "rblxstalk",
    "rbxstalk",
    "stalkroblox",
    "stalkrbx"
  ],
  "category": "stalker",
  "desc": "Stalk akun Roblox berdasarkan username",
  "usage": ".robloxstalk <username>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
