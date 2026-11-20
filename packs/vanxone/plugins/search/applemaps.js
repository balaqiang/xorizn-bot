// Fitur search/applemaps — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("search/applemaps", {
  "name": "applemaps",
  "command": [
    "applemaps",
    "maps",
    "applemap",
    "carilokasi"
  ],
  "category": "search",
  "desc": "Cari lokasi dan detail tempat menggunakan Apple Maps",
  "usage": ".applemaps <nama_tempat/lokasi>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
