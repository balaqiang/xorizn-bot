// Fitur owner/autopost — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("owner/autopost", {
  "name": "autopost",
  "command": [
    "autopost",
    "apost",
    "autopostchannel"
  ],
  "category": "owner",
  "desc": "Auto post gambar random ke channel/saluran (NEWSLETTER)",
  "usage": ".autopost <on/off/set>",
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
