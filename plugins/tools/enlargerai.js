// Fitur tools/enlargerai — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("tools/enlargerai", {
  "name": "enlargerai",
  "command": [
    "enlargerai",
    "enlargeraiphotos",
    "enlarger"
  ],
  "category": "tools",
  "desc": "Meningkatkan kualitas gambar (HD, Retouch, Sharpen) dengan Enlargerai",
  "usage": ".enlargerai [mode] [reply/kirim gambar]",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 10,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
