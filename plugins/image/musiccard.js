// Fitur canvas/musiccard — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("canvas/musiccard", {
  "name": "musiccard",
  "command": [
    "musiccard",
    "mcard",
    "spotifycard"
  ],
  "category": "image",
  "desc": "Membuat kartu musik (music card) keren dari gambar yang dikirim.",
  "usage": ".musiccard <judul>|<nama artis>",
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
