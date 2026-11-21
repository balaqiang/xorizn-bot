// Fitur tools/tesautopostch — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("tools/tesautopostch", {
  "name": "tesautopostch",
  "command": [
    "tesautopostch",
    "testch",
    "testautopost"
  ],
  "category": "tools",
  "desc": "Test autopost ke channel sekarang",
  "usage": ".tesautopostch [pagi/siang/sore/malam]",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
