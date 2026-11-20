// Fitur group/groupsummary — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("group/groupsummary", {
  "name": "groupsummary",
  "command": [
    "groupsummary",
    "gsummary",
    "rekapgrup",
    "aktivitasgrup"
  ],
  "category": "group",
  "desc": "Rekap aktivitas grup 24 jam: user paling aktif, command terpopuler, total pesan",
  "usage": ".groupsummary [jam]",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "cooldown": 10,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
