// Fitur owner/listsewa — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/listsewa", {
  "name": "listsewa",
  "command": [
    "sewalist",
    "daftarsewa"
  ],
  "category": "owner",
  "desc": "Lihat daftar grup yang terdaftar sewa",
  "usage": ".listsewa",
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
