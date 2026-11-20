// Fitur ai/editimage2 — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("ai/editimage2", {
  "name": "editimage2",
  "command": [
    "editimage2",
    "editimg2",
    "nanobanana2",
    "editfoto2"
  ],
  "category": "ai",
  "desc": "Edit gambar dengan AI (NanoBanana) lewat prompt",
  "usage": ".editimage2 <prompt> (kirim/reply gambar)",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 15,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
