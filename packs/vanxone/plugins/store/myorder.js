// Fitur store/myorder — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("store/myorder", {
  "name": "myorder",
  "command": [
    "myorder",
    "orderku",
    "cekorder",
    "pesananku"
  ],
  "category": "store",
  "desc": "Lihat order kamu",
  "usage": ".myorder",
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
