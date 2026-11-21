// Fitur owner/addenergi — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/addenergi", {
  "name": "addenergi",
  "command": [
    "addenergi",
    "tambahenergi",
    "giveenergi",
    "addenergy"
  ],
  "category": "owner",
  "desc": "Tambah energi user",
  "usage": ".addenergi <jumlah> @user",
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
