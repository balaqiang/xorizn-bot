// Fitur owner/onlythisgrup — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/onlythisgrup", {
  "name": "onlythisgrup",
  "command": [
    "onlythisgrup",
    "onlythisgroup",
    "lockgrup",
    "lockgroup"
  ],
  "category": "owner",
  "desc": "Bot hanya aktif di grup ini saja",
  "usage": ".onlythisgrup",
  "owner": true,
  "group": true,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
