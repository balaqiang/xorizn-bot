// Fitur owner/addkoin — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/addkoin", {
  "name": "addkoin",
  "command": [
    "addkoin",
    "tambahkoin",
    "givekoin",
    "addcoin",
    "adddcoin"
  ],
  "category": "owner",
  "desc": "Tambah koin user (max 9 Triliun)",
  "usage": ".addkoin <jumlah> @user",
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
