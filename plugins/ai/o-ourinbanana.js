// Fitur ai/o-ourinbanana — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("ai/ourinbanana", {
  "name": "ourinbanana",
  "command": [
    "ourinbanana"
  ],
  "category": "ai",
  "desc": "Edit gambar dengan AI menggunakan prompt",
  "usage": ".ourinbanana <prompt>",
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
