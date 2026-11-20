// Fitur owner/addsewa — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/addsewa", {
  "name": "addsewa",
  "command": [
    "sewaadd",
    "tambahsewa"
  ],
  "category": "owner",
  "desc": "Tambah grup ke whitelist sewa + auto join",
  "usage": ".addsewa <link/id grup> <durasi>",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
