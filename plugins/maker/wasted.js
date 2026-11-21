// Fitur maker/wasted — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("maker/wasted", {
  "name": "wasted",
  "command": [
    "wasted",
    "gta",
    "gtawasted"
  ],
  "category": "maker",
  "desc": "Efek wasted GTA pada foto",
  "usage": ".wasted (reply foto)",
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
