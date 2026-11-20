// Fitur stalker/levelgd — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("stalker/levelgd", {
  "name": "levelgd",
  "command": [
    "levelgd",
    "detailgd",
    "gdlevel",
    "infolevel"
  ],
  "category": "stalker",
  "desc": "Lihat detail lengkap sebuah level Geometry Dash",
  "usage": ".levelgd <ID atau nama level>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 10,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
