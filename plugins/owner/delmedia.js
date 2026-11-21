// Fitur owner/delmedia — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/delmedia", {
  "name": "delmedia",
  "command": [
    "delmedia",
    "hapusmedia",
    "deletemedia",
    "delasset"
  ],
  "category": "owner",
  "desc": "Hapus override URL aset (balik ke URL di config.js)",
  "usage": ".delmedia <grup> <nama-aset>",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
