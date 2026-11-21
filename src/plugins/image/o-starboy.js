// Fitur canvas/o-starboy — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("canvas/starboy", {
  "name": "starboy",
  "command": [
    "starboy",
    "canvasstarboy",
    "efekstarboy"
  ],
  "category": "image",
  "desc": "Buat gambar efek Starboy dari foto",
  "usage": ".starboy <reply/kirim foto>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
