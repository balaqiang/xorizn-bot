// Fitur owner/jpmslide — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("owner/jpmslide", {
  "name": "jpmslide",
  "command": [
    "jpmslide"
  ],
  "category": "owner",
  "desc": "JPM carousel/slide ke semua grup yang diikuti bot",
  "usage": ".jpmslide",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 30,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
