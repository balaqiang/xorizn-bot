// Fitur owner/srt — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/srt", {
  "name": "srt",
  "command": [
    "srt",
    "shufflereplythumb",
    "shufflereply"
  ],
  "category": "owner",
  "desc": "Sistem Shuffle Reply Thumb (SRT) untuk reply random image interaktif",
  "usage": ".srt on",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 0,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
