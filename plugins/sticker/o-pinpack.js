// Fitur sticker/o-pinpack — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("sticker/pinpack", {
  "name": "pinpack",
  "command": [
    "pinpack",
    "ppack",
    "pinsticker",
    "pinsearchpack"
  ],
  "category": "sticker",
  "desc": "Cari gambar Pinterest lalu jadikan sticker pack",
  "usage": ".pinpack <query>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 20,
  "energi": 3,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
