// Fitur owner/otakatik — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/otakatik", {
  "name": "otakatik",
  "command": [
    "otakatik",
    "wip",
    "tinker"
  ],
  "category": "owner",
  "desc": "Tandain/lepas plugin sebagai ",
  "usage": ".otakatik <name/alias plugin>",
  "owner": true,
  "group": false,
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
