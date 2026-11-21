// Fitur store/cancelproses — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("store/cancelproses", {
  "name": "cancelproses",
  "command": [
    "cancelproses",
    "batalproses",
    "canceltrx"
  ],
  "category": "store",
  "desc": "Batalkan proses transaksi",
  "usage": ".cancelproses @buyer",
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
