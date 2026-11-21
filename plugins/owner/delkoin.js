// Fitur owner/delkoin — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/delkoin", {
  "name": "delkoin",
  "command": [
    "delkoin",
    "kurangkoin",
    "removekoin",
    "delcoin",
    "delmoney"
  ],
  "category": "owner",
  "desc": "Kurangi koin user",
  "usage": ".delkoin <jumlah> @user",
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
