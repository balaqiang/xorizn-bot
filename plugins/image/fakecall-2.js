// Fitur canvas/fakecall — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("canvas/fakecall", {
  "name": "fakecallwa",
  "command": [
    "fakecallwa"
  ],
  "category": "image",
  "desc": "Membuat gambar fake call WhatsApp (Tersedia versi Android dan iOS)",
  "usage": ".fakecall nama | durasi",
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
