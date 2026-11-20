// Fitur owner/d-self — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/self", {
  "name": "self2",
  "command": [
    "self2",
    "selfmode",
    "private-mode"
  ],
  "category": "owner",
  "desc": "Mengaktifkan mode self (hanya owner & bot yang bisa akses)",
  "usage": ".self2",
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
