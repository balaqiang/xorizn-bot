// Fitur jpm/jpmupdate — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("jpm/jpmupdate", {
  "name": "jpmupdate",
  "command": [
    "jpmupdate",
    "updatejpm",
    "broadcastupdate",
    "shareupdate"
  ],
  "category": "broadcast",
  "desc": "Kirim update/changelog ke semua grup",
  "usage": ".jpmupdate <versi> | <changelog>",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 60,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
