// Fitur owner/sampah — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/sampah", {
  "name": "sampah",
  "command": [
    "sampah",
    "clearsampah",
    "cleartemp",
    "deltemp"
  ],
  "category": "owner",
  "desc": "Menghapus semua sampah di temp",
  "usage": ".sampah",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 60,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
