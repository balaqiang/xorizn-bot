// Fitur store/confirmorder — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("store/confirmorder", {
  "name": "confirmorder",
  "command": [
    "confirmorder",
    "konfirmorder",
    "selesaiorder",
    "doneorder"
  ],
  "category": "store",
  "desc": "Konfirmasi order (Admin)",
  "usage": ".confirmorder <order_id>",
  "owner": false,
  "group": true,
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
