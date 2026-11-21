// Fitur store/proses — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("store/proses", {
  "name": "proses",
  "command": [
    "proses",
    "prs",
    "process"
  ],
  "category": "store",
  "desc": "Mulai proses transaksi dengan buyer",
  "usage": ".prs",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
