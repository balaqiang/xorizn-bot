// Fitur canvas/afinitasml2 — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("canvas/afinitasml2", {
  "name": "afinitasml2",
  "command": [
    "afinitasml2"
  ],
  "category": "image",
  "desc": "Bikin card afinitas ML (versi 2) dari fotomu",
  "usage": ".afinitasml2 (reply/kirim foto)",
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
