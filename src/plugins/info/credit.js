// Fitur main/credit — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("main/credit", {
  "name": "credit",
  "command": [
    "credit"
  ],
  "category": "info",
  "desc": "Menampilkan credit xorizn-bot.",
  "usage": ".credit",
  "owner": false,
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
