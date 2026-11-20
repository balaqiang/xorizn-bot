// Fitur owner/bcpc — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/bcpc", {
  "name": "bcpc",
  "command": [
    "bcpc",
    "broadcastpc",
    "bcprivate"
  ],
  "category": "owner",
  "desc": "Broadcast pesan ke semua kontak private chat",
  "usage": ".bcpc <pesan>",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
