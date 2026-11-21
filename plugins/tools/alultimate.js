// Fitur tools/alultimate — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("tools/alultimate", {
  "name": "alultimate",
  "command": [
    "alultimate",
    "purestatus"
  ],
  "category": "tools",
  "desc": "Convert document/link to image/video HD (Anti-Buffering) v2",
  "usage": ".swhd2 [link / caption]",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 10,
  "energi": 10,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
