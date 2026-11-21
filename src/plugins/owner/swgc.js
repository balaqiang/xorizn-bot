// Fitur owner/swgc — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/swgc", {
  "name": "swgc",
  "command": [
    "swgroup",
    "groupstory",
    "toswgc"
  ],
  "category": "owner",
  "desc": "Post Group Status/Story ke grup pilihan (border hijau)",
  "usage": ".swgc <teks> atau reply media",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
