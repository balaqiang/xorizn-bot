// Fitur tools/sstablet — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("tools/sstablet", {
  "name": "sstablet",
  "command": [
    "sstablet",
    "sstab",
    "sweb"
  ],
  "category": "tools",
  "desc": "Mengambil screenshot website tampilan tablet",
  "usage": ".sstablet <url>",
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
