// Fitur owner/sistemdaftar — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/sistemdaftar", {
  "name": "sistemdaftar",
  "command": [
    "sistemdaftar",
    "regmode",
    "wajibdaftar",
    "togglereg"
  ],
  "category": "owner",
  "desc": "Kelola sistem wajib daftar dan statistik pendaftaran",
  "usage": ".sistemdaftar <on/off/stats>",
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
