// Fitur tools/hd4 — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("tools/hd4", {
  "name": "hd4",
  "command": [
    "hd4",
    "upscale4"
  ],
  "category": "tools",
  "desc": "Memperjelas resolusi gambar / dokumen foto (Upscale 4x)",
  "usage": ".hd4 <reply/kirim gambar atau dokumen foto>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 15,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
