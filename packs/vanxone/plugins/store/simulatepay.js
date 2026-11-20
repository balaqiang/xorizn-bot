// Fitur store/simulatepay — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("store/simulatepay", {
  "name": "simulatepay",
  "command": [
    "simulatepay",
    "simpay",
    "testpay",
    "fakepay"
  ],
  "category": "store",
  "desc": "Simulasi pembayaran (sandbox only)",
  "usage": ".simulatepay <order_id>",
  "owner": true,
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
