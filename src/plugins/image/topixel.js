// Fitur canvas/topixel — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("canvas/topixel", {
  "name": "topixel",
  "command": [
    "topixel"
  ],
  "category": "image",
  "desc": "Ubah foto kamu jadi gambar pixel art yang keren",
  "usage": ".topixel [level] (reply/kirim foto)",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
