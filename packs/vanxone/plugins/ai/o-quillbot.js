// Fitur ai/o-quillbot — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("ai/quillbot", {
  "name": "quilbot",
  "command": [
    "quilbot",
    "quillbot",
    "parafrase"
  ],
  "category": "ai",
  "desc": "AI Quillbot untuk menulis ulang atau menyempurnakan kalimat",
  "usage": ".quilbot <teks>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
