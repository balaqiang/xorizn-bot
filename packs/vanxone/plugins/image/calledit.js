// Fitur canvas/calledit — kode inti di engine/orbit
module.exports = require('../../lib/engine/orbit').plugin("canvas/calledit", {
  "name": "calledit",
  "command": [
    "calledit"
  ],
  "category": "image",
  "desc": "Membuat edit gambar call WhatsApp dari foto yang dikirim pengguna",
  "usage": ".calledit <waktu>/<nama> + foto",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 10,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
