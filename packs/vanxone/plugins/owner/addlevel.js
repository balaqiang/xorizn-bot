// Fitur owner/addlevel — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/addlevel", {
  "name": "addlevel",
  "command": [
    "addlevel",
    "tambahlevel",
    "givelevel",
    "addlvl"
  ],
  "category": "owner",
  "desc": "Tambah level user (via exp)",
  "usage": ".addlevel <jumlah> @user",
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
