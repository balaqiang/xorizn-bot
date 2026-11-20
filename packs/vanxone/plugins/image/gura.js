// Fitur canvas/gura — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("canvas/gura", {
  "name": "gura",
  "command": [
    "gura",
    "guracanvas"
  ],
  "category": "image",
  "desc": "Bikin efek canvas gura dari fotomu",
  "usage": ".gura (reply/kirim foto)",
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
