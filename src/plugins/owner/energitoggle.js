// Fitur owner/energitoggle — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("owner/energitoggle", {
  "name": "offenergi",
  "command": [
    "offenergi",
    "onenergi"
  ],
  "category": "owner",
  "desc": "Enable/disable sistem energi",
  "usage": ".disableenergi atau .enableenergi",
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
