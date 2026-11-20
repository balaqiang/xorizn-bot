// Fitur owner/setkoin — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/setkoin", {
  "name": "setkoin",
  "command": [
    "setkoin",
    "setexp",
    "setxp",
    "setcoin",
    "resetkoin",
    "resetexp"
  ],
  "category": "owner",
  "desc": "Set koin/exp user ke nilai tertentu langsung",
  "usage": ".setkoin <jumlah> @user | .setexp <jumlah> @user | .resetkoin @user | .resetexp @user",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
