// Fitur tools/o-videotranscribe — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("tools/videotranscribe", {
  "name": "videotranscribe",
  "command": [
    "videotranscribe",
    "video-transcribe",
    "transkripvideo"
  ],
  "category": "tools",
  "desc": "Transkrip video dari URL menjadi teks (YouTube, mp4, dll)",
  "usage": ".video-transcribe <url> [lang]",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 30,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
