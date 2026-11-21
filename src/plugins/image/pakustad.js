// Fitur canvas/pakustad — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("canvas/pakustad", {
  "name": "pakustad",
  "command": [
    "pakustad",
    "pak-ustad",
    "tanyaustad"
  ],
  "category": "image",
  "desc": "Tanya pak ustad (gambar)",
  "usage": ".pakustad <pertanyaan>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
