// Fitur canvas/afinitasml — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("canvas/afinitasml", {
  "name": "afinitasml",
  "command": [
    "afinitasml",
    "afinitas",
    "mlafinitas"
  ],
  "category": "image",
  "desc": "Bikin card afinitas ML dari fotomu",
  "usage": ".afinitasml (reply/kirim foto) [bgNum]",
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
