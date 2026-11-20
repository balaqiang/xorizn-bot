// Fitur group/onlyadmingc — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("group/onlyadmingc", {
  "name": "onlyadmingc",
  "command": [
    "onlyadmingc",
    "adminonlygc",
    "oagc"
  ],
  "category": "group",
  "desc": "Atur onlyadmin per grup (terpisah dari onlyadmin global)",
  "usage": ".onlyadmingc on|off|default|cek",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "cooldown": 0,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
