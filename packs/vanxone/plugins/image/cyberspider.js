// Fitur canvas/cyberspider — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("canvas/cyberspider", {
  "name": "cyberspider",
  "command": [
    "cyberspider"
  ],
  "category": "image",
  "desc": "Bikin card cyber spider dari fotomu",
  "usage": ".cyberspider <teks> (reply/kirim foto)",
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
