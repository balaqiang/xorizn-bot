// Fitur owner/addexp — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/addexp", {
  "name": "addexp",
  "command": [
    "addexp",
    "tambahexp",
    "giveexp",
    "addxp"
  ],
  "category": "owner",
  "desc": "Tambah exp user (max 9 Miliar)",
  "usage": ".addexp <jumlah> @user",
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
