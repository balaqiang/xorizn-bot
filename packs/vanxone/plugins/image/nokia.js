// Fitur canvas/nokia — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("canvas/nokia", {
  "name": "nokia",
  "command": [
    "nokia"
  ],
  "category": "image",
  "desc": "Buat meme nokia",
  "usage": ".nokia <nama> | <pesan>",
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
