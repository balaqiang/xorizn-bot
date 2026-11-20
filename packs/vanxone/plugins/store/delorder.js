// Fitur store/delorder — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("store/delorder", {
  "name": "delorder",
  "command": [
    "delorder"
  ],
  "category": "store",
  "desc": "Imported from Rimuru MD V4.6",
  "usage": "",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
