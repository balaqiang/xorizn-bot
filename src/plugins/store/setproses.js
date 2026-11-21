// Fitur store/setproses — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("store/setproses", {
  "name": "setproses",
  "command": [
    "setproses",
    "prosesconfig",
    "configproses"
  ],
  "category": "store",
  "desc": "Set template untuk .proses",
  "usage": ".setproses template <full text>",
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
