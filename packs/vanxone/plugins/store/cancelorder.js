// Fitur store/cancelorder — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("store/cancelorder", {
  "name": "cancelorder",
  "command": [
    "cancelorder",
    "batalorder",
    "batalkanorder"
  ],
  "category": "store",
  "desc": "Batalkan order",
  "usage": ".cancelorder <order_id>",
  "owner": false,
  "group": true,
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
