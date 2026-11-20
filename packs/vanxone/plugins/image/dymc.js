// Fitur canvas/dymc — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("canvas/dymc", {
  "name": "dymc",
  "command": [
    "dymc",
    "dynamiccircular"
  ],
  "category": "image",
  "desc": "Buat gambar dengan efek dynamic circular text",
  "usage": ".dymc <teks>",
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
