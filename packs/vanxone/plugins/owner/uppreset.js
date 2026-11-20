// Fitur owner/uppreset — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("owner/uppreset", {
  "name": "uppreset",
  "command": [
    "uppreset",
    "uploadpreset",
    "sendpreset"
  ],
  "category": "owner",
  "desc": "Upload preset ke channel",
  "usage": ".uppreset link5mb | linkxml | caption",
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
