// Fitur tools/ebinary — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("tools/ebinary", {
  "name": "ebinary",
  "command": [
    "ebinary",
    "encodebinary",
    "text2binary"
  ],
  "category": "tools",
  "desc": "Encode teks menjadi binary",
  "usage": ".ebinary <teks>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
