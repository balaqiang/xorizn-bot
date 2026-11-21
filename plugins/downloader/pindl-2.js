// Fitur download/pindl — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("download/pindl", {
  "name": "pindl",
  "command": [
    "pindownload",
    "pintdl"
  ],
  "category": "downloader",
  "desc": "Download gambar/video dari Pinterest",
  "usage": ".pindl <url>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
