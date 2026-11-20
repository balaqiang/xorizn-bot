// Fitur canvas/fakeff2 — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("canvas/fakeff2", {
  "name": "fakeff2",
  "command": [
    "fakeff2"
  ],
  "category": "image",
  "desc": "Bikin gambar banner Fake FF (Solo 2)",
  "usage": ".fakeff2 <teks>|[bgNum]",
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
