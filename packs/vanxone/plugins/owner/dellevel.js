// Fitur owner/dellevel — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/dellevel", {
  "name": "dellevel",
  "command": [
    "dellevel",
    "kuranglevel",
    "removelevel",
    "dellvl"
  ],
  "category": "owner",
  "desc": "Kurangi level user (via exp)",
  "usage": ".dellevel <jumlah> @user",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
