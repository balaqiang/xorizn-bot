// Fitur tools/hd5 — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("tools/hd5", {
  "name": "hd5",
  "command": [
    "hd5",
    "upscale5",
    "hdlocal"
  ],
  "category": "tools",
  "desc": "Memperjelas resolusi gambar (Local Sharp Engine)",
  "usage": ".hd5 <reply/kirim gambar atau dokumen foto>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
