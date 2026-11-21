// Fitur canvas/codesnap — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("canvas/codesnap", {
  "name": "codesnap",
  "command": [
    "codesnap"
  ],
  "category": "image",
  "desc": "Bikin gambar cuplikan code",
  "usage": ".codesnap <code>",
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
