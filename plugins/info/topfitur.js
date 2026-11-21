// Fitur info/topfitur — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("info/topfitur", {
  "name": "topfitur",
  "command": [
    "topfitur",
    "topfeature",
    "fiturterpakai",
    "topf",
    "rankfitur"
  ],
  "category": "info",
  "desc": "Melihat ranking fitur yang paling sering dipakai (global atau per grup)",
  "usage": ".topfitur [global/grup] [limit]",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 10,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
