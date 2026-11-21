// Fitur owner/upaudioch — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("owner/upaudioch", {
  "name": "upaudioch",
  "command": [
    "upaudioch",
    "tovnsaluran",
    "uploadaudioch",
    "upaudiosaluran"
  ],
  "category": "owner",
  "desc": "Upload audio ke saluran (channel) WhatsApp",
  "usage": ".upaudioch (reply audio) <teks>",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 10,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
