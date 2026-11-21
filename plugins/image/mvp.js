// Fitur canvas/mvp — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("canvas/mvp", {
  "name": "mvp",
  "command": [
    "mvp",
    "sertifikatmvp"
  ],
  "category": "image",
  "desc": "Buat sertifikat MVP",
  "usage": ".mvp <nama>",
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
