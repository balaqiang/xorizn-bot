// Fitur tools/debiner — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("tools/debiner", {
  "name": "debiner",
  "command": [
    "debiner",
    "bintotext",
    "bin2teks",
    "decodebiner"
  ],
  "category": "tools",
  "desc": "Mengubah kode binary menjadi teks",
  "usage": ".debiner <binary>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 2,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
