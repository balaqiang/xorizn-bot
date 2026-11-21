// Fitur tools/hd2 — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("tools/hd2", {
  "name": "hd2",
  "command": [
    "hd2",
    "enhance2",
    "upscale2",
    "aienhancer"
  ],
  "category": "tools",
  "desc": "Enhance gambar menjadi HD dengan AI (V3)",
  "usage": ".hd2 (reply gambar)",
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
