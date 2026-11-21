// Fitur canvas/vos — kode inti di engine/orbit
module.exports = require('../../lib/engine/orbit').plugin("canvas/vos", {
  "name": "vos",
  "command": [
    "vos",
    "quotevos"
  ],
  "category": "image",
  "desc": "Membuat kartu kata-kata HD dengan foto profil WhatsApp pengirim.",
  "usage": ".vos nama,kata kata",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
