// Fitur owner/toggleenergi — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/toggleenergi", {
  "name": "toggle-energi",
  "command": [
    "toggle-energi",
    "tglenergy",
    "unlimit"
  ],
  "category": "owner",
  "desc": "⚡ Atur apakah user butuh energi atau gratisan!",
  "usage": ".toggle-energi <on/off>",
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
