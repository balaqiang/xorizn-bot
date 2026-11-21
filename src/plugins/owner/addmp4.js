// Fitur owner/addmp4 — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("owner/addmp4", {
  "name": "addmp4",
  "command": [
    "addmp4",
    "addvideo",
    "tambahmp4",
    "setmp4",
    "addvid"
  ],
  "category": "owner",
  "desc": "Tambah video baru ke folder assets/video",
  "usage": ".addmp4 <nama_file.mp4> (reply video)",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
