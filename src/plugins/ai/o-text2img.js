// Fitur ai/o-text2img — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("ai/text2img", {
  "name": "text2img",
  "command": [
    "text2img"
  ],
  "category": "ai",
  "desc": "Buat gambar dari teks",
  "usage": ".text2img <teks>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 1,
  "needs": {
    "apikeys": [
      "firefly"
    ],
    "scrapers": [],
    "assets": []
  }
})
