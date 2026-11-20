// Fitur canvas/o-p302 — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("canvas/p302", {
  "name": "p302",
  "command": [
    "p302"
  ],
  "category": "image",
  "desc": "Buat logo 3D metal (p302)",
  "usage": ".p302 <teks>",
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
