// Fitur ai/o-xoriznbanana2 — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("ai/xoriznbanana2", {
  "name": "xoriznbanana2",
  "command": [
    "xoriznbanana2"
  ],
  "category": "ai",
  "desc": "Buat gambar dengan AI menggunakan prompt",
  "usage": ".xoriznbanana2 <prompt>",
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
