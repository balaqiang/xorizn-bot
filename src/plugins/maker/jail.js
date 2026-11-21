// Fitur maker/jail — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("maker/jail", {
  "name": "jail",
  "command": [
    "jail",
    "penjara",
    "prison"
  ],
  "category": "maker",
  "desc": "Efek penjara pada foto",
  "usage": ".jail (reply foto)",
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
