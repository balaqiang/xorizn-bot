// Fitur owner/delexp — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/delexp", {
  "name": "delexp",
  "command": [
    "delexp",
    "kurangexp",
    "removeexp",
    "delxp"
  ],
  "category": "owner",
  "desc": "Kurangi exp user",
  "usage": ".delexp <jumlah> @user",
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
