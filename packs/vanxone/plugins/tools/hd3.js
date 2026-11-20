// Fitur tools/hd3 — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("tools/hd3", {
  "name": "hd3",
  "command": [
    "hd3",
    "enhance3",
    "upscale3",
    "unblur"
  ],
  "category": "tools",
  "desc": "Memperjelas gambar blur menjadi tajam dengan AI (Unblur)",
  "usage": ".hd3 (reply gambar)",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 20,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
