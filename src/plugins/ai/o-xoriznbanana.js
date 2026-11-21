// Fitur ai/o-xoriznbanana — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("ai/xoriznbanana", {
  "name": "xoriznbanana",
  "command": [
    "xoriznbanana"
  ],
  "category": "ai",
  "desc": "Edit gambar dengan AI menggunakan prompt",
  "usage": ".xoriznbanana <prompt>",
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
