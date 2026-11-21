// Fitur tools/hd8 — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("tools/hd8", {
  "name": "hd8",
  "command": [
    "hd8",
    "remini8",
    "upscale1",
    "enhance8"
  ],
  "category": "tools",
  "desc": "Meningkatkan resolusi gambar hingga 4x lipat (Upscale v1)",
  "usage": ".hd8 [resolusi 2|4] (balas/kirim gambar)",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 10,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
