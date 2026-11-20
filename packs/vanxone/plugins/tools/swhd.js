// Fitur tools/swhd — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("tools/swhd", {
  "name": "swhd",
  "command": [
    "swhd"
  ],
  "category": "tools",
  "desc": "Balikin document (video/gambar/sticker/audio yang dikirim sebagai file) jadi media aslinya",
  "usage": ".swhd (reply document) [caption]",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
