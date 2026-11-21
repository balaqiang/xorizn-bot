// Fitur music/ringtone — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("music/ringtone", {
  "name": "ringtone",
  "command": [
    "ringtone"
  ],
  "category": "audio",
  "desc": "",
  "usage": "",
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
