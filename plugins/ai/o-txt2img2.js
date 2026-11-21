// Fitur ai/o-txt2img2 — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("ai/txt2img2", {
  "name": "text2img4",
  "command": [
    "text2img4",
    "imggen2",
    "flux"
  ],
  "category": "ai",
  "desc": "Buat gambar dari teks pakai Flux Klein 4B",
  "usage": ".txt2img2 <deskripsi gambar>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 30,
  "energi": 3,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
