// Fitur canvas/darkangel — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("canvas/darkangel", {
  "name": "darkangel",
  "command": [
    "darkangel"
  ],
  "category": "image",
  "desc": "Bikin card dark angel dari fotomu",
  "usage": ".darkangel <teks> (reply/kirim foto)",
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
