// Fitur group/automedia — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("group/automedia", {
  "name": "automedia",
  "command": [
    "automedia",
    "automedi"
  ],
  "category": "group",
  "desc": "Toggle auto media - otomatis jadikan sticker jadi gambar/video",
  "usage": ".automedia on/off",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "admin": true,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
