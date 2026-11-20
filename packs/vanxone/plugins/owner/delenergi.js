// Fitur owner/delenergi — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/delenergi", {
  "name": "delenergi",
  "command": [
    "delenergi",
    "kurangenergi",
    "removeenergi",
    "hapusenergi",
    "delenergy"
  ],
  "category": "owner",
  "desc": "Kurangi energi user",
  "usage": ".delenergi <jumlah> @user",
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
