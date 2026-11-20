// Fitur ai/o-ourinbanana2 — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("ai/ourinbanana2", {
  "name": "ourinbanana2",
  "command": [
    "ourinbanana2"
  ],
  "category": "ai",
  "desc": "Buat gambar dengan AI menggunakan prompt",
  "usage": ".ourinbanana2 <prompt>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 30,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
