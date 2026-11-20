// Fitur main/order2 — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("main/order2", {
  "name": "sewa2",
  "command": [
    "sewa2",
    "premium2"
  ],
  "category": "info",
  "desc": "Varian paket sewa/premium dari Tensura.",
  "usage": ".sewa2 <kode>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
