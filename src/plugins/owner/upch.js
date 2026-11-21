// Fitur owner/upch — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/upch", {
  "name": "upch",
  "command": [
    "uploadch",
    "uploadsaluran",
    "uch"
  ],
  "category": "owner",
  "desc": "Upload gambar, audio, video, atau teks ke saluran",
  "usage": ".upch <id saluran> <teks opsional>",
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
