// Fitur canvas/fakeff — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("canvas/fakeff", {
  "name": "fakeff",
  "command": [
    "fakeff"
  ],
  "category": "image",
  "desc": "Bikin gambar banner Fake FF (Solo)",
  "usage": ".fakeff <teks>|[bgNum]",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
